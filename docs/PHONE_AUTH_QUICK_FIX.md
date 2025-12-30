# Firebase Phone Auth - Quick Fix Guide

## 🚨 Not Working? Check These First

### 1️⃣ Disable Chrome Debugger
```
Shake device → Stop Debugging
```
**Phone Auth WILL NOT work with debugger enabled!**

---

### 2️⃣ Correct SHA Keys?
```bash
./gradlew signingReport | grep SHA
```
Add **both SHA-1 and SHA-256** to Firebase Console → Project Settings

---

### 3️⃣ Rebuild After Changes
```bash
npx react-native run-android
```
**Always rebuild after:**
- Adding SHA keys
- Updating google-services.json
- Changing build.gradle

---

### 4️⃣ Required Dependencies
`android/app/build.gradle`:
```gradle
implementation("com.google.android.gms:play-services-auth:21.0.0")
implementation("com.google.android.play:integrity:1.3.0")
```

---

### 5️⃣ Firebase Console Setup
1. **Authentication** → **Sign-in method** → **Phone** → **Enable**
2. Add test number (optional): `+91 81051 27332` / Code: `123456`
3. **Project Settings** → Add SHA-1 and SHA-256
4. Download new google-services.json
5. **Blaze plan** enabled (required!)

### 6️⃣ Google Cloud Console Setup
1. [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Library**
3. Enable **Identity Toolkit API** ✅
4. Enable **Firebase Authentication API** ✅

---

## 💡 Quick Test

1. Disable debugger
2. Enter test number: `8105127332`
3. Should work without reCAPTCHA
4. Enter OTP: `123456`
5. ✅ Success!

---

## 🔍 Error Messages

| Error | Fix |
|-------|-----|
| `sessionStorage` error | Disable Chrome Debugger |
| `auth/app-not-authorized` | Check SHA keys |
| `auth/network-request-failed` | Add Play Integrity API |
| Request hangs | Fix promise handling, check debugger |

---

## 📝 Working Code Template

```javascript
import auth from '@react-native-firebase/auth';

// Send OTP
const confirmation = await auth().signInWithPhoneNumber('+919876543210');

// Verify OTP
await confirmation.confirm('123456');
```

---

**Full Guide:** See `FIREBASE_PHONE_AUTH_TROUBLESHOOTING.md`
