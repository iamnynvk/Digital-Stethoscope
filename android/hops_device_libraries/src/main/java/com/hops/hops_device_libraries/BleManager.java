package com.hops.hops_device_libraries;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothA2dp;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.media.AudioManager;
import android.media.MediaMetadataRetriever;
import android.media.MediaRecorder;
import android.os.CountDownTimer;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;

import com.hops.hops_device_libraries.enums.Devices;
import com.hops.hops_device_libraries.enums.OperationStatus;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.atomic.AtomicBoolean;


import static com.hops.hops_device_libraries.ConnectDevice.REQUEST_ENABLE_BT;

class BleManager {
    private final static String TAG = BleManager.class.getSimpleName();
    private Context mContext;
    private BluetoothAdapter mBluetoothAdapter;
    private final Handler mHandler = new Handler();
    // Stops scanning after 10 seconds.
    private static final long SCAN_PERIOD = 20000;
    private OnConnectionListener connectionListener;
    private BluetoothDevice mDevice;
    private CountDownTimer timer;
    String[] permissionsRequired = new String[]{
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.WRITE_EXTERNAL_STORAGE};

    private Devices andesfitDevice;
    private String uom = null;

    //Stethoscope
    BluetoothA2dp btA2dp;
    private final String deviceName = "Hops_Stetho";//CSR8645
    BroadcastReceiver mReceiver;
    AudioManager audioManager;

    RecordWavMaster recordWavMaster;

    /**
     * constructor
     *
     * @param mContext pass Context which is where you want to use
     *                 <p>
     *                 return Object of BleManager object
     */
    public BleManager(Context mContext) {
        if (mContext instanceof Activity) {
            this.mContext = mContext;
            audioManager = (AudioManager) this.mContext.getSystemService(Context.AUDIO_SERVICE);
            recordWavMaster = new RecordWavMaster(this.mContext);
        } else {
            Log.i(TAG, "please pass Activity context");
        }

    }

    /**
     * method for connect to Andesfit device
     *
     * @param andesfitDevice     pass device which you want to connect example AndesfitDevices.ANDESFIT_WEIGHT
     * @param connectionListener listener for message and getting data of device
     * @param uom                optional parameter for getting data in specific unit for weight,temperature
     */
    public void scanLib(Devices andesfitDevice, OnConnectionListener connectionListener, String... uom
    ) {
        if (mContext instanceof Activity) {
            this.connectionListener = connectionListener;
            this.andesfitDevice = andesfitDevice;
            if (uom != null && uom.length > 0) {
                this.uom = uom[0];
            } else {
                this.uom = null;
            }
            Log.i(TAG, "Device name : " + andesfitDevice.getDevicename());
            checkBLESupport();
        } else {
//            Log.i(TAG, "please pass Activity context");
        }
    }

    /**
     * This function for checking phone support BLE or not
     *
     * @link FEATURE_BLUETOOTH_LE should in phone otherwise call listener onMessage method call
     * if support then check for bluetooth adapter
     * <p>Requires {@link Manifest.permission#BLUETOOTH} permission.
     * <p>Requires {@link Manifest.permission#BLUETOOTH_ADMIN} permission.
     */
    private void checkBLESupport() {
        if (!mContext.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            clearData();
            connectionListener.onMessage(andesfitDevice, OperationStatus.BLE_NOT_SUPPORTED);
        } else {
            setBlutoothAdapter();
        }
    }

    /**
     * This function check ble support or not and bluetooth is on/off,location permission
     * If bluetooth is disable then open prompt for enable bluetooth
     * If location permission is not given then request for give location permission
     * If location permission is given then call method for check location of device enable/disable
     * <p>Requires {@link Manifest.permission#ACCESS_COARSE_LOCATION} permission.
     * <p>Requires {@link Manifest.permission#ACCESS_FINE_LOCATION} permission.
     *
     * @link FEATURE_BLUETOOTH_LE should in phone
     */
    private void setBlutoothAdapter() {
        final BluetoothManager bluetoothManager = (BluetoothManager) mContext.getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
        // Checks if Bluetooth is supported on the device.
        if (mBluetoothAdapter == null) {
            clearData();
            connectionListener.onMessage(andesfitDevice, OperationStatus.BLE_NOT_SUPPORTED);
        } else {
            if (!mBluetoothAdapter.isEnabled()) {
                clearData();
                connectionListener.onMessage(andesfitDevice, OperationStatus.BLE_NOT_ENABLED);

                if (mContext instanceof Activity) {
                    Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                    ((Activity) mContext).startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
                } else {
                    Log.i(TAG, "please pass Activity context");
                }
            } else {
                if (ActivityCompat.checkSelfPermission(mContext, permissionsRequired[0]) == PackageManager.PERMISSION_GRANTED
                        || ActivityCompat.checkSelfPermission(mContext, permissionsRequired[1]) == PackageManager.PERMISSION_GRANTED) {
                    CheckLocationOnOffDevice(mContext);
                } else {
                    connectionListener.onMessage(andesfitDevice, OperationStatus.LOCATION_PERMISSION_NOT_GRANTED);
                    if (mContext instanceof Activity) {
                        ActivityCompat.requestPermissions((Activity) mContext, permissionsRequired, ConnectDevice.PERMISSION_CALLBACK_CONSTANT);
                    } else {
                        Log.i(TAG, "please pass Activity context");
                    }
                }

            }
        }
    }

