# Firebase Phone Authentication - Complete Setup Guide

*Step-by-step guide with visual descriptions for setting up Firebase Phone Auth in React Native*

---

## 📋 Overview

This guide covers:
1. Enabling Phone Authentication in Firebase Console
2. Enabling required APIs in Google Cloud Console
3. Adding SHA fingerprints
4. Configuring Android app
5. Testing the setup

**Time Required:** ~15 minutes

---

## 🔥 Part 1: Firebase Console Setup

### Step 1: Enable Phone Authentication

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project

2. **Navigate to Authentication**
   - Click **Authentication** in the left sidebar
   - Click **Sign-in method** tab at the top

3. **Enable Phone Provider**
   - Find **Phone** in the providers list
   - Click on **Phone** row
   - Toggle the **Enable** switch to ON
   - You'll see a dialog with configuration options

4. **Configure Phone Settings**
   - **Important Notice:** You'll see a warning about SHA-1 certificate fingerprints
   - Note: "To enable Phone provider for your Android apps, you must provide the SHA-1 release fingerprint"
   - We'll add this in the next step

5. **(Optional) Add Test Phone Numbers**
   - Scroll down to "Phone numbers for testing (optional)"
   - Click **Add phone number**
   - Enter: `+91 81051 27332`
   - Verification code: `123456`
   - Click **Add**
   - This allows testing without using SMS quota

6. **Save Changes**
   - Click **Save** button at the bottom
   - Phone authentication is now enabled!

---

### Step 2: Get and Add SHA Fingerprints

**Why needed:** Firebase uses SHA fingerprints to verify your app's identity.

#### Get Your SHA Keys

1. **Open Terminal** in your project directory

2. **Navigate to Android folder**
   ```bash
   cd android
   ```

3. **Run Gradle signing report**
   ```bash
   ./gradlew signingReport
   ```

4. **Find SHA keys in output**
   ```bash
   # Filter the output to see only SHA keys
   ./gradlew signingReport | grep -E "(SHA1|SHA-256):"
   ```

   **Output will look like:**
   ```
   SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
   SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
   ```

5. **Copy both SHA-1 and SHA-256 values**

#### Add SHA Keys to Firebase

1. **Go to Project Settings**
   - Firebase Console → Click ⚙️ (Settings icon) → **Project settings**

2. **Navigate to Your Apps**
   - Scroll down to "Your apps" section
   - Find your Android app (e.g., `com.yourcompany.appname`)

3. **Add SHA-1 Fingerprint**
   - Click **Add fingerprint** button
   - Paste the SHA-1 value
   - Click **Save**

4. **Add SHA-256 Fingerprint**
   - Click **Add fingerprint** again
   - Paste the SHA-256 value
   - Click **Save**

5. **Download Updated Config**
   - Click **Download google-services.json** button
   - Replace the old file at `android/app/google-services.json`

**Visual Check:** You should now see both fingerprints listed under your app.

---

### Step 3: Verify Billing Plan

Phone Authentication requires **Blaze (Pay as you go)** plan.

1. **Check Current Plan**
   - Look at top-left corner of Firebase Console
   - You'll see "Spark" or "Blaze"

2. **Upgrade to Blaze (if needed)**
   - Click on plan name
   - Click **Modify plan**
   - Select **Blaze (Pay as you go)**
   - Add billing information
   - Note: Phone Auth has generous free tier (10K verifications/month)

---

## ☁️ Part 2: Google Cloud Console Setup

**Why needed:** Firebase Phone Auth uses Google Cloud APIs behind the scenes.

### Enable Required APIs

1. **Open Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Sign in with same Google account as Firebase

2. **Select Your Project**
   - Click project dropdown at top
   - Find and select your Firebase project name
   - (It should match your Firebase project)

3. **Navigate to APIs & Services**
   - Click ☰ (hamburger menu) → **APIs & Services** → **Library**

4. **Enable Identity Toolkit API**
   - In the search bar, type: `Identity Toolkit API`
   - Click on **Identity Toolkit API** from results
   - Click **ENABLE** button (if not already enabled)
   - Wait for confirmation "API enabled"

5. **Enable Firebase Authentication API**
   - Go back to **Library** (click back or use menu)
   - Search: `Firebase Authentication`
   - Click on **Firebase Authentication API**
   - Click **ENABLE** button (if not already enabled)
   - Wait for confirmation "API enabled"

6. **Verify APIs are Enabled**
   - Go to **APIs & Services** → **Dashboard**
   - You should see:
     - ✅ Identity Toolkit API (Active)
     - ✅ Firebase Authentication API (Active)

**Important:** Without these APIs, Phone Auth will fail with network errors!

---

## 📱 Part 3: Android App Configuration

### Update build.gradle

1. **Open File:** `android/app/build.gradle`

2. **Add Dependencies** (in `dependencies` block):
   ```gradle
   dependencies {
       // ... other dependencies

       // Required for Phone Authentication
       implementation("com.google.android.gms:play-services-auth:21.0.0")

       // Play Integrity API - Prevents reCAPTCHA
       implementation("com.google.android.play:integrity:1.3.0")
   }
   ```

3. **Save the file**

### Verify google-services.json

1. **Check File Location**
   - Path: `android/app/google-services.json`
   - Make sure it's the latest one you downloaded from Firebase

