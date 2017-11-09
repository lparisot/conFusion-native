Little application based on [Native Script](https://www.nativescript.org/) framework.

# Pre installation

You need to install nativescript on your platform. Read the [quick setup](https://docs.nativescript.org/angular/start/quick-setup).

For Android, you need to install an emulator via command line:

List all available platforms/packages:
```bash
$ sdkmanager --list
```

Install a version of Android:
```bash
$ sdkmanager "platforms;android-26"
```

And a system image:
```bash
$ sdkmanager "system-images;android-26;google_apis;x86"
```

Create the Android virtual device:
```bash
$ avdmanager create avd -n android -k "system-images;android-26;google_apis;x86" --abi google_apis/x86
```

Or via AVD in Android Studio [installation](https://developer.android.com/studio/install.html)

# Launch

On an emulator:
```bash
$ tns run ios --emulator
```

On a device (first connect the device):
```bash
$ tns run ios
```

(change ios with android)
