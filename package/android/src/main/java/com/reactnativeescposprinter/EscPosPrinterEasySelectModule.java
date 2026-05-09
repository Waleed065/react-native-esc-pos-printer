package com.escposprinter;

import android.app.Activity;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.epson.easyselect.EasySelect;
import com.epson.easyselect.EasySelectDeviceType;
import com.epson.easyselect.EasySelectInfo;
import com.epson.epos2.Epos2Exception;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@ReactModule(name = EscPosPrinterEasySelectModule.NAME)
public class EscPosPrinterEasySelectModule extends NativeEscPosPrinterEasySelectSpec {
  public static final String NAME = "EscPosPrinterEasySelect";
  private static final String ERR_PARSE_FAILED = "-1";
  private static final String ERR_UNSUPPORTED = String.valueOf(Epos2Exception.ERR_UNSUPPORTED);
  private static final String ERR_PROCESSING = String.valueOf(Epos2Exception.ERR_PROCESSING);
  private static final String ERR_PARAM = String.valueOf(Epos2Exception.ERR_PARAM);
  private static final String ERR_TIMEOUT = String.valueOf(Epos2Exception.ERR_TIMEOUT);

  private final EasySelect easySelect;
  private final Handler mainHandler;

  private Promise pendingNfcPromise;
  private Runnable pendingNfcTimeoutRunnable;
  private NfcAdapter activeNfcAdapter;
  private Activity activeNfcActivity;

  public EscPosPrinterEasySelectModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.easySelect = new EasySelect();
    this.mainHandler = new Handler(Looper.getMainLooper());
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Override
  protected Map<String, Object> getTypedExportedConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("DEVICE_TYPE_TCP", EasySelectDeviceType.TCP);
    constants.put("DEVICE_TYPE_BLUETOOTH", EasySelectDeviceType.BLUETOOTH);
    constants.put("PARSE_NFC_TIMEOUT_DEFAULT", EasySelect.PARSE_NFC_TIMEOUT_DEFAULT);

    return constants;
  }

  @ReactMethod
  public void createQR(
    String printerName,
    double deviceType,
    String macAddress,
    Promise promise
  ) {
    try {
      String qrData = easySelect.createQR(printerName, (int) deviceType, macAddress);
      if (qrData == null || qrData.isEmpty()) {
        promise.reject("event_failure", ERR_PARSE_FAILED);
        return;
      }

      promise.resolve(qrData);
    } catch (Exception e) {
      promise.reject("event_failure", ERR_PARSE_FAILED, e);
    }
  }

  @ReactMethod
  public void parseQR(String data, Promise promise) {
    try {
      EasySelectInfo parsedInfo = easySelect.parseQR(data);
      if (parsedInfo == null) {
        promise.reject("event_failure", ERR_PARSE_FAILED);
        return;
      }

      promise.resolve(convertInfoToWritableMap(parsedInfo));
    } catch (Exception e) {
      promise.reject("event_failure", ERR_PARSE_FAILED, e);
    }
  }

  @ReactMethod
  public synchronized void parseNFC(double timeout, Promise promise) {
    if (pendingNfcPromise != null) {
      promise.reject("event_failure", ERR_PROCESSING);
      return;
    }

    Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      promise.reject("event_failure", ERR_PARAM);
      return;
    }

    NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(currentActivity);
    if (nfcAdapter == null || !nfcAdapter.isEnabled()) {
      promise.reject("event_failure", ERR_UNSUPPORTED);
      return;
    }

    final int timeoutMs = timeout > 0
      ? (int) timeout
      : EasySelect.PARSE_NFC_TIMEOUT_DEFAULT;

    pendingNfcPromise = promise;
    activeNfcAdapter = nfcAdapter;
    activeNfcActivity = currentActivity;

    pendingNfcTimeoutRunnable = new Runnable() {
      @Override
      public void run() {
        synchronized (EscPosPrinterEasySelectModule.this) {
          rejectPendingNfcPromise(ERR_TIMEOUT, null);
          disableReaderMode();
        }
      }
    };

    mainHandler.postDelayed(pendingNfcTimeoutRunnable, timeoutMs);

    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        try {
          activeNfcAdapter.enableReaderMode(
            activeNfcActivity,
            new NfcAdapter.ReaderCallback() {
              @Override
              public void onTagDiscovered(Tag tag) {
                handleDiscoveredNfcTag(tag, timeoutMs);
              }
            },
            NfcAdapter.FLAG_READER_NFC_A
              | NfcAdapter.FLAG_READER_NFC_B
              | NfcAdapter.FLAG_READER_NFC_F
              | NfcAdapter.FLAG_READER_NFC_V
              | NfcAdapter.FLAG_READER_NFC_BARCODE,
            null
          );
        } catch (Exception e) {
          synchronized (EscPosPrinterEasySelectModule.this) {
            rejectPendingNfcPromise(ERR_PARSE_FAILED, e);
            disableReaderMode();
          }
        }
      }
    });
  }

  @ReactMethod
  public void parseBeacon(
    String uuid,
    double major,
    double minor,
    double timeout,
    Promise promise
  ) {
    promise.reject("event_failure", ERR_UNSUPPORTED);
  }

  private void handleDiscoveredNfcTag(Tag tag, int timeoutMs) {
    synchronized (EscPosPrinterEasySelectModule.this) {
      try {
        ArrayList<EasySelectInfo> parsedInfos = easySelect.parseNFC(tag, timeoutMs);
        WritableArray result = Arguments.createArray();

        for (EasySelectInfo info : parsedInfos) {
          result.pushMap(convertInfoToWritableMap(info));
        }

        resolvePendingNfcPromise(result);
      } catch (Exception e) {
        rejectPendingNfcPromise(ERR_PARSE_FAILED, e);
      } finally {
        disableReaderMode();
      }
    }
  }

  private synchronized void resolvePendingNfcPromise(WritableArray result) {
    if (pendingNfcPromise != null) {
      pendingNfcPromise.resolve(result);
      clearPendingNfcState();
    }
  }

  private synchronized void rejectPendingNfcPromise(String code, Exception error) {
    if (pendingNfcPromise != null) {
      if (error == null) {
        pendingNfcPromise.reject("event_failure", code);
      } else {
        pendingNfcPromise.reject("event_failure", code, error);
      }
      clearPendingNfcState();
    }
  }

  private synchronized void clearPendingNfcState() {
    if (pendingNfcTimeoutRunnable != null) {
      mainHandler.removeCallbacks(pendingNfcTimeoutRunnable);
      pendingNfcTimeoutRunnable = null;
    }

    pendingNfcPromise = null;
  }

  private synchronized void disableReaderMode() {
    if (activeNfcAdapter != null && activeNfcActivity != null) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          try {
            activeNfcAdapter.disableReaderMode(activeNfcActivity);
          } catch (Exception ignored) {
          }
        }
      });
    }

    activeNfcAdapter = null;
    activeNfcActivity = null;
  }

  private WritableMap convertInfoToWritableMap(EasySelectInfo info) {
    WritableMap mappedInfo = Arguments.createMap();

    mappedInfo.putInt("deviceType", info.deviceType);
    mappedInfo.putString("printerName", info.printerName == null ? "" : info.printerName);
    mappedInfo.putString("macAddress", info.macAddress == null ? "" : info.macAddress);

    if (info.serialNumber != null) {
      mappedInfo.putString("serialNumber", info.serialNumber);
    }

    if (info.ssid != null) {
      mappedInfo.putString("ssid", info.ssid);
    }

    if (info.passphrase != null) {
      mappedInfo.putString("passphrase", info.passphrase);
    }

    return mappedInfo;
  }
}
