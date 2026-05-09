package com.escposprinter;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

import android.content.Context;

import com.epson.epos2.printer.Printer;
import com.epson.epos2.Epos2Exception;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;

import com.escposprinter.ThePrinterManager;
import com.escposprinter.ThePrinter;
import com.escposprinter.EposStringHelper;
import com.escposprinter.PrinterCallback;

import com.escposprinter.NativeEscPosPrinterSpec;


@ReactModule(name = EscPosPrinterModule.NAME)
public class EscPosPrinterModule extends NativeEscPosPrinterSpec {
    private Context mContext;
    private final ReactApplicationContext reactContext;
    private ThePrinterManager thePrinterManager_ = ThePrinterManager.getInstance();
    private int ERR_INIT = EposStringHelper.getInitErrorResultCode();
    public static final String NAME = "EscPosPrinter";

    public EscPosPrinterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        this.reactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    protected Map<String, Object> getTypedExportedConstants() {
      return EposStringHelper.getPrinterConstants();
    }

    @ReactMethod
    synchronized public void initWithPrinterDeviceName(String target, String deviceName, double lang, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);

      try {
        if (thePrinter == null) {
          thePrinter = new ThePrinter();
          thePrinterManager_.add(thePrinter, target);
          int series = EposStringHelper.getPrinterSeries(deviceName);
          thePrinter.setupWith(target, series, (int) lang, mContext);
        }

        Printer mPrinter = thePrinter.getEpos2Printer();

        if(mPrinter == null) {
          promise.reject(EposStringHelper.getErrorTextData(Epos2Exception.ERR_MEMORY, ""));
        } else {
          promise.resolve(null);
        }
        } catch(Exception e) {
          processError(promise,e, "");
        }
    }

    @ReactMethod
    synchronized public void connect(String target, double timeout, Promise promise) {
       new Thread(new Runnable() {
            @Override
            synchronized public void run() {
                ThePrinter thePrinter = thePrinterManager_.getObject(target);
                if (thePrinter == null) {
                  promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
                } else {
                  try {
                    thePrinter.connect((int) timeout);
                    promise.resolve(null);
                  } catch(Exception e) {
                    processError(promise,e, "");
                  }
                }
            }
        }).start();
    }

   @ReactMethod
    synchronized public void disconnect(String target, Promise promise) {
      new Thread(new Runnable() {
        @Override
        synchronized public void run() {
          ThePrinter thePrinter = thePrinterManager_.getObject(target);
          if (thePrinter == null) {
            promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
          } else {
            try {
              thePrinter.disconnect();
              promise.resolve(null);
            } catch(Exception e) {
              processError(promise,e, "");
            }
          }
        }
      }).start();
    }

    @ReactMethod
    synchronized public void clearCommandBuffer(String target, Promise promise){
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.clearCommandBuffer();
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void beginTransaction(String target, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.beginTransaction();
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void endTransaction(String target, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.endTransaction();
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addText(String target, String data, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
          try {
            thePrinter.addText(data);
            promise.resolve(null);
          } catch(Exception e) {
            processError(promise, e, "");
          }
      }
    }

    @ReactMethod
    synchronized public void addTextLang(String target, double lang, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
          try {
            thePrinter.addTextLang((int) lang);
            promise.resolve(null);
          } catch(Exception e) {
            processError(promise, e, "");
          }
      }
    }

    @ReactMethod
    synchronized public void addTextRotate(String target, double rotate, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addTextRotate((int) rotate);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addTextFont(String target, double font, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addTextFont((int) font);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addHPosition(String target, double x, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addHPosition((int) x);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addFeedUnit(String target, double unit, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addFeedUnit((int) unit);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addFeedLine(String target, double line, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addFeedLine((int) line);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addLineSpace(String target, double linespc, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addLineSpace((int) linespc);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addCut(String target, double type, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addCut((int) type);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addCommand(String target, String base64string, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addCommand(base64string);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addRotateBegin(String target, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addRotateBegin();
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addRotateEnd(String target, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addRotateEnd();
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addPulse(String target, double drawer, double time, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addPulse((int) drawer, (int) time);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addSound(String target, double pattern, double repeat, double cycle, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addSound((int) pattern, (int) repeat, (int) cycle);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addFeedPosition(String target, double position, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addFeedPosition((int) position);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addTextAlign(String target, double align, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addTextAlign((int) align);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addTextSize(String target, double width, double height, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addTextSize((int) width, (int) height);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addTextSmooth(String target, double smooth, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addTextSmooth((int) smooth);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addTextStyle(String target, double reverse, double ul, double em, double color, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addTextStyle((int) reverse, (int) ul, (int) em, (int) color);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }


    @ReactMethod
    synchronized public void addImage(String target, ReadableMap source, double width, double color,
                                      double mode, double halftone, double brightness, double compress, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addImage(source, mContext, (int) width, (int) color, (int) mode, (int) halftone, (int) brightness, (int) compress);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addLogo(String target, double key1, double key2, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addLogo((int) key1, (int) key2);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addBarcode(String target, String data, double type, double hri, double font, double width, double height, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addBarcode(data, (int) type, (int) hri, (int) font, (int) width, (int) height);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addSymbol(String target, String data, double type, double level, double width, double height, double size, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addSymbol(data, (int) type, (int) level, (int) width, (int) height, (int) size);
          promise.resolve(null);
        } catch(Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addPageBegin(String target, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addPageBegin();
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addPageEnd(String target, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addPageEnd();
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addPageArea(String target, double x, double y, double width, double height, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addPageArea((int) x, (int) y, (int) width, (int) height);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addPageDirection(String target, double direction, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addPageDirection((int) direction);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addPagePosition(String target, double x, double y, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addPagePosition((int) x, (int) y);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addPageLine(String target, double x1, double y1, double x2, double y2, double style, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addPageLine((int) x1, (int) y1, (int) x2, (int) y2, (int) style);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addPageRectangle(String target, double x1, double y1, double x2, double y2, double style, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addPageRectangle((int) x1, (int) y1, (int) x2, (int) y2, (int) style);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addHLine(String target, double x1, double x2, double style, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addHLine((int) x1, (int) x2, (int) style);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addVLineBegin(String target, double x, double style, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          int lineId = thePrinter.addVLineBegin((int) x, (int) style);
          promise.resolve(lineId);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addVLineEnd(String target, double lineId, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addVLineEnd((int) lineId);
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void addLayout(
      String target,
      double type,
      double width,
      double height,
      double marginTop,
      double marginBottom,
      double offsetCut,
      double offsetLabel,
      Promise promise
    ) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
      } else {
        try {
          thePrinter.addLayout(
            (int) type,
            (int) width,
            (int) height,
            (int) marginTop,
            (int) marginBottom,
            (int) offsetCut,
            (int) offsetLabel
          );
          promise.resolve(null);
        } catch (Exception e) {
          processError(promise, e, "");
        }
      }
    }

    @ReactMethod
    synchronized public void getStatus(String target, Promise promise) {
      new Thread(new Runnable() {
          @Override
          synchronized public void run() {
            ThePrinter thePrinter = thePrinterManager_.getObject(target);
            if (thePrinter == null) {
              promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, ""));
            } else {
              try {
                WritableMap data = thePrinter.getStatus();
                promise.resolve(data);
              } catch(Exception e) {
                processError(promise, e, "");
              }
            }
        }
      }).start();
    }

    @ReactMethod
    synchronized public void sendData(String target, double timeout, Promise promise) {
      ThePrinter thePrinter = thePrinterManager_.getObject(target);
      if (thePrinter == null) {
        promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, "result"));
      } else {
          try {
            thePrinter.sendData((int) timeout, new PrinterCallback() {
            @Override
            public void onSuccess(WritableMap returnData) {
              promise.resolve(returnData);
            }

            @Override
            public void onError(String errorData) {
              promise.reject(errorData);
            }
          });
        } catch(Exception e) {
            processError(promise, e, "result");
        }
      }
    }

    @ReactMethod
    synchronized public void getPrinterSetting(String target, double timeout, double type, Promise promise) {
        new Thread(new Runnable() {
      @Override
      synchronized public void run() {
          ThePrinter thePrinter = thePrinterManager_.getObject(target);
          if (thePrinter == null) {
            promise.reject(EposStringHelper.getErrorTextData(ERR_INIT, "result"));
          } else {
              try {
                thePrinter.getPrinterSetting((int) timeout, (int) type, new PrinterCallback() {
                @Override
                public void onSuccess(WritableMap returnData) {
                  promise.resolve(returnData);
                }

                @Override
                public void onError(String errorData) {
                  promise.reject(errorData);
                }
              });
            } catch(Exception e) {
                processError(promise, e, "result");
            }
          }
      }
        }).start();
    }

    private void  processError(Promise promise, Exception e, String errorType) {
      int errorCode;
      if (e instanceof Epos2Exception) {
        errorCode = ((Epos2Exception) e).getErrorStatus();
      } else {
        errorCode = Epos2Exception.ERR_FAILURE;
      }
      promise.reject(EposStringHelper.getErrorTextData(errorCode, errorType));
    }
}
