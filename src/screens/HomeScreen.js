// screens/HomeScreen.js
// Home screen with stable GridView (2 columns on all devices)

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../hooks/useAuth';

const HomeScreen = observer(({ navigation }) => {
  const { logout, phoneNumber } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'ಲಾಗ್ಔಟ್ | Logout',
      'ನೀವು ಲಾಗ್ಔಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ?\nAre you sure you want to logout?',
      [
        {
          text: 'ರದ್ದುಮಾಡಿ | Cancel',
          style: 'cancel',
        },
        {
          text: 'ಲಾಗ್ಔಟ್ | Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Navigation will be handled by RootNavigator
          },
        },
      ]
    );
  };

  const features = [
    {
      id: '1',
      icon: '🌤️',
      titleKn: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
      titleEn: 'Weather Forecast',
      color: '#0284c7',
      bgColor: '#e0f2fe',
      route: 'Weather',
    },
    {
      id: '2',
      icon: '📸',
      titleKn: 'ರಾಸಾಯನಿಕ ಮಾಹಿತಿ',
      titleEn: 'Product Scanner',
      color: '#059669',
      bgColor: '#d1fae5',
      route: 'AiScanner',
    },
    {
      id: '3',
      icon: '🌾',
      titleKn: 'ಕೃಷಿ ಮಾಹಿತಿ',
      titleEn: 'Farming Info',
      color: '#d97706',
      bgColor: '#fef3c7',
      route: 'FarmInfo',
    },
    {
      id: '4',
      icon: '📋',
      titleKn: 'ಸಿಂಪಡಣೆ ದಾಖಲೆ',
      titleEn: 'Spray Records',
      color: '#7c3aed',
      bgColor: '#ede9fe',
      route: 'SprayRecordsList',
    },
    {
      id: '5',
      icon: '💰',
      titleKn: 'ಖರ್ಚು ಲೆಕ್ಕಾಚಾರ',
      titleEn: 'Expense Tracker',
      color: '#dc2626',
      bgColor: '#fee2e2',
      route: null,
    },
    {
      id: '6',
      icon: '📚',
      titleKn: 'ಕೃಷಿ ಪುಸ್ತಕ',
      titleEn: 'Farm Knowledge',
      color: '#0891b2',
      bgColor: '#cffafe',
      route: null,
    },
  ];

  const handleFeaturePress = (feature) => {
    if (feature.route) {
      navigation.navigate(feature.route);
    } else {
      alert('ಶೀಘ್ರದಲ್ಲಿ ಬರಲಿದೆ | Coming Soon');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.bgColor }]}
      onPress={() => handleFeaturePress(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={[styles.titleKn, { color: item.color }]}>
        {item.titleKn}
      </Text>
      <Text style={styles.titleEn}>{item.titleEn}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>ಕೃಷಿ ಸಹಾಯಕ</Text>
          <Text style={styles.headerSubtitle}>Farm Assistant</Text>
          {phoneNumber && (
            <Text style={styles.phoneText}>📱 {phoneNumber}</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      {/* GRID */}
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },

  header: {
    backgroundColor: '#0284c7',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0f2fe',
  },
  phoneText: {
    fontSize: 12,
    color: '#e0f2fe',
    marginTop: 4,
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutIcon: {
    fontSize: 24,
  },

  grid: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',            // 🔑 Always 2 columns
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  titleKn: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  titleEn: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default HomeScreen;
