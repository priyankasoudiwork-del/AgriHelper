import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { setupRootStore } from '../stores/helpers/setupRootStore';
import { IRootStore } from '../stores/RootStore';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const RootStoreContext = createContext<IRootStore | undefined>(undefined);

export const useStores = () => {
  const context = useContext(RootStoreContext);
  if (context === undefined) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [rootStore, setRootStore] = useState<IRootStore | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const store = await setupRootStore();
      setRootStore(store);
    })();
  }, []);

  // Show loading screen while store initializes
  if (!rootStore) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0284c7" />
        <Text style={styles.loadingText}>ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ | Initializing...</Text>
      </View>
    );
  }

  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0284c7',
    fontWeight: '500',
  },
});
