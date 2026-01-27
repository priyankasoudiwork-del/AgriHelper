import { types, flow, Instance } from 'mobx-state-tree';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// User Model
const UserModel = types.model('User', {
  uid: types.identifier,
  phoneNumber: types.maybeNull(types.string),
  displayName: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
});

// AuthStore Model
export const AuthStore = types
  .model('AuthStore', {
    user: types.maybeNull(UserModel),
    isLoading: types.optional(types.boolean, true),
    isAuthenticated: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
    // OTP verification state
    pendingPhoneNumber: types.maybeNull(types.string),
    otpSent: types.optional(types.boolean, false),
  })
  .volatile(() => ({
    // Non-serializable confirmation object stored in volatile state
    confirmation: null as FirebaseAuthTypes.ConfirmationResult | null,
  }))
  .views((self) => ({
    get phoneNumber() {
      return self.user?.phoneNumber || null;
    },
    get userId() {
      return self.user?.uid || null;
    },
  }))
  .actions((self) => ({
    setUser(user: FirebaseAuthTypes.User | null) {
      if (user) {
        self.user = {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          displayName: user.displayName,
          createdAt: user.metadata.creationTime || null,
        };
        self.isAuthenticated = true;
      } else {
        self.user = null;
        self.isAuthenticated = false;
      }
    },
    setLoading(loading: boolean) {
      self.isLoading = loading;
    },
    setError(error: string | null) {
      self.error = error;
    },
    setConfirmation(confirmation: FirebaseAuthTypes.ConfirmationResult | null) {
      self.confirmation = confirmation;
    },
    setPendingPhoneNumber(phoneNumber: string | null) {
      self.pendingPhoneNumber = phoneNumber;
    },
    setOtpSent(sent: boolean) {
      self.otpSent = sent;
    },
  }))
  .actions((self) => ({
    // Initialize auth listener
    initializeAuth: flow(function* () {
      self.setLoading(true);
      try {
        // Set up Firebase auth state listener
        return auth().onAuthStateChanged((user) => {
          console.log('[AuthStore] Auth state changed:', user?.uid);
          self.setUser(user);
          self.setLoading(false);
        });
      } catch (error: any) {
        console.error('[AuthStore] Error initializing auth:', error);
        self.setError(error.message);
        self.setLoading(false);
      }
    }),

    // Login with phone number
    loginWithPhone: flow(function* (phoneNumber: string) {
      // Don't set global isLoading - LoginScreen has its own loading state
      // Setting global isLoading causes RootNavigator to remount everything
      self.setError(null);
      try {
        const fullPhoneNumber = `+91${phoneNumber}`;
        const confirmation = yield auth().signInWithPhoneNumber(fullPhoneNumber);

        // Store confirmation and pending state
        self.setConfirmation(confirmation);
        self.setPendingPhoneNumber(phoneNumber);
        self.setOtpSent(true);

        return confirmation; // Return to UI for OTP verification
      } catch (error: any) {
        console.error('[AuthStore] Login error:', error);
        self.setError(error.message);
        throw error;
      }
    }),

    // Verify OTP - can use stored confirmation or provided one
    verifyOTP: flow(function* (confirmationOrOtp: any, otpCode?: string) {
      self.setLoading(true);
      self.setError(null);
      try {
        // Support both signatures: verifyOTP(otp) or verifyOTP(confirmation, otp)
        const confirmation = otpCode ? confirmationOrOtp : self.confirmation;
        const otp = otpCode || confirmationOrOtp;

        if (!confirmation) {
          throw new Error('No confirmation object available');
        }

        const userCredential = yield confirmation.confirm(otp);
        self.setUser(userCredential.user);

        // Clear OTP verification state
        self.setConfirmation(null);
        self.setPendingPhoneNumber(null);
        self.setOtpSent(false);

        self.setLoading(false);
        return userCredential.user;
      } catch (error: any) {
        console.error('[AuthStore] OTP verification error:', error);
        self.setError(error.message);
        self.setLoading(false);
        throw error;
      }
    }),

    // Logout
    logout: flow(function* () {
      self.setLoading(true);
      try {
        yield auth().signOut();
        self.setUser(null);
        self.setError(null);

        // Clear OTP state
        self.setConfirmation(null);
        self.setPendingPhoneNumber(null);
        self.setOtpSent(false);

        self.setLoading(false);
      } catch (error: any) {
        console.error('[AuthStore] Logout error:', error);
        self.setError(error.message);
        self.setLoading(false);
      }
    }),

    // Reset OTP state (for editing phone number)
    resetOtpState() {
      self.setConfirmation(null);
      self.setPendingPhoneNumber(null);
      self.setOtpSent(false);
      self.setError(null);
    },

    // Reset error
    clearError() {
      self.setError(null);
    },
  }));

export interface IAuthStore extends Instance<typeof AuthStore> {}
