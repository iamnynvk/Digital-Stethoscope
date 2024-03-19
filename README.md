# HOPS Device app

## Requirements

Node 10 or greater is required. Development for iOS requires a Mac and Xcode 9.4 or up, and will target iOS 9 and up.

You also need to install the dependencies required by React Native.  
Go to the [React Native environment setup](https://reactnative.dev/docs/environment-setup), then select `React Native CLI Quickstart` tab.  
Follow instructions for your given `development OS` and `target OS`.

## Getting Started

Make sure node version installed is `>=12.x.x`. Then install using yarn (or npm):

```
yarn install or npm install
```

Start the Metro Bundler:

```
yarn start or npx react-native start
```

### iOS

One time. Move to `ios` folder and install pods:

```
cd ios && pod install
```

Launch application from XCode (`Command + R`) Or launch from Terminal:

```
yarn ios
# runs the following command. change device name here
# `npx react-native run-ios --simulator='iPhone 11'`
```

### Android

Start an Android Simulator from:

```
Android Studio > Tools > AVD Manager > Run any device
```

Similarly, run from Android Studio itself Or from Terminal:

```
yarn android
# runs the following command
# react-native run-android --variant=Debug
```

## Link the font assets

```
yarn react-native link
        or
npx react-native link
```

## Cheat Sheet

#### iOS Launch Screen

```shell
XCode -> Project Folder -> Click on `Images.xcassets` -> Click on `LaunchScreen`
```

Change the 3 images here to set the new launch screen for iOS.

#### Android Launch Screen

```shell
`./android/app/src/main/res/layout/launch_screen.xml` file
```

Change the layout of the `launch_screen.xml` file to set the new launch screen for Android.

To customize the splash screen (logo and background color) use the CLI provided in the [official docs](https://github.com/crazycodeboy/react-native-splash-screen#readme).

## Apply this patch

#### 1) SVG component becomes transparent when goBack issue in android.(react-native-svg)

node_modules/react-native-svg/android/src/main/java/com/horcrux/svg/`SvgView.java`

```
public class SvgView extends ReactViewGroup implements ReactCompoundView, ReactCompoundViewGroup {

   private @Nullable Bitmap mBitmap;
+  private boolean mRemovalTransitionStarted = false;

   private @Nullable
   Bitmap mBitmap;
   private boolean mRemovalTransitionStarted = false;

   public SvgView(ReactContext reactContext) {
       super(reactContext);
       mScale = DisplayMetricsHolder.getScreenDisplayMetrics().density;
   }

   @Override
   public void invalidate() {
       super.invalidate();
       ViewParent parent = getParent();
       if (parent instanceof VirtualView) {
           if (!mRendered) {
               return;
           }
           mRendered = false;
           ((VirtualView) parent).getSvgView().invalidate();
           return;
       }
-       if (mBitmap != null)
-           mBitmap.recycle();

+       if (!mRemovalTransitionStarted) {
+         if (mBitmap != null) {
+           mBitmap.recycle();
+         }
+         mBitmap = null;
+       }
-       mBitmap = null;
}

+       @Override
+       public void startViewTransition(View view) {
+         super.startViewTransition(view);
+         mRemovalTransitionStarted = true;
+        }

+       @Override
+        public void endViewTransition(View view) {
+         super.endViewTransition(view);
+         if (mRemovalTransitionStarted) {
+             mRemovalTransitionStarted = false;
+         }
+     }
```

#### 2) Crash fix, when trying to play before audio is fully loaded in ios.(react-native-audiowaveform)

ios/OGWaverformView.m

```
@implementation OGWaverformView {
    __weak RCTBridge *_bridge;
+    Boolean isLoaded;
+    Boolean isAutoPlay;
}

-(void)playAudio{
+    if (!isLoaded){
+        isAutoPlay =true;
+        return;
+    }

    _playbackTimer=[NSTimer scheduledTimerWithTimeInterval:0.1
                                                   target:self
                                                 selector:@selector(updateProgress:)
                                                 userInfo:nil
                                                  repeats:YES];
    [_player play];
}


-(void)setSrc:(NSDictionary *)src{
    //_propSrc = src;
    NSLog(@"SRC ::: %@",src);

    //Retrieve audio file
    NSString *uri =  [src objectForKey:@"uri"];

    //Since any file sent from JS side in Reeact Native is through HTTP, and
    //AVURLAsset just works wiht local files, then, downloading and processing.
    NSURL  *remoteUrl = [NSURL URLWithString:uri];

    NSLog(@"NSURLRequest :: %@",remoteUrl);
    NSURLRequest *request = [NSURLRequest requestWithURL:remoteUrl cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:30];
    NSURLConnection *connection = [[NSURLConnection alloc]initWithRequest:request delegate:self startImmediately:YES ];
+    isLoaded = false;
+    isAutoPlay = false;
}


- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    NSString *fileName = [NSString stringWithFormat:@"%@.aac",[OGWaveUtils randomStringWithLength:5]];

    _soundPath = [NSTemporaryDirectory() stringByAppendingPathComponent:fileName];
    [_mdata writeToFile:_soundPath atomically:YES];

    NSURL * localUrl = [NSURL fileURLWithPath: _soundPath];
    _asset = [AVURLAsset assetWithURL: localUrl];

+    isLoaded = true;
    [self drawWaveform];
    [self addScrubber];
    [self initAudio];

    if(_autoPlay)
        [self playAudio];
+    else if(isAutoPlay){
+        [self playAudio];
+        isAutoPlay = false;
+    }
}
```

#### 3) Fixed android crash if you use it in flat list with infinite scroll.(react-native-audiowaveform)

android/src/main/java/com/otomogroove/OGReactNativeWaveform/OGWaveView.java

```
protected class UpdateProgressRequest extends AsyncTask<Void, Void, Float> {
        @Override
        protected Float doInBackground(Void... params) {
            if (mMediaPlayer.isPlaying()) {
                String offset = Integer.valueOf(
                        mMediaPlayer.getCurrentPosition()).toString();
                Float currrentPos = (float) mMediaPlayer.getCurrentPosition()/mMediaPlayer.getDuration();
                return currrentPos;
            }
            return null;
        }

        @Override
        protected void onPostExecute(Float aFloat) {
-            super.onPostExecute(aFloat);
-            mUIWave.updatePlayHead(aFloat);
+            if (aFloat != null) {
+                super.onPostExecute(aFloat);
+                mUIWave.updatePlayHead(aFloat);
+            }
        }
}

```

#### 4) When trying to play before audio is fully loaded, scrubber is not working in android platform.(react-native-audiowaveform)

android/src/main/java/com/otomogroove/OGReactNativeWaveform/OGWaveView.java

```
public class OGWaveView extends FrameLayout {
    private boolean mAutoplay = false;
    private boolean isCreated = false;
+   private boolean play = false;

    public void onPlay(boolean play){
+      this.play= play;
        if(play){
            this.mMediaPlayer.start();
        }else{
            if(mMediaPlayer != null && mMediaPlayer.isPlaying())
                mMediaPlayer.pause();
        }
        progressReportinghandler.postDelayed(progressRunnable, 500);
    }
    public void onPause(){
        this.mMediaPlayer.pause();
    }
    public void onStop(){
+       play= false;
        this.mMediaPlayer.stop();
    }
    public void setSoundFile(SoundFile soundFile) {
        this.soundFile = soundFile;

        try {
            mMediaPlayer.reset();
            mMediaPlayer.setDataSource(soundFile.getInputFile().getPath());
            mMediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            mMediaPlayer.prepare();
+            if(play){
+                mMediaPlayer.start();
+                progressReportinghandler.postDelayed(progressRunnable, 500);
+            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

```

## Folder structure

This template follows a very simple project structure:

- `src`: This folder is the main container of all the code inside your application.
  - `assets`: Asset folder to store all images, vectors, etc.
  - `components`: Folder to store any common component that you use through your app (such as a generic button)
  - `constants`: Folder to store any kind of constant that you have.
  - `hooks`: Folder to store any kind of custom hook that you have.
  - `lib`: Folder to store any kind of library that you have.
  - `localization`: Folder to store the languages files.
  - `navigation`: Folder to store the navigators.
  - `screens`: Folder that contains all your application screens/features.
    - `Screen`: Each screen should be stored inside its folder and inside it a file for its code and a separate one for the styles.
      - `Screen.js`
      - `Screen.styles.js`
  - `theme`: Folder to store all the styling concerns related to the application theme.
  - `utils` : Folder to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truely shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.
  - `App.js`: Main component that starts your whole app.
  - `index.js`: Entry point of your application as per React-Native standards.

## Troubleshooting

### → Networking

If you're unable to load your app on your phone due to a network timeout or a refused connection, a good first step is to verify that your phone and computer are on the same network and that they can reach each other. Create React Native App needs access to ports 19000 and 19001 so ensure that your network and firewall settings allow access from your device to your computer on both of these ports.

Try opening a web browser on your phone and opening the URL that the packager script prints, replacing `exp://` with `http://`. So, for example, if underneath the QR code in your terminal you see:

```
exp://192.168.0.1:19000
```

Try opening Safari or Chrome on your phone and loading

```
http://192.168.0.1:19000
```

and

```
http://192.168.0.1:19001
```

If this works, but you're still unable to load your app by scanning the QR code, please open an issue on the [Create React Native App repository](https://github.com/react-community/create-react-native-app) with details about these steps and any other error messages you may have received.

If you're not able to load the `http` URL in your phone's web browser, try using the tethering/mobile hotspot feature on your phone (beware of data usage, though), connecting your computer to that WiFi network, and restarting the packager.

### → iOS Simulator won't open

If you're on a Mac, there are a few errors that users sometimes see when attempting to `npm run ios`:

- "non-zero exit code: 107"
- "You may need to install Xcode" but it is already installed
- and others

There are a few steps you may want to take to troubleshoot these kinds of errors:

1. Make sure Xcode is installed and open it to accept the license agreement if it prompts you. You can install it from the Mac App Store.
2. Open Xcode's Preferences, the Locations tab, and make sure that the `Command Line Tools` menu option is set to something. Sometimes when the CLI tools are first installed by Homebrew this option is left blank, which can prevent Apple utilities from finding the simulator. Make sure to re-run `npm/yarn run ios` after doing so.
3. If that doesn't work, open the Simulator, and under the app menu select `Reset Contents and Settings...`. After that has finished, quit the Simulator, and re-run `npm/yarn run ios`.

### → Xcode 12 Compilation Errors (While running with iOS 14 Simulators)

React Native project on a MacBook Pro with a M1 architecture, for iOS simulator.
The project built nicely on Intel architecture.
It also build on device and archive well on M1. But not on simulator.

`in /project-folder/ios/Pods/OpenSSL-Universal/ios/lib/libcrypto.a(cryptlib.o), building for iOS Simulator, but linking in object file built for iOS, file '/project-folder/ios/Pods/OpenSSL-Universal/ios/lib/libcrypto.a' for architecture arm64`

Now edit App/ios/Podfile

```
 post_install do |installer|
+    installer.pods_project.targets.each do |target|
+         target.build_configurations.each do |config|
+           config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
+         end
+       end
    react_native_post_install(installer)
    __apply_Xcode_12_5_M1_post_install_workaround(installer)
  end

```