    /**
     * This function check phone location is enable/disable
     * If location is off then give alert for enable location
     * If location is on then scan bluetooth devices
     * <p>Requires {@link Manifest.permission#ACCESS_COARSE_LOCATION} permission.
     * <p>Requires {@link Manifest.permission#ACCESS_FINE_LOCATION} permission.
     *
     * @link LOCATION_SERVICE
     * @link LocationManager GPS_PROVIDER NETWORK_PROVIDER
     */
    public void CheckLocationOnOffDevice(Context context) {
        LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        boolean gps_enabled = false;
        boolean network_enabled = false;

        try {
            gps_enabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER);
        } catch (Exception ex) {
        }

        try {
            network_enabled = lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        } catch (Exception ex) {
        }

        if (gps_enabled || network_enabled) {
            scanLeDevice(true);
        } else {
            if (!lm.isProviderEnabled(LocationManager.GPS_PROVIDER) && !lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
//                buildAlertMessageNoGps();
                new GpsUtils(context).turnGPSOn(new GpsUtils.onGpsListener() {
                    @Override
                    public void gpsStatus(boolean isGPSEnable) {
                        // turn on GPS
//                        isGPS = isGPSEnable;
//                        Log.i(TAG, "this is gpsStatus" + isGPSEnable);
                    }
                });
            }
            connectionListener.onMessage(andesfitDevice, OperationStatus.LOCATION_NOT_ENABLED);
        }
    }

    /**
     * method call clear Bluetooth device
     */
    public void clearData() {
        mDevice = null;
    }

    /**
     * method call scanning bluetooth device again after location permission given or bluetooh enable/disable
     * like timer not null then timer.cancel call etc...
     * <p>Requires {@link Manifest.permission#ACCESS_COARSE_LOCATION} permission.
     * <p>Requires {@link Manifest.permission#ACCESS_FINE_LOCATION} permission.
     * *If location permission is not given then request for give location permission
     * If location permission is given then call method for check location of device enable/disable
     */

    public void scanAgain() {
        if (ActivityCompat.checkSelfPermission(mContext, permissionsRequired[0]) == PackageManager.PERMISSION_GRANTED
                || ActivityCompat.checkSelfPermission(mContext, permissionsRequired[1]) == PackageManager.PERMISSION_GRANTED) {
            CheckLocationOnOffDevice(mContext);
        } else {
            connectionListener.onMessage(andesfitDevice, OperationStatus.LOCATION_PERMISSION_NOT_GRANTED);
            if (mContext instanceof Activity) {
                ActivityCompat.requestPermissions((Activity) mContext, permissionsRequired, ConnectDevice.PERMISSION_CALLBACK_CONSTANT);
            } else {
                Log.i(TAG, "please pass Activity context");
            }
        }
    }

    /**
     * This function scan bluetooh devices in 20 seconds SCAN_PERIOD
     *
     * @param enable pass for scanning start or stop
     */
    public void scanLeDevice(final boolean enable) {
        if (enable) {
            mBluetoothAdapter.getBluetoothLeScanner().startScan(mLeScanCallback);
            Set<BluetoothDevice> bluetoothDevices = mBluetoothAdapter.getBondedDevices();
            new Handler().postDelayed(() -> {
                timer = new CountDownTimer(SCAN_PERIOD, 1000) {
                    @Override
                    public void onTick(long millisUntilFinished) {
                        long val = millisUntilFinished / 1000;
                        if (mDevice == null) {
//                                Log.i(TAG, "scan period mdevice null..." + val);
                            connectionListener.onMessage(andesfitDevice, OperationStatus.SCANNING);
                            boolean isDevice = false;
                            for (BluetoothDevice bluetoothDevice : bluetoothDevices){
                                Log.d(TAG,"-----------"+ bluetoothDevice.getName());
                                if (andesfitDevice.getDevicename().equalsIgnoreCase(bluetoothDevice.getName())){
                                    //checkConnectedOrNot();
                                    isDevice = true;
                                }
                            }
                            if (isDevice)
                                check();
                        } else {
                            timer.cancel();
                        }
                        if (val == 1) {

                            new Handler().postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    if (mDevice == null) {
//                                            Log.i(TAG, "scan period mdevice null if..." + 0);
//                                            connectionListener.onMessage(andesfitDevice, OperationStatus.SCANNING);
                                    } else {
                                        timer.cancel();
                                    }
                                }
                            }, 1000);

                        }
                    }

                    @Override
                    public void onFinish() {
                        Log.i(TAG, "BLE Manager scanLeDevice handler onFinish");
                        if (mDevice == null) {
                            connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_NOT_FOUND);
                        }
                    }
                };
                timer.start();

            }, 1000);
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    Log.i(TAG, "BLE Manager scanLeDevice handler postDelayed");
                    //clearData();
                    mBluetoothAdapter.getBluetoothLeScanner().stopScan(mLeScanCallback);
                }
            }, SCAN_PERIOD);

        } else {
            if (timer != null) {
                timer.cancel();
            }
            //clearData();
            mBluetoothAdapter.getBluetoothLeScanner().stopScan(mLeScanCallback);
        }
    }

    private void check() {

        BluetoothProfile.ServiceListener mProfileListener = new BluetoothProfile.ServiceListener() {
            public void onServiceConnected(int profile, BluetoothProfile proxy) {
                if (profile == BluetoothProfile.A2DP) {
                    boolean deviceConnected = false;
                    btA2dp = (BluetoothA2dp) proxy;
                    List<BluetoothDevice> a2dpConnectedDevices = btA2dp.getConnectedDevices();
                    if (a2dpConnectedDevices.size() != 0) {
                        for (BluetoothDevice device : a2dpConnectedDevices) {
                            if (device.getName().contains(deviceName)) {
                                deviceConnected = true;
                                try {
                                    if (mReceiver != null) {
                                        mContext.unregisterReceiver(mReceiver);
                                    }
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                                mReceiver = null;
                                timer.cancel();
                                connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_CONNECTED);
                                bluetoothDeviceCheck();
                            }
                        }
                    }
                    if (!deviceConnected) {
                        timer.cancel();
                        connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_DISCONNECTED);
                    }
                }
            }

            public void onServiceDisconnected(int profile) {
                // TODO
                //Debug.trace("onServiceDisconnected:::" + profile);
            }
        };
        mBluetoothAdapter.getProfileProxy(mContext, mProfileListener, BluetoothProfile.A2DP);
    }

    private void bluetoothDeviceCheck() {
        IntentFilter filter1 = new IntentFilter();
        filter1.addAction(BluetoothDevice.ACTION_ACL_CONNECTED);
        filter1.addAction(BluetoothDevice.ACTION_ACL_DISCONNECT_REQUESTED);
        filter1.addAction(BluetoothDevice.ACTION_ACL_DISCONNECTED);

        //The BroadcastReceiver that listens for bluetooth broadcasts
        mReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);

                if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                    //Device found
                } else if (BluetoothDevice.ACTION_ACL_CONNECTED.equals(action)) {
                    timer.cancel();
                    connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_CONNECTED);
                } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                    //Done searching
                } else if (BluetoothDevice.ACTION_ACL_DISCONNECT_REQUESTED.equals(action)) {
                    //Device is about to disconnect
                } else if (BluetoothDevice.ACTION_ACL_DISCONNECTED.equals(action)) {
                    //Device has disconnected
                    if (!TextUtils.isEmpty(device.getName()) && device.getName().equalsIgnoreCase(deviceName)) {
                        timer.cancel();
                        connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_DISCONNECTED);
                        if (recordingInProgress.get())
                            stopRecoding();
                    }
                }
            }
        };
        mContext.registerReceiver(mReceiver, filter1);


    }

    /**
     * callback for bluetooth scaning
     * here match passed Adesfit Device's name with available scanned bluetooth device
     * If match and proceed and try to connecting that device service
     */
    private final ScanCallback mLeScanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            BluetoothDevice device = result.getDevice();
            if (mContext instanceof Activity) {
                ((Activity) mContext).runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
//                        Log.i(TAG, "Device name 11111: " + device.getName());
                        if (device != null && !TextUtils.isEmpty(device.getName())) {
                            if (device.getName().contains(andesfitDevice.getDevicename())) {
                                scanLeDevice(false);
                                connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_CONNECTING);
                            }
                        }
                    }
                });
            } else {
                Log.i(TAG, "please pass Activity context");
            }
        }
    };

    /**
     * method call for reset all
     * like timer not null then timer.cancel call etc...
     */
    public void onDestroy() {
//        Log.i(TAG, "onDestory...");
        try {
            if (timer != null) {
                timer.cancel();
            }
            connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_DISCONNECTED);
            clearData();
            try {
                if (mReceiver != null) {
                    mContext.unregisterReceiver(mReceiver);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        } catch (Exception e) {
            Log.i(TAG, "exception" + e.getMessage());
        }
    }

    /**
     * method call for reset forcefully all
     * like timer not null then timer.cancel call etc...
     */
    public void onDestroyForcelly() {
        try {
            if (timer != null) {
                timer.cancel();
            }
            clearData();

        } catch (Exception e) {
            Log.i(TAG, "exception" + e.getMessage());
        }
    }

    //For 3-lead ECG
    private List<String> getParts(String string, int partitionSize) {
        List<String> parts = new ArrayList<String>();
        int len = string.length();
        for (int i=0; i<len; i+=partitionSize)
        {
            parts.add(string.substring(i, Math.min(len, i + partitionSize)));
        }
        return parts;
    }

    //Stethoscope Start Recoding
    public static final int REPEAT_INTERVAL = 40;
    private final Handler handler_recoding = new Handler();
    private final AtomicBoolean recordingInProgress = new AtomicBoolean(false);


    Timer timer2 = new Timer();
    int recodingCounter = -1;
    void startTimer(int recoderTimeInSecond){
        timer2 = new Timer();
        timer2.scheduleAtFixedRate(new firstTask(recoderTimeInSecond), 0,1000);
    }

    class firstTask extends TimerTask {

        int recoderTimeInSecond;
        public firstTask(int recoderTimeInSecond) {
            this.recoderTimeInSecond = recoderTimeInSecond;
        }

        @Override
        public void run() {
            //Log.i("recodingCounter : ",recodingCounter+"");
            DeviceData deviceData = new DeviceData();
            deviceData.setRecodingTime(recodingCounter);
            if (deviceData != null) {
                connectionListener.onData(andesfitDevice, deviceData);
            }
            if (recodingCounter == recoderTimeInSecond){
                stopRecoding();
            }else {
                recodingCounter++;
            }
        }
    }

    void stopTimer(){
        try {
            timer2.cancel();
            timer2.purge();
        }catch (Exception e){
            e.printStackTrace();
        }
        recodingCounter = -1;
    }

    private static int getDuration(File file) {
        MediaMetadataRetriever mediaMetadataRetriever = new MediaMetadataRetriever();
        mediaMetadataRetriever.setDataSource(file.getAbsolutePath());
        String durationStr = mediaMetadataRetriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION);
        int millSecond = Integer.parseInt(durationStr);
        millSecond = millSecond / 1000;
        return millSecond;
    }

    @NonNull
    Runnable updateVisualizer = new Runnable() {
        @Override
        public void run() {
            if (recordingInProgress.get()) // if we are already recording
            {
                // get the current amplitude
//                int x = mediaRecorder.getMaxAmplitude();
//                Log.d("Amplitude : ", String.valueOf(x));
//                DeviceData deviceData = new DeviceData();
//                deviceData.setAmplitude(x);
//                if (deviceData != null) {
//                    connectionListener.onData(andesfitDevice, deviceData);
//                }
                // update in 40 milliseconds
                handler_recoding.postDelayed(this, REPEAT_INTERVAL);
            }
        }
    };

    private void activateBluetoothSco() {
        if (audioManager != null){
            if (!audioManager.isBluetoothScoAvailableOffCall()) {
                Log.d(TAG, "SCO ist not available, recording is not possible");
                return;
            }

            if (!audioManager.isBluetoothScoOn()) {
                audioManager.startBluetoothSco();
                audioManager.setBluetoothScoOn(true);
            }
        }
    }

    private boolean calculateBluetoothButtonState() {
        return !audioManager.isBluetoothScoOn();
    }

    private boolean calculateStartRecordButtonState() {
        Log.i("isBluetoothScoOn", String.valueOf(audioManager.isBluetoothScoOn()));
        return audioManager.isBluetoothScoOn() && !recordingInProgress.get();
    }

    private boolean calculateStopRecordButtonState() {
        return audioManager.isBluetoothScoOn() && recordingInProgress.get();
    }

    public void startRecoding(int recoderTimeInSecond){
        startTimer(recoderTimeInSecond);

        activateBluetoothSco();

        recordingInProgress.set(true);
        //audioRecoding.start(recoderTimeInSecond);
        recordWavMaster.recordWavStart(andesfitDevice, connectionListener);

        connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_START_RECODING);
    }

    public void stopRecoding(){
        recordingInProgress.set(false);
        stopTimer();
        //audioRecoding.stop();
        String strfile = recordWavMaster.recordWavStop();
        File file = new File(strfile);

        connectionListener.onMessage(andesfitDevice, OperationStatus.DEVICE_STOP_RECODING);
        DeviceData deviceData = new DeviceData();
        deviceData.setFileDuration(getDuration(file));
        deviceData.setSethoFilePath(file.getAbsolutePath());
        if (deviceData != null) {
            connectionListener.onData(andesfitDevice, deviceData);
        }
    }
}
