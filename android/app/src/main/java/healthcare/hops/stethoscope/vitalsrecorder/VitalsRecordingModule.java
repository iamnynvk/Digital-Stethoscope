package healthcare.hops.stethoscope.vitalsrecorder;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.hops.hops_device_libraries.ConnectDevice;
import com.hops.hops_device_libraries.DeviceData;
import com.hops.hops_device_libraries.OnConnectionListener;
import com.hops.hops_device_libraries.enums.Devices;
import com.hops.hops_device_libraries.enums.OperationStatus;

import org.jetbrains.annotations.NotNull;

import healthcare.hops.stethoscope.MainApplication;
import healthcare.hops.stethoscope.R;

import static healthcare.hops.stethoscope.vitalsrecorder.PermissionUtils.PERMISSIONS;
import static healthcare.hops.stethoscope.vitalsrecorder.PermissionUtils.checkPermissions;
import static healthcare.hops.stethoscope.vitalsrecorder.PermissionUtils.requestPermission;
import static healthcare.hops.stethoscope.vitalsrecorder.PermissionUtils.startAppSettingsConfigActivity;

import java.io.File;

public class VitalsRecordingModule extends ReactContextBaseJavaModule implements PermissionListener, ActivityEventListener, PermissionAwareActivity,
        DefaultHardwareBackBtnHandler {

    private final String TAG = VitalsRecordingModule.class.getSimpleName();

    private final ReactApplicationContext applicationContext;
    private DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;
    private OnConnectionListener connectionListener = null;
    private PermissionListener permissionListener;
    private boolean running;

    private final Handler mHandler = new Handler(Looper.getMainLooper());
    private ProgressDialog progressDialog = null;

    private Callback initializeCallback;
    private Callback recordingCallback = null;

    private int gain;


    VitalsRecordingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.applicationContext = reactContext;
        reactContext.addActivityEventListener(this);
    }

    @NotNull
    @Override
    public String getName() {
        return Constant.MODULE_NAME;
    }

    /**
     * Configures the recorder.
     */
    @ReactMethod
    public void init(String peripheralId, Callback callback) {
        if (running)
            return;

        initializeCallback = callback;
        if (eventEmitter == null)
            eventEmitter = applicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class);
        initConnectionListener();

        if (checkPermissions(applicationContext, PERMISSIONS)) {
            ConnectDevice.getInstance(getCurrentActivity()).setupDevice(Devices.HOPS_STETHO, connectionListener);
        } else {
            PermissionAwareActivity permissionAwareActivity = (PermissionAwareActivity) getCurrentActivity();
            if (permissionAwareActivity == null)
                handleInitializeFailure(Constant.ACTIVITY_ERROR, "Can't find current Activity", false);
            else
                requestPermission(permissionAwareActivity, ConnectDevice.PERMISSION_CALLBACK_CONSTANT, this);
        }
    }

    /**
     * Begins recording and capturing data.
     */
    @ReactMethod
    public void startRecording(int seconds, int gain, Callback success, Callback error) {
        this.gain = gain;
        Log.e(TAG,"Gain :>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+ gain);
        if (!running) {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity == null) {
                WritableMap response = null;
                response.putString("error", "Can't find current Activity");
                error.invoke(response);
                return;
            }
            try {
                recordingCallback = success;
                ConnectDevice.getInstance(currentActivity).recordStartData(seconds);
            } catch (Exception e) {
                e.printStackTrace();
                error.invoke(e.getMessage());
            }
        }
    }

    /**
     * Stops recording.
     */
    @ReactMethod
    public void stopRecording() {
        try {
            running = false;
            ConnectDevice.getInstance(getCurrentActivity()).recordStopData();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Releases resources associated with ble manager.
     */
    public void release() {
        try {
            running = false;
            ConnectDevice.getInstance(getCurrentActivity()).clearAllData();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * Initialize listener for message and getting data of device.
     */
    private void initConnectionListener() {
        connectionListener = new OnConnectionListener() {
            @Override
            public void onMessage(Devices devices, OperationStatus operationStatus) {
                sendMessageEvent(operationStatus);
            }

            @Override
            public void onData(Devices devices, DeviceData deviceData) {
                if (devices == Devices.HOPS_STETHO) {
                    getRecordedFile(deviceData);
                    sendAmplitudeEvent((int)deviceData.getAmplitude());
                }
            }
        };
    }

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (permissionListener != null && permissionListener.onRequestPermissionsResult(requestCode, permissions, grantResults)) {
            permissionListener = null;
        }
        if (requestCode == ConnectDevice.PERMISSION_CALLBACK_CONSTANT) {
            boolean anyPermissionDenied = false;
            boolean neverAskAgainSelected = false;

            // Check if any permission asked has been denied
            for (int i = 0; i < grantResults.length; i++) {
                if (grantResults[i] != PackageManager.PERMISSION_GRANTED) {
                    anyPermissionDenied = true;
                    //check if user select "never ask again" when denying any permission
                    if (!PermissionUtils.shouldShowRequestPermissionRationale(getCurrentActivity(), permissions[i])) {
                        neverAskAgainSelected = true;
                    }
                }
            }
            if (!anyPermissionDenied) {
                // All Permissions asked were granted! Yey!
                Activity currentActivity = getCurrentActivity();
                if (currentActivity != null) {
                    ConnectDevice.getInstance(currentActivity).setupDevice(Devices.HOPS_STETHO, connectionListener);
                }
            } else {
                // The user has just denied one or all of the permissions
                String message;
                String buttonText = neverAskAgainSelected ? applicationContext.getString(R.string.label_setting) :
                       applicationContext.getString(R.string.label_Ok);
                DialogInterface.OnClickListener listener;
                if (neverAskAgainSelected) {
                    //This message is displayed after the user has checked never ask again checkbox.
                    message = applicationContext.getString(R.string.permission_denied_never_ask_again_dialog_message);
                    listener = (dialog, which) -> {
                        //this will be executed if User clicks OK button. This is gonna take the user to the App Settings
                        startAppSettingsConfigActivity(applicationContext);
                    };
                } else {
                    //This message is displayed while the user hasn't checked never ask again checkbox.
                    message = applicationContext.getString(R.string.permission_denied_dialog_message);
                    listener = null;
                }

                new AlertDialog.Builder(getCurrentActivity())
                        .setMessage(message)
                        .setPositiveButton(buttonText, listener)
                        .create()
                        .show();
                handleInitializeFailure(Constant.PERMISSION_DENIED, applicationContext.getString(R.string.permission_refused_message), false);
            }
        }
        return false;
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
       /* if (initializeCallback == null)
            return;*/

        if (requestCode == ConnectDevice.REQUEST_ENABLE_BT) {
            if (resultCode == Activity.RESULT_OK) {
                ConnectDevice.getInstance(getCurrentActivity()).scanAgain();
            } else {
                handleInitializeFailure(String.valueOf(OperationStatus.BLE_NOT_ENABLED), applicationContext.getString(R.string.bluetooth_refused_message), true);
            }
        } else if (requestCode == ConnectDevice.GPS_REQUEST) {
            if (resultCode == Activity.RESULT_OK) {
                ConnectDevice.getInstance(getCurrentActivity()).scanAgain();
            } else {
                Log.i(TAG, "GPS is not enabled");
                //TODO : Implement flow after gps is denied by user
            }
        }
    }


    /**
     * Called when a new intent is passed to the activity
     */
    @Override
    public void onNewIntent(Intent intent) {

    }

    /**
     * By default, all onBackPress() calls should not execute the default back press handler and should
     * instead propagate it to the JS instance. If JS doesn't want to handle the back press itself,
     * it shall call back into native to invoke this function which should execute the default handler
     */
    @Override
    public void invokeDefaultOnBackPressed() {
        release();
    }

    /**
     * Get the audio file.
     */
    private void getRecordedFile(DeviceData deviceData) {
        try {
            if (!TextUtils.isEmpty(deviceData.getSethoFilePath())) {
                    WritableMap fileMap = createFileMap(deviceData.getSethoFilePath(),
                            deviceData.getFileDuration());
                    recordingCallback.invoke(fileMap);
                }
        } catch (Exception e) {
            Log.i(TAG, "Get Recorded File exception : " + e.getMessage());
        }
    }

    /**
     * Send an event with some data to the JS react native side
     *
     * @param maxAmplitude the maximum absolute amplitude measured since the last call, or
     *                     0 when called for the first time.
     */
    private void sendAmplitudeEvent(int maxAmplitude) {

        WritableMap obj = Arguments.createMap();
        /*double dB = -160;
        double maxAudioSize = 32767;
        if (maxAmplitude > 0) {
            dB = 20 * Math.log10(maxAmplitude / maxAudioSize);
        }*/

        obj.putInt(Constant.CURRENT_METERING, maxAmplitude);
        sendEvent(applicationContext, Constant.EVENT_AMPLITUDE, obj);
    }

    /**
     * Send an event when an error occurs or change occurs in the device status.
     */
    private void sendMessageEvent(OperationStatus operationStatus) {
        WritableMap obj = Arguments.createMap();
        obj.putString(Constant.MESSAGE_CODE, String.valueOf(operationStatus));
        sendEvent(applicationContext, Constant.EVENT_MESSAGE, obj);
        if (operationStatus == OperationStatus.BLE_NOT_SUPPORTED) {
            handleInitializeFailure(operationStatus.toString(), applicationContext.getString(R.string.ble_not_supported), true);
        } else if (operationStatus == OperationStatus.SCANNING) {
            //showProgressDialog();
        } else if (operationStatus == OperationStatus.DEVICE_CONNECTED) {
            hideProgressDialog(0);
            if (initializeCallback != null) {
                initializeCallback.invoke();
                initializeCallback = null;
            }
        } else if (operationStatus == OperationStatus.DEVICE_NOT_FOUND) {
            hideProgressDialog(0);
            handleInitializeFailure(operationStatus.toString(), applicationContext.getString(R.string.device_not_found), true);
        } else if (operationStatus == OperationStatus.DEVICE_DISCONNECTED) {
            hideProgressDialog(0);
            handleInitializeFailure(operationStatus.toString(), applicationContext.getString(R.string.device_disconnected), true);
        } else if (operationStatus == OperationStatus.DEVICE_START_RECODING) {
            running = true;
        } else if (operationStatus == OperationStatus.DEVICE_STOP_RECODING) {
            running = false;
        } else {
            hideProgressDialog(0);
        }
    }

    private void handleInitializeFailure(String code, String message, boolean shouldShowAlert) {
        if (initializeCallback != null) {
            WritableMap map = Arguments.createMap();
            map.putString(Constant.MESSAGE_CODE, code);
            map.putString(Constant.MESSAGE, message);
            map.putBoolean(Constant.SHOULD_SHOW_ALERT, shouldShowAlert);
            initializeCallback.invoke(map);
            initializeCallback = null;
        }
    }

    /**
     * Emits an event with some data to the JS react native side
     *
     * @param reactContext The application context.
     * @param eventName    The event to emit.
     * @param params       The data.
     */
    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    /**
     * Returns a writable map.
     *
     * @return WritableMap
     */
    private WritableMap createFileMap(String filePath, int fileDuration) {
        WritableMap map = Arguments.createMap();
        map.putString(Constant.FILE_PATH, filePath);
        map.putInt(Constant.FILE_DURATION, fileDuration);
        return map;
    }

    /**
     * A dialog showing a progress indicator and an optional text message or
     * view. Only a text message or a view can be used at the same time.
     * The dialog can't be  cancelable on back key press.
     */
    private void showProgressDialog() {
        if (applicationContext != null) {
            new Handler(Looper.getMainLooper()).post(() -> {
                // Work in the UI thread
                try {
                    if (progressDialog == null) {
                        progressDialog = new ProgressDialog(getCurrentActivity());
                        progressDialog.setMessage(applicationContext.getString(R.string.scanning));
                        progressDialog.setCancelable(false);
                        progressDialog.show();

                    } else if (!progressDialog.isShowing()) {
                        progressDialog.show();
                    }
                } catch (RuntimeException e) {
                    e.printStackTrace();
                }
            });
        }
    }

    /**
     * Dismiss this dialog, removing it from the screen. This method can be
     * invoked safely from any thread. Note that you should not override this
     * method to do cleanup when the dialog is dismissed
     */
    private void hideProgressDialog(long delayResponseTime) {
        mHandler.postDelayed(() -> {
            try {
                if (isShowingProgress()) {
                    progressDialog.dismiss();
                    progressDialog = null;
                }
            } catch (Exception e) {
                Log.i(TAG, "Exception" + e.getMessage());
            } finally {
                progressDialog = null;
            }
        }, delayResponseTime);
    }


    /**
     * @return -
     * Returns Whether the dialog is currently showing.
     */
    public boolean isShowingProgress() {
        if (progressDialog != null)
            return progressDialog.isShowing();
        else
            return false;
    }

    @Override
    public int checkPermission(String permission, int pid, int uid) {
        return 0;
    }

    @Override
    public int checkSelfPermission(String permission) {
        return 0;
    }

    @Override
    public boolean shouldShowRequestPermissionRationale(String permission) {
        return false;
    }

    @Override
    public void requestPermissions(String[] permissions, int requestCode, PermissionListener listener) {
        permissionListener = listener;
        requestPermissions(permissions, requestCode, listener);
    }

}

