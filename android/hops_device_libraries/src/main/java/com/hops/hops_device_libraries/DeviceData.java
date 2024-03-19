package com.hops.hops_device_libraries;

public class DeviceData {

    private double amplitude;
    private int fileDuration;
    private int recodingTime;
    private String sethoFilePath;

    public double getAmplitude() {
        return amplitude;
    }

    public void setAmplitude(double amplitude) {
        this.amplitude = amplitude;
    }

    public int getFileDuration() {
        return fileDuration;
    }

    public void setFileDuration(int fileDuration) {
        this.fileDuration = fileDuration;
    }

    public int getRecodingTime() {
        return recodingTime;
    }

    public void setRecodingTime(int recodingTime) {
        this.recodingTime = recodingTime;
    }

    public String getSethoFilePath() {
        return sethoFilePath;
    }

    public void setSethoFilePath(String sethoFilePath) {
        this.sethoFilePath = sethoFilePath;
    }

    @Override
    public String toString() {
        return "DeviceData{" +
                "amplitude=" + amplitude +
                ", fileDuration=" + fileDuration +
                ", recodingTime=" + recodingTime +
                ", sethoFilePath='" + sethoFilePath + '\'' +
                '}';
    }
}
