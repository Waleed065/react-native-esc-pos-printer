package com.escposprinter;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.module.annotations.ReactModule;

import java.util.HashMap;
import java.util.Map;
import android.content.Context;

import com.epson.epos2.discovery.Discovery;
import com.epson.epos2.discovery.DiscoveryListener;
import com.epson.epos2.discovery.FilterOption;
import com.epson.epos2.discovery.DeviceInfo;
import com.epson.epos2.Epos2Exception;

import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;

import com.google.android.gms.location.*;
import com.google.android.gms.tasks.*;
import android.content.IntentSender;
import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.common.api.CommonStatusCodes;

import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.ConnectionResult;

import com.escposprinter.EposStringHelper;
import com.escposprinter.NativeEscPosPrinterDiscoverySpec;

import java.util.ArrayList;
import java.util.List;


@ReactModule(name = EscPosPrinterDiscoveryModule.NAME)
public class EscPosPrinterDiscoveryModule extends NativeEscPosPrinterDiscoverySpec implements ActivityEventListener {

  private Context mContext;

  private List<DeviceInfo> mDeviceList = new ArrayList<>();

  private final ReactApplicationContext reactContext;

  public static final String NAME = "EscPosPrinterDiscovery";
  private static final int REQUEST_ENABLE_LOCATION_SETTINGS = 21001;
  private static final String LOCATION_SETTING_ERROR_CODE = String.valueOf(Epos2Exception.ERR_FAILURE);

  @Nullable
  private Promise pendingLocationSettingPromise;

  public EscPosPrinterDiscoveryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    mContext = reactContext;
    reactContext.addActivityEventListener(this);
  }

  protected Map<String, Object> getTypedExportedConstants() {
    return EposStringHelper.getDiscoveryConstants();
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    if (requestCode != REQUEST_ENABLE_LOCATION_SETTINGS) {
      return;
    }

    if (resultCode == Activity.RESULT_OK) {
      emitEnableLocationSettingSuccess();
      resolvePendingLocationSettingPromise();
    } else {
      emitEnableLocationSettingFailure();
      rejectPendingLocationSettingPromise(LOCATION_SETTING_ERROR_CODE);
    }
  }

  @Override
  public void onNewIntent(Intent intent) {

  }


  public boolean isGoogleServiceAvailable() {
    return GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(reactContext) == ConnectionResult.SUCCESS;
  }

  private void resolvePendingLocationSettingPromise() {
    if (pendingLocationSettingPromise != null) {
      pendingLocationSettingPromise.resolve(null);
      pendingLocationSettingPromise = null;
    }
  }

  private void rejectPendingLocationSettingPromise(String errorMessage) {
    if (pendingLocationSettingPromise != null) {
      pendingLocationSettingPromise.reject("event_failure", errorMessage);
      pendingLocationSettingPromise = null;
    }
  }

  @ReactMethod
  public void enableLocationSetting(Promise promise) {
    if (pendingLocationSettingPromise != null) {
      promise.reject("event_failure", String.valueOf(Epos2Exception.ERR_PROCESSING));
      return;
    }

    boolean isGoogleServiceAvailable = isGoogleServiceAvailable();

    if (!isGoogleServiceAvailable) {
      promise.resolve(null);
      return;
    }

    Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      promise.reject("event_failure", String.valueOf(Epos2Exception.ERR_PARAM));
      return;
    }

    LocationRequest locationRequest = LocationRequest.create();
    locationRequest.setInterval(10000);
    locationRequest.setFastestInterval(5000);
    locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
    LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder().addLocationRequest(locationRequest);

    SettingsClient client = LocationServices.getSettingsClient(reactContext);
    Task<LocationSettingsResponse> task = client.checkLocationSettings(builder.build());

    task.addOnSuccessListener(new OnSuccessListener<LocationSettingsResponse>() {
      @Override
      public void onSuccess(LocationSettingsResponse locationSettingsResponse) {
        promise.resolve(null);
      }
    });

    task.addOnFailureListener(new OnFailureListener() {
      @Override
      public void onFailure(@NonNull Exception e) {
        if (e instanceof ResolvableApiException) {
          pendingLocationSettingPromise = promise;
          try {
            ResolvableApiException resolvable = (ResolvableApiException) e;
            resolvable.startResolutionForResult(currentActivity, REQUEST_ENABLE_LOCATION_SETTINGS);

          } catch (IntentSender.SendIntentException sendEx) {
            rejectPendingLocationSettingPromise(LOCATION_SETTING_ERROR_CODE);
            emitEnableLocationSettingFailure();
          }

          return;
        }

        emitEnableLocationSettingFailure();
        promise.reject("event_failure", LOCATION_SETTING_ERROR_CODE);
      }
    });
  }

  private void sendEvent(@Nullable WritableArray params) {
    emitOnDiscovery(params);
  }

  @ReactMethod
  public void startDiscovery(final ReadableMap paramsMap, Promise promise) {
    mDeviceList.clear();
    FilterOption mFilterOption = getFilterOptionsFromParams(paramsMap);

    try {
      Discovery.start(mContext, mFilterOption, mDiscoveryListener);

      promise.resolve(null);

    } catch (Epos2Exception e) {
      int status = ((Epos2Exception) e).getErrorStatus();
      promise.reject("event_failure", String.valueOf(status));
    }
  }

  @ReactMethod
  public void stopDiscovery(Promise promise) {
      try {
        Discovery.stop();
        promise.resolve(null);
      } catch (Epos2Exception e) {
        int status = ((Epos2Exception) e).getErrorStatus();
        promise.reject("event_failure", String.valueOf(status));
      }
  }

  private FilterOption getFilterOptionsFromParams(final ReadableMap paramsMap) {
    FilterOption mFilterOption = new FilterOption();

    if(paramsMap.hasKey("portType")) {
      mFilterOption.setPortType(paramsMap.getInt("portType"));
    }

    if(paramsMap.hasKey("broadcast")) {
      mFilterOption.setBroadcast(paramsMap.getString("broadcast"));
    }

    if(paramsMap.hasKey("deviceModel")) {
      mFilterOption.setDeviceModel(paramsMap.getInt("deviceModel"));
    }

    if(paramsMap.hasKey("epsonFilter")) {
      mFilterOption.setEpsonFilter(paramsMap.getInt("epsonFilter"));
    }

    if(paramsMap.hasKey("deviceType")) {
      mFilterOption.setDeviceType(paramsMap.getInt("deviceType"));
    }

    if(paramsMap.hasKey("bondedDevices")) {
      mFilterOption.setBondedDevices(paramsMap.getInt("bondedDevices"));
    }

    if(paramsMap.hasKey("usbDeviceName")) {
      mFilterOption.setUsbDeviceName(paramsMap.getInt("usbDeviceName"));
    }
    return mFilterOption;
  }

  private DiscoveryListener mDiscoveryListener = new DiscoveryListener() {
    @Override
    public void onDiscovery(final DeviceInfo deviceInfo) {

      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public synchronized void run() {
          mDeviceList.add(deviceInfo);

          WritableArray mPrinterList = Arguments.createArray();
          for (DeviceInfo device : mDeviceList) {
            WritableMap printerData = Arguments.createMap();
            printerData.putString("target", device.getTarget());
            printerData.putString("deviceName", device.getDeviceName());
            printerData.putString("ipAddress", device.getIpAddress());
            printerData.putString("macAddress", device.getMacAddress());
            printerData.putString("bdAddress", device.getBdAddress());
            mPrinterList.pushMap(printerData);
          }

          sendEvent(mPrinterList);
        }
      });
    }
  };

  @Override
  @ReactMethod
  public void pairBluetoothDevice(String macAddress, Promise promise) {
    promise.resolve(null);
  }
}
