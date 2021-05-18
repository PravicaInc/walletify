package id.wiseapp;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.nfc.NfcAdapter;
import android.os.Build;

import androidx.annotation.RequiresApi;

import com.facebook.common.logging.FLog;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "wise";
  }
  @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP_MR1)
  @Override
  public void onResume() {
    super.onResume();

    String referrer = this.getReferrer().getHost();
    WritableMap params = Arguments.createMap();
    params.putString("sourceApplication", referrer);
    Intent intent = this.getIntent();
    super.onNewIntent(intent);
    ReactContext currentContext = super.getReactInstanceManager().getCurrentReactContext();
    if (currentContext == null) {
      FLog.w("Test", "Instance detached from instance manager");
    } else {
      currentContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("Linking", params);
    }
//
//      Activity currentActivity = this;
//
//      if (currentActivity != null) {
//        Intent intent = currentActivity.getIntent();
//        String action = intent.getAction();
//        Uri uri = intent.getData();
//
//        if (uri != null
//                && (Intent.ACTION_VIEW.equals(action)
//                || NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action))) {
//
//          WritableMap params2 = Arguments.createMap();
//          params2.putString("url", uri.toString());
//
//          getReactInstanceManager().getCurrentReactContext()
//                  .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                  .emit("url", params2);
//
//        }
//      }

  }
}
