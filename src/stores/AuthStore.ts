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
  })
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
      self.setLoading(true);
      self.setError(null);
      try {
        const fullPhoneNumber = `+91${phoneNumber}`;
        const confirmation = yield auth().signInWithPhoneNumber(fullPhoneNumber);
        self.setLoading(false);
        return confirmation; // Return to UI for OTP verification
      } catch (error: any) {
        console.error('[AuthStore] Login error:', error);
        self.setError(error.message);
        self.setLoading(false);
        throw error;
      }
    }),

    // Verify OTP
    verifyOTP: flow(function* (confirmation: any, otp: string) {
      self.setLoading(true);
      self.setError(null);
      try {
        const userCredential = yield confirmation.confirm(otp);
        self.setUser(userCredential.user);
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
        self.setLoading(false);
      } catch (error: any) {
        console.error('[AuthStore] Logout error:', error);
        self.setError(error.message);
        self.setLoading(false);
      }
    }),

    // Reset error
    clearError() {
      self.setError(null);
    },
  }));

export interface IAuthStore extends Instance<typeof AuthStore> {}
