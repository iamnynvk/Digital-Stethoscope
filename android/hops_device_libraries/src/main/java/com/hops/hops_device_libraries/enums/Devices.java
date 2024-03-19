package com.hops.hops_device_libraries.enums;

/**
 * enum for Andesfit Devices
 */
public enum Devices {

    HOPS_STETHO("Hops_Stetho");

    private final String devicename;

    Devices(final String devicename) {
        this.devicename = devicename;
    }

    public String getDevicename() {
        return devicename;
    }


    @Override
    public String toString() {
        return devicename;
    }

}