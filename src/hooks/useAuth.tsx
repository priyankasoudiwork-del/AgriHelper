import { useStores } from '../providers/StoreProvider';

export const useAuth = () => {
  const { authStore } = useStores();

  return {
    // State
    user: authStore.user,
    isLoading: authStore.isLoading,
    isAuthenticated: authStore.isAuthenticated,
    error: authStore.error,
    phoneNumber: authStore.phoneNumber,
    userId: authStore.userId,

    // OTP verification state
    otpSent: authStore.otpSent,
    pendingPhoneNumber: authStore.pendingPhoneNumber,

    // Actions
    loginWithPhone: authStore.loginWithPhone,
    verifyOTP: authStore.verifyOTP,
    logout: authStore.logout,
    resetOtpState: authStore.resetOtpState,
    clearError: authStore.clearError,
  };
};
