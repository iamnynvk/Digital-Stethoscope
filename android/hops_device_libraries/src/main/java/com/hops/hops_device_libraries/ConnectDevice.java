package com.hops.hops_device_libraries;

import android.app.Activity;

import com.hops.hops_device_libraries.enums.Devices;
import com.hops.hops_device_libraries.enums.OperationStatus;


public class ConnectDevice {
    private final static String TAG = ConnectDevice.class.getSimpleName();
    private static BleManager bleManager;
    private static ConnectDevice instance;

    public static final int PERMISSION_CALLBACK_CONSTANT = 8100;
    public static final int REQUEST_ENABLE_BT = 9191;
    public static final int GPS_REQUEST = 4200;

    private ConnectDevice() {
    }

    /**
     * method for get instance of Andesfit Class
     *
     * @param context pass context which use this class
     * @return Object if instance of Class is not present then
     * create new at the time of create new instance we also create Blemanager Object also
     */
    public static ConnectDevice getInstance(Activity context) {
        if (instance == null) {
            instance = new ConnectDevice();
            bleManager = new BleManager(context);
        }
        return instance;
    }

    /**
     * method for connect to Andesfit device
     *
     * @param andesfitDevice     pass device which you want to connect example AndesfitDevices.ANDESFIT_WEIGHT
     * @param connectionListener listener for message and getting data of device
     * @param uom                optional parameter for getting data in specific unit for weight,temperature
     */
    public void setupDevice(Devices andesfitDevice, OnConnectionListener connectionListener, String... uom) {
        bleManager.scanLib(andesfitDevice, new OnConnectionListener() {
            @Override
            public void onMessage(Devices devices, OperationStatus operationStatus) {
                connectionListener.onMessage(devices, operationStatus);
            }

            @Override
            public void onData(Devices devices, DeviceData dataModel) {
                connectionListener.onData(devices, dataModel);
            }
        }, uom);

    }

    /**
     * method for scanAgain after ble on or location permission given
     */
    public void scanAgain() {
        if (bleManager != null) {
            bleManager.scanAgain();
        }
    }

    /**
     * clear all data of blemanager and instance assign null
     */
    public void clearAllData() {
//        Log.i(TAG, "clear all data call...");
        if (bleManager != null) {
            bleManager.onDestroy();
        }
        instance = null;
    }

    public void recordStartData(int recoderTimeInSecond){
        if (bleManager != null) {
//            bleManager.startRecoding(recoderTimeInSecond);
            bleManager.startRecoding(recoderTimeInSecond);
        }
    }
    public void recordStopData(){
        if (bleManager != null) {
//            bleManager.stopRecoding();
            bleManager.stopRecoding();
        }
    }
}
