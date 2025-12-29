import { onSnapshot } from 'mobx-state-tree';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStore, IRootStore } from '../RootStore';

const ROOT_STATE_STORAGE_KEY = 'root-store';

/**
 * Setup the root state with persistence
 */
export async function setupRootStore(): Promise<IRootStore> {
  let rootStore: IRootStore;
  let data: any;

  try {
    // Load persisted state
    const storedData = await AsyncStorage.getItem(ROOT_STATE_STORAGE_KEY);
    if (storedData) {
      data = JSON.parse(storedData);
      console.log('[RootStore] Loaded persisted state');
    }
  } catch (error) {
    console.error('[RootStore] Error loading persisted state:', error);
  }

  // Create the root store
  rootStore = RootStore.create(data || {});

  // Initialize auth listener
  rootStore.authStore.initializeAuth();

  // Set up persistence on state changes
  onSnapshot(rootStore, (snapshot) => {
    // Only persist non-sensitive data
    const dataToSave = {
      authStore: {
        // Don't persist loading states or errors
        user: snapshot.authStore.user,
        isAuthenticated: snapshot.authStore.isAuthenticated,
      },
    };

    AsyncStorage.setItem(ROOT_STATE_STORAGE_KEY, JSON.stringify(dataToSave))
      .catch((error) => console.error('[RootStore] Error saving state:', error));
  });

  return rootStore;
}
