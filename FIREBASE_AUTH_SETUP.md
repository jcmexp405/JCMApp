# Firebase Authentication Setup Guide

## ✅ Completed Steps

The following has been implemented:

1. ✅ Installed `@capacitor-firebase/authentication@1.4.0`
2. ✅ Updated Firebase configuration to use Capacitor plugin
3. ✅ Modified login service to use native authentication on iOS/Android
4. ✅ Updated Capacitor configuration
5. ✅ Synced native projects

## 📋 Required: Firebase Configuration Files

To complete the setup, you need to add Firebase configuration files for both iOS and Android platforms.

### For iOS

1. **Download GoogleService-Info.plist**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project `jcmexpansion`
   - Go to Project Settings (⚙️ icon)
   - Under "Your apps", find your iOS app or add one if it doesn't exist
   - Download `GoogleService-Info.plist`

2. **Add to iOS Project**

   ```bash
   # Copy the file to:
   ios/App/App/GoogleService-Info.plist
   ```

3. **Add to Xcode Project**
   - Open `ios/App/App.xcworkspace` in Xcode
   - Right-click on the `App` folder in the project navigator
   - Select "Add Files to App..."
   - Select `GoogleService-Info.plist`
   - Make sure "Copy items if needed" is checked
   - Make sure the App target is selected

### For Android

1. **Download google-services.json**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project `jcmexpansion`
   - Go to Project Settings (⚙️ icon)
   - Under "Your apps", find your Android app or add one if it doesn't exist
   - Package name should be: `com.jcmexp.app`
   - Download `google-services.json`

2. **Add to Android Project**
   ```bash
   # Copy the file to:
   android/app/google-services.json
   ```

## 🔧 Additional Configuration

### iOS Podfile (Already configured, but verify)

The Podfile should automatically include the Firebase pods after running `npx cap sync`.

### Android Build Files (Already configured ✅)

The Android build.gradle files are already configured to use the google-services plugin.

## 🧪 Testing

After adding the configuration files:

1. **Rebuild the native projects:**

   ```bash
   npx cap sync
   ```

2. **Build and run on iOS:**

   ```bash
   npx cap open ios
   # Then build and run from Xcode
   ```

3. **Build and run on Android:**
   ```bash
   npx cap open android
   # Then build and run from Android Studio
   ```

## 📱 How It Works

The app now uses platform-specific authentication:

- **Web**: Uses Firebase Web SDK (existing functionality)
- **iOS/Android**: Uses `@capacitor-firebase/authentication` plugin for native authentication

The `loginService.js` automatically detects the platform and uses the appropriate method:

- `FirebaseAuthentication.signInWithEmailAndPassword()` for native
- `signInWithEmailAndPassword()` from Firebase SDK for web

## 🔑 Supported Authentication Methods

Currently configured for:

- ✅ Email/Password authentication

To add more providers (Google, Apple, etc.), update:

1. `capacitor.config.ts` - Add provider to the `providers` array
2. Firebase Console - Enable the provider
3. `loginService.js` - Add corresponding sign-in methods

## 📚 Documentation

- [Capacitor Firebase Authentication Docs](https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/authentication)
- [Firebase Console](https://console.firebase.google.com/)

## ⚠️ Important Notes

- Make sure the App ID matches in both platforms: `com.jcmexp.app`
- Don't commit the configuration files to git if your repository is public
- Add to `.gitignore`:
  ```
  ios/App/App/GoogleService-Info.plist
  android/app/google-services.json
  ```
