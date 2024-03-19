package healthcare.hops.stethoscope.vitalsrecorder;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;

import java.util.ArrayList;
import java.util.List;

/**
 * Utility class for access to runtime permissions.
 */
public class PermissionUtils {

    public static String[] PERMISSIONS = {
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

    /**
     * Requests permission.
     */
    public static void requestPermission(
            PermissionAwareActivity permissionAwareActivity,
            int permissionRequestCode,
            PermissionListener listener
    ) {
        permissionAwareActivity.requestPermissions(
                PERMISSIONS,
                permissionRequestCode,
                listener
        );
    }

    /**
     * Responsible for checking if permissions are granted. In case permissions are not granted, the user will be requested and the method returns false. In case we have all permissions, the method return true.
     * The response of the request for the permissions is going to be handled in the onRequestPermissionsResult() method
     *
     * @param context     - Context of the activity on which Progress dialog need to be shown
     * @param permissions - The requested permissions to be checked if are granted onRequestPermissionsResult().
     * @return true case we already have all permissions. false in case we had to prompt the user for it.
     */
    public static boolean checkPermissions(Context context, String[] permissions) {
        List<String> permissionsNotGranted = new ArrayList<>();
        for (String permission : permissions) {
            if (ContextCompat.checkSelfPermission(context, permission) != PackageManager.PERMISSION_GRANTED)
                permissionsNotGranted.add(permission);
        }
        return permissionsNotGranted.isEmpty();
    }

    /**
     * Gets whether you should show UI with rationale for requesting a permission.
     * {@see android.app.Activity#shouldShowRequestPermissionRationale(String)}
     *
     * @param activity   - The activity on which Progress dialog need to be shown
     * @param permission - A permission this Controller has requested
     */
    public static boolean shouldShowRequestPermissionRationale(Activity activity, @NonNull String permission) {
        return Build.VERSION.SDK_INT >= 23 && activity.shouldShowRequestPermissionRationale(permission);
    }

    /**
     * start the App Settings Activity so that the user can change
     * settings related to the application such as permissions.
     *
     * @param context - Context of the activity on which Progress dialog need to be shown
     */
    public static void startAppSettingsConfigActivity(Context context) {
        Intent i = new Intent();
        i.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        i.addCategory(Intent.CATEGORY_DEFAULT);
        i.setData(Uri.parse("package:" + context.getPackageName()));
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        i.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
        context.startActivity(i);
    }
}