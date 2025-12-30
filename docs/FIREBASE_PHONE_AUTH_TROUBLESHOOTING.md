# Firebase Phone Authentication Troubleshooting Guide

## Overview
This document covers common issues encountered when implementing Firebase Phone Authentication in React Native and their solutions.

---

## Issues Encountered & Solutions

### 1. ❌ Promise Handling Error - OTP Not Sending

**Symptom:**
- OTP request hangs indefinitely
- No success or error response
- Loading spinner never stops

**Root Cause:**
Mixing `await` with `.then()/.catch()` causing the confirmation object to be `undefined`.

**Bad Code:**
```javascript
const confirmation = await signInWithPhoneNumber(auth, phone)
  .then((res) => { console.log(res) })
  .catch((err) => { console.log(err) });
// confirmation is undefined!
```

**Solution:**
```javascript
const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
// confirmation now contains the actual result
```

**File:** `src/screens/login/LoginSceen.js:37`

---

### 2. ❌ Wrong Firebase SDK Syntax

**Symptom:**
- `getAuth()` returns empty/undefined
- Auth instance showing as blank in logs

**Root Cause:**
Using Firebase Web SDK syntax instead of React Native Firebase syntax, or vice versa.

**React Native Firebase Versions:**

**Deprecated (but works):**
```javascript
import auth from '@react-native-firebase/auth';
const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
```

**Modern (v20+):**
```javascript
import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
const authInstance = getAuth();
const confirmation = await signInWithPhoneNumber(authInstance, phoneNumber);
```

**Note:** If `getAuth()` returns undefined, use the deprecated syntax until you upgrade to a version where modular API is fully supported.

---

### 3. ❌ Chrome Debugger Interference

**Symptom:**
- Error: "Unable to process request due to missing initial state"
- "browser sessionStorage is inaccessible"
- reCAPTCHA fails to complete

**Root Cause:**
Chrome Debugger runs JavaScript in a browser environment that doesn't have access to native Firebase modules and sessionStorage.

**Solution:**
1. Shake device → **Stop Debugging**
2. Or press `d` in Metro → **Disable Remote JS Debugging**
3. Reload app

**Critical:** Firebase Phone Auth **CANNOT work** with Chrome Debugger enabled!

---

### 4. ❌ SHA-1/SHA-256 Key Mismatch

**Symptom:**
- `auth/app-not-authorized` error
- Request times out
- Works with test numbers but fails with real numbers

**Root Cause:**
SHA keys in Firebase Console don't match the app's actual signing keys.

**Solution:**

**Step 1: Get your SHA keys**
```bash
cd android
./gradlew signingReport | grep -E "(SHA1|SHA-256):" | head -4
```

**Step 2: Add to Firebase Console**
1. Firebase Console → Project Settings
2. Your apps → Android app
3. Click "Add fingerprint"
4. Add **BOTH** SHA-1 and SHA-256

**Step 3: Download new google-services.json**
1. Download from Firebase Console
2. Replace `android/app/google-services.json`
3. **Rebuild:** `npx react-native run-android`

**Example SHA keys:**
```
SHA-1:   5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

---

### 5. ❌ Network Request Failed / Timeout

**Symptom:**
- `auth/network-request-failed` error
- Request times out after 30 seconds
- Even test numbers fail

**Root Causes:**
1. Play Integrity API not configured
2. Phone Auth not enabled in Firebase Console
3. Firebase project not on Blaze plan
4. Network/firewall blocking Firebase

**Solutions:**

**A. Enable Play Integrity API**

Update `android/app/build.gradle`:
```gradle
dependencies {
    implementation("com.google.android.gms:play-services-auth:21.0.0")
    implementation("com.google.android.play:integrity:1.3.0")
}
```

Then rebuild:
```bash
npx react-native run-android
```

**B. Enable Phone Auth in Firebase**
1. Firebase Console → Authentication → Sign-in method
2. Enable **Phone** provider
3. Add test phone numbers (optional)

**C. Verify Firebase Plan**
1. Firebase Console → Spark/Blaze (top left)
2. Phone Auth requires **Blaze (Pay as you go)** plan
3. Upgrade if on Spark (free) plan

**D. Enable Required APIs**
1. [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Library
3. Enable:
   - Identity Toolkit API
   - Firebase Authentication API

---

### 6. ❌ reCAPTCHA "sessionStorage" Error

**Symptom:**
- reCAPTCHA screen appears
- Error: "Unable to process request due to missing initial state"
- reCAPTCHA verification fails

**Root Cause:**
Play Integrity API missing, forcing fallback to reCAPTCHA which doesn't work properly in React Native WebView.

**Solution:**
Add Play Integrity API (see #5A above). This prevents reCAPTCHA from appearing.

---

## Complete Working Implementation

```javascript
import React, { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function PhoneAuthScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  // Send OTP
  const handleSendOTP = async () => {
    try {
      const fullPhoneNumber = `+91${phoneNumber}`;
      const confirm = await auth().signInWithPhoneNumber(fullPhoneNumber);

      setConfirmation(confirm);
      Alert.alert('Success', 'OTP sent!');
    } catch (error) {
      console.error('OTP Error:', error.code, error.message);
      Alert.alert('Error', error.message);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    try {
      await confirmation.confirm(otp);
      Alert.alert('Success', 'Phone number verified!');
    } catch (error) {
      console.error('Verify Error:', error.code, error.message);
      Alert.alert('Error', 'Invalid OTP');
    }
  };

  // ... UI implementation
}
```

---

## Setup Checklist

### Firebase Console

**Step 1: Enable Phone Authentication**
1. Go to Firebase Console → **Authentication**
2. Click **Sign-in method** tab
3. Find **Phone** in the providers list
4. Click **Phone** → Toggle **Enable**
5. (Optional but recommended) Add test phone numbers:
   - Click **Phone numbers for testing**
   - Add: Phone `+91 81051 27332` / Verification Code `123456`
6. Click **Save**

**Step 2: Add SHA Fingerprints**
- [ ] Go to Project Settings → Your apps → Android app
- [ ] Click **Add fingerprint**
- [ ] SHA-1 fingerprint added (from `./gradlew signingReport`)
- [ ] SHA-256 fingerprint added (from `./gradlew signingReport`)
- [ ] Download updated google-services.json

**Step 3: Billing & Project**
- [ ] Project upgraded to **Blaze (Pay as you go)** plan
- [ ] google-services.json downloaded and placed in `android/app/`

### Google Cloud Console

**Enable Required APIs** (Critical for Phone Auth to work!)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Firebase project from dropdown
3. Navigate to **APIs & Services** → **Library**
4. Search and enable:
   - [ ] **Identity Toolkit API** - Click Enable
   - [ ] **Firebase Authentication API** - Click Enable

**Why these are needed:** Firebase Phone Auth uses these backend APIs to process authentication requests. Without them, requests will fail silently.

### Android Configuration
- [ ] `google-services.json` in `android/app/`
- [ ] `play-services-auth` dependency added
- [ ] `play-integrity` dependency added
- [ ] Internet permission in AndroidManifest
- [ ] App rebuilt after config changes

### Development Environment
- [ ] Chrome Debugger **DISABLED**
- [ ] Testing on real device (recommended)
- [ ] Google Play Services updated on device

---

## Testing Strategy

### 1. Test with Test Phone Number
Configure in Firebase Console:
```
Phone: +91 81051 27332
OTP: 123456
```

This bypasses SMS and works instantly.

### 2. Test with Real Number
Use your actual phone number to test SMS delivery.

### 3. Debug Logging
Add comprehensive logging:
```javascript
console.log('=== SENDING OTP ===');
console.log('Phone:', fullPhoneNumber);
console.log('Auth instance:', auth());

try {
  const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
  console.log('=== OTP SENT SUCCESS ===');
  console.log('Verification ID:', confirmation.verificationId);
} catch (error) {
  console.error('=== OTP ERROR ===');
  console.error('Code:', error.code);
  console.error('Message:', error.message);
}
```

---

## Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/invalid-phone-number` | Phone number format wrong | Use E.164 format: `+919876543210` |
| `auth/too-many-requests` | Rate limited | Wait or use test numbers |
| `auth/app-not-authorized` | SHA keys mismatch | Add correct SHA keys to Firebase |
| `auth/network-request-failed` | Network/Play Integrity issue | Check network, add Play Integrity API |
| `auth/invalid-verification-code` | Wrong OTP entered | Check OTP, resend if needed |
| `auth/code-expired` | OTP expired (10 mins) | Resend OTP |

---

## Troubleshooting Steps

1. **Check Firebase Connection**
   ```javascript
   console.log('Firebase App:', auth().app.name);
   console.log('Project ID:', auth().app.options.projectId);
   ```

2. **Verify SHA Keys Match**
   ```bash
   ./gradlew signingReport | grep SHA
   ```
   Compare with Firebase Console.

3. **Test Network**
   Try different networks (WiFi vs Mobile Data).
   Disable VPN.

4. **Check Device**
   - Google Play Services updated?
   - Location enabled?
   - Real device vs Emulator?

5. **Rebuild After Changes**
   ```bash
   cd android && ./gradlew clean
   cd .. && npx react-native run-android
   ```

---

## Prevention Tips

1. **Always disable Chrome Debugger** when testing Firebase Auth
2. **Test with test phone numbers first** before real numbers
3. **Add SHA keys for both debug and release** keystores
4. **Rebuild after any native changes** (gradle, AndroidManifest, google-services.json)
5. **Keep Firebase SDK updated** to avoid deprecated API issues
6. **Monitor Firebase quota** on Blaze plan
7. **Use error boundaries** and proper error handling
8. **Log everything** during development

---

## Resources

- [React Native Firebase Docs](https://rnfirebase.io/auth/phone-auth)
- [Firebase Phone Auth Docs](https://firebase.google.com/docs/auth/android/phone-auth)
- [Play Integrity API](https://developer.android.com/google/play/integrity)
- [Migration to v22](https://rnfirebase.io/migrating-to-v22)

---

## Version Info

- React Native Firebase: v20+
- Firebase SDK: Latest
- Android: Min SDK 21+
- Play Integrity API: v1.3.0

---

**Last Updated:** 2025-12-28
**Status:** ✅ Working
