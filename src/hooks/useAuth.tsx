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

    // Actions
    loginWithPhone: authStore.loginWithPhone,
    verifyOTP: authStore.verifyOTP,
    logout: authStore.logout,
    clearError: authStore.clearError,
  };
};
