package com.hops.hops_device_libraries.enums;

/**
 * enum for OperationStaus for location permission,ble and device etc..
 */

public enum OperationStatus {
    LOCATION_PERMISSION_NOT_GRANTED("LOCATION_PERMISSION_NOT_GRANTED"),//location permission is not given
    LOCATION_NOT_ENABLED("LOCATION_NOT_ENABLED"),//location is not on of your phone,
    BLE_NOT_SUPPORTED("BLE_NOT_SUPPORTED"),//BLE is not support
    BLE_NOT_ENABLED("BLE_NOT_ENABLED"),//bluetooth is not enable
    SCANNING("SCANNING"),//for scanning device
    DEVICE_CONNECTING("DEVICE_CONNECTING"),//Device connecting
    DEVICE_CONNECTED("DEVICE_CONNECTED"),//Device connected
    DEVICE_DISCONNECTED("DEVICE_DISCONNECTED"),//Device disconnected
    DEVICE_NOT_FOUND("DEVICE_NOT_FOUND"),//Device not found
    DEVICE_START_RECODING("DEVICE_START_RECODING"),//Device not found
    DEVICE_STOP_RECODING("DEVICE_STOP_RECODING");//Device not found
    private final String operationstatus;

    OperationStatus(final String status) {
        this.operationstatus = status;
    }

    public String getOperationstatus() {
        return operationstatus;
    }

    @Override
    public String toString() {
        return operationstatus;
    }

}