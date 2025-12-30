import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../hooks/useAuth';
import { ScreenProps, FeatureCard } from '../types';
import { Header, Card, BilingualText, ConfirmDialog } from '../components';

const HomeScreen = observer(({ navigation }: ScreenProps<'Home'>) => {
  const { logout, phoneNumber } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    await logout();
  };

  const features: FeatureCard[] = [
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

  const handleFeaturePress = (feature: FeatureCard) => {
    if (feature.route) {
      navigation.navigate(feature.route);
    } else {
      alert('ಶೀಘ್ರದಲ್ಲಿ ಬರಲಿದೆ | Coming Soon');
    }
  };

  const renderItem: ListRenderItem<FeatureCard> = ({ item }) => (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={() => handleFeaturePress(item)}
      activeOpacity={0.8}
    >
      <Card style={[styles.card, { backgroundColor: item.bgColor }]}>
        <Text style={styles.icon}>{item.icon}</Text>
        <BilingualText
          kannada={item.titleKn}
          english={item.titleEn}
          kannadaStyle={[styles.titleKn, { color: item.color }]}
          englishStyle={styles.titleEn}
          separator="\n"
        />
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="ಕೃಷಿ ಸಹಾಯಕ"
        subtitle={phoneNumber ? `Farm Assistant • 📱 ${phoneNumber}` : "Farm Assistant"}
        rightIcon="🚪"
        onRightPress={handleLogout}
        style={styles.header}
      />

      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />

      <ConfirmDialog
        visible={showLogoutDialog}
        title="ಲಾಗ್ಔಟ್ | Logout"
        message="ನೀವು ಲಾಗ್ಔಟ್ ಮಾಡಲು ಬಯಸುವಿರಾ? Are you sure you want to logout?"
        confirmText="ಲಾಗ್ಔಟ್ | Logout"
        cancelText="ರದ್ದುಮಾಡಿ | Cancel"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
        variant="danger"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    backgroundColor: '#0284c7',
  },
  grid: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
  },
  card: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  titleKn: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleEn: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default HomeScreen;
