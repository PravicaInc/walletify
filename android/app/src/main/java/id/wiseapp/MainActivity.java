package id.wiseapp;

import android.os.Build;
import androidx.annotation.RequiresApi;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
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
  public void onStop() {
    super.onStop();

    String referrer = this.getReferrer().getHost();
    String urlToken = this.getReferrer().getQueryParameter("token");
    WritableMap params = Arguments.createMap();
    params.putString("sourceApplication", referrer);
    params.putString("token", urlToken);

    getReactInstanceManager().getCurrentReactContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("Linking", params);
  }
}
