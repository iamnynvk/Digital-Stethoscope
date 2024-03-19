package com.hops.hops_device_libraries;

import android.content.Context;
import android.os.Environment;

import java.io.File;

public class CreateFileAndFolder {

    public String checkRecodingFolder(Context mContext) {
        File folder = new File(mContext.getFilesDir(), "StethoscopeApp");
//        final File folder = new File(Environment.getExternalStorageDirectory() + File.separator + "StethoscopeApp");
        if (!folder.exists()) {
            try {
                folder.mkdir();
            } catch (final Exception e) {
                e.printStackTrace();
            }
        }
        if (folder.exists()) {
            return folder.getAbsolutePath();
        }else {
            return null;
        }
    }

    public File[] getAllRecordingFiles(Context mContext){

//        final File folder = new File(Environment.getExternalStorageDirectory() + File.separator + "StethoscopeApp");
        File folder = new File(mContext.getFilesDir(), "StethoscopeApp");

        if (!folder.exists()){
            return null;
        }else {
            String path = folder.getAbsolutePath();
            File directory = new File(path);
            File[] files = directory.listFiles();
            return files;
        }

    }

}