2. **Verify Project ID Matches**
   ```json
   {
     "project_info": {
       "project_id": "your-project-id"
     }
   }
   ```

### Verify AndroidManifest.xml

1. **Open:** `android/app/src/main/AndroidManifest.xml`

2. **Ensure Internet Permission:**
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   ```

---

## 🏗️ Part 4: Build and Deploy

### Clean and Rebuild

1. **Clean Gradle Cache**
   ```bash
   cd android
   ./gradlew clean
   ```

2. **Return to Root**
   ```bash
   cd ..
   ```

3. **Rebuild App**
   ```bash
   npx react-native run-android
   ```

   **Important:** You MUST rebuild, not just reload! Native dependencies changed.

---

## ✅ Part 5: Testing

### Test with Test Phone Number

1. **Launch Your App**

2. **Enter Test Number**
   - Phone: `8105127332` (without country code)
   - Click "Send OTP"

3. **Expected Behavior**
   - Should NOT show reCAPTCHA (Play Integrity handles it)
   - Should show "OTP sent" message
   - Should move to OTP entry screen

4. **Enter Test OTP**
   - Code: `123456`
   - Click "Verify"

5. **Success!**
   - Should login successfully
   - No errors in console

### Test with Real Phone Number

1. **Enter Your Real Number**
   - Example: `9876543210`

2. **Check Your Phone**
   - You should receive SMS with 6-digit code
   - Time: Usually 5-30 seconds

3. **Enter Real OTP**
   - Enter the code you received
   - Verify

### Debugging

If something doesn't work, check logs:

```javascript
console.log('=== SENDING OTP ===');
console.log('Phone:', phoneNumber);
console.log('Auth instance:', auth());

try {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  console.log('=== SUCCESS ===');
} catch (error) {
  console.error('=== ERROR ===');
  console.error('Code:', error.code);
  console.error('Message:', error.message);
}
```

---

## 🎯 Quick Verification Checklist

Before testing, verify:

### Firebase Console ✅
- [ ] Phone provider enabled in Authentication → Sign-in method
- [ ] SHA-1 added to Project Settings
- [ ] SHA-256 added to Project Settings
- [ ] Test phone number configured (optional)
- [ ] Blaze plan active
- [ ] Latest google-services.json downloaded

### Google Cloud Console ✅
- [ ] Identity Toolkit API enabled
- [ ] Firebase Authentication API enabled
- [ ] Both showing as "Active" in dashboard

### Android App ✅
- [ ] google-services.json in android/app/
- [ ] play-services-auth in build.gradle
- [ ] play-integrity in build.gradle
- [ ] App rebuilt (not just reloaded!)

### Development ✅
- [ ] Chrome Debugger DISABLED
- [ ] Testing on real device (recommended)
- [ ] Internet connection working

---

## 🔍 Troubleshooting Common Issues

### Issue: "Phone auth is not enabled"
**Fix:** Go back to Firebase Console → Authentication → Sign-in method → Enable Phone

### Issue: "auth/app-not-authorized"
**Fix:** SHA keys don't match. Re-run `./gradlew signingReport` and update Firebase

### Issue: reCAPTCHA appears
**Fix:** Add Play Integrity API to build.gradle and rebuild

### Issue: "sessionStorage is inaccessible"
**Fix:** Disable Chrome Debugger (shake device → Stop Debugging)

### Issue: Request times out
**Fix:**
1. Check if APIs are enabled in Google Cloud Console
2. Verify Blaze plan is active
3. Check SHA keys match

---

## 📸 Screenshots Reference

When following this guide, you should see:

1. **Firebase Console - Authentication**
   - Phone provider in green/enabled state
   - Test phone number listed

2. **Firebase Console - Project Settings**
   - Two SHA fingerprints listed under your Android app

3. **Google Cloud Console - APIs Dashboard**
   - Identity Toolkit API showing "Active"
   - Firebase Authentication API showing "Active"

---

## 🚀 Next Steps

After successful setup:

1. **Test thoroughly** with both test and real numbers
2. **Implement error handling** for production
3. **Add loading states** for better UX
4. **Monitor quota usage** in Firebase Console
5. **Set up monitoring** for auth failures

---

## 📚 Additional Resources

- [React Native Firebase Phone Auth Docs](https://rnfirebase.io/auth/phone-auth)
- [Firebase Phone Auth Best Practices](https://firebase.google.com/docs/auth/android/phone-auth)
- [Play Integrity API Setup](https://developer.android.com/google/play/integrity)
- [Complete Troubleshooting Guide](./FIREBASE_PHONE_AUTH_TROUBLESHOOTING.md)

---

## ✨ Success Criteria

You've successfully set up Firebase Phone Auth when:

- ✅ Test number (`8105127332`) works without errors
- ✅ Real phone number receives SMS
- ✅ No reCAPTCHA popup appears
- ✅ OTP verification succeeds
- ✅ No errors in console logs
- ✅ Login flow completes successfully

---

**Setup Complete!** 🎉

If you encounter any issues, refer to the [troubleshooting guide](./FIREBASE_PHONE_AUTH_TROUBLESHOOTING.md) or the [quick fix guide](./PHONE_AUTH_QUICK_FIX.md).
