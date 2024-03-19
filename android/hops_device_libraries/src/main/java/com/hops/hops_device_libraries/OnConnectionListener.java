package com.hops.hops_device_libraries;

import com.hops.hops_device_libraries.enums.Devices;
import com.hops.hops_device_libraries.enums.OperationStatus;

public interface OnConnectionListener {

    /**
     * method for message to listener as per OperationStatus
     */
    void onMessage(Devices devices, OperationStatus operationStatus);

    /**
     * method for device data like spo2,pulse or blood pressure data etc..
     */
    void onData(Devices devices, DeviceData dataModel);

}
