// ProductScannerScreen.tsx
// Static version - No AI needed, instant results in Kannada!

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

interface ProductInfo {
  productNameKn: string;
  productName: string;
  typeKn: string;
  type: string;
  benefitsKn: string[];
  benefits: string[];
  dosageKn: string;
  dosage: string;
  usageKn: string;
  usage: string;
  timingKn: string;
  timing: string;
  sprayWeatherKn: string;
  sprayWeather: string;
  safetyKn: string[];
  safety: string[];
}

interface ProductScannerScreenProps {
  navigation: any;
}

// Static database of common chemicals with Kannada translations
const CHEMICAL_DATABASE: { [key: string]: ProductInfo } = {
  'npk': {
    productNameKn: 'ಎನ್ಪಿಕೆ 19:19:19',
    productName: 'NPK 19:19:19 Fertilizer',
    typeKn: 'ಸಮತೋಲಿತ ರಸಗೊಬ್ಬರ',
    type: 'Balanced Fertilizer',
    benefitsKn: [
      'ಸಸ್ಯಗಳ ಬೆಳವಣಿಗೆಗೆ ಸಮತೋಲಿತ ಪೋಷಕಾಂಶಗಳು',
      'ಹೂವು ಮತ್ತು ಹಣ್ಣುಗಳ ಗುಣಮಟ್ಟ ಹೆಚ್ಚಿಸುತ್ತದೆ',
      'ಬೇರುಗಳ ಬೆಳವಣಿಗೆಯನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುತ್ತದೆ',
      'ಎಲ್ಲಾ ಬೆಳೆಗಳಿಗೆ ಸೂಕ್ತ'
    ],
    benefits: [
      'Balanced nutrients for plant growth',
      'Improves flower and fruit quality',
      'Promotes root development',
      'Suitable for all crops'
    ],
    dosageKn: 'ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2-3 ಗ್ರಾಂ',
    dosage: '2-3 grams per liter of water',
    usageKn: 'ನೀರಿನಲ್ಲಿ ಕರಗಿಸಿ ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸಿ ಅಥವಾ ಮಣ್ಣಿಗೆ ಹಾಕಿ',
    usage: 'Dissolve in water and spray on leaves or apply to soil',
    timingKn: 'ಬೆಳಗಿನ ಜಾವ 6-9 ಗಂಟೆ ಅಥವಾ ಸಂಜೆ 4-6 ಗಂಟೆ',
    timing: 'Early morning 6-9 AM or evening 4-6 PM',
    sprayWeatherKn: 'ಮಳೆಯಿಲ್ಲದ ದಿನ, ಗಾಳಿಯ ವೇಗ ಕಡಿಮೆ ಇರುವಾಗ',
    sprayWeather: 'No rain day, low wind speed',
    safetyKn: [
      'ಕೈಗವಸು ಮತ್ತು ಮಾಸ್ಕ್ ಧರಿಸಿ',
      'ಮಕ್ಕಳು ಮತ್ತು ಪ್ರಾಣಿಗಳಿಂದ ದೂರವಿಡಿ',
      'ಬಳಕೆಯ ನಂತರ ಕೈ ತೊಳೆಯಿರಿ'
    ],
    safety: [
      'Wear gloves and mask',
      'Keep away from children and animals',
      'Wash hands after use'
    ]
  },
  
  'aliette': {
    productNameKn: 'ಅಲಿಯೆಟ್ ಬೇಯರ್',
    productName: 'Aliette (Fosetyl-Al)',
    typeKn: 'ಶಿಲೀಂಧ್ರನಾಶಕ',
    type: 'Fungicide',
    benefitsKn: [
      'ಡೌನಿ ಮಿಲ್ಡ್ಯೂ ರೋಗ ನಿಯಂತ್ರಣ',
      'ಬೇರು ಕೊಳೆತ ತಡೆಯುತ್ತದೆ',
      'ಸಸ್ಯದ ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ ಹೆಚ್ಚಿಸುತ್ತದೆ',
      'ದ್ರಾಕ್ಷಿ, ಟೊಮೇಟೊ, ಆಲೂಗಡ್ಡೆಗೆ ಸೂಕ್ತ'
    ],
    benefits: [
      'Controls Downy Mildew disease',
      'Prevents root rot',
      'Increases plant immunity',
      'Suitable for grapes, tomato, potato'
    ],
    dosageKn: '15 ಲೀಟರ್ ನೀರಿಗೆ 30 ಗ್ರಾಂ',
    dosage: '30 grams per 15 liters of water',
    usageKn: 'ನೀರಿನಲ್ಲಿ ಚೆನ್ನಾಗಿ ಕರಗಿಸಿ ಎಲೆ ಮತ್ತು ಬೇರಿನ ಮೇಲೆ ಸಿಂಪಡಿಸಿ',
    usage: 'Dissolve well in water and spray on leaves and roots',
    timingKn: 'ರೋಗದ ಲಕ್ಷಣಗಳು ಕಂಡ ತಕ್ಷಣ, 10-15 ದಿನಗಳ ಅಂತರದಲ್ಲಿ ಪುನರಾವರ್ತನೆ',
    timing: 'At first sign of disease, repeat after 10-15 days',
    sprayWeatherKn: 'ಶುಷ್ಕ ಹವಾಮಾನ, ಮಳೆಯ 24 ಗಂಟೆ ಮೊದಲು ಅಲ್ಲ',
    sprayWeather: 'Dry weather, not 24 hours before rain',
    safetyKn: [
      'ಸಂಪೂರ್ಣ ಸುರಕ್ಷತಾ ಉಪಕರಣಗಳು ಧರಿಸಿ',
      'ತಿನ್ನುವಾಗ ಅಥವಾ ಧೂಮಪಾನ ಮಾಡುವಾಗ ಬಳಸಬೇಡಿ',
      'ಖಾಲಿ ಕಂಟೇನರ್ ಸರಿಯಾಗಿ ವಿಲೇವಾರಿ ಮಾಡಿ'
    ],
    safety: [
      'Wear complete safety equipment',
      'Do not use while eating or smoking',
      'Dispose empty containers properly'
    ]
  },

  'chlorpyrifos': {
    productNameKn: 'ಕ್ಲೋರ್‌ಪೈರಿಫಾಸ್ 20% EC',
    productName: 'Chlorpyrifos 20% EC',
    typeKn: 'ಕೀಟನಾಶಕ',
    type: 'Insecticide',
    benefitsKn: [
      'ಗದ್ದೆ ಮತ್ತು ಬೇರು ಕೀಟಗಳನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ',
      'ಎಲೆ ತಿನ್ನುವ ಕೀಟಗಳ ವಿರುದ್ಧ ಪರಿಣಾಮಕಾರಿ',
      'ದೀರ್ಘಕಾಲ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ',
      'ಅನೇಕ ಬೆಳೆಗಳಿಗೆ ಅನ್ವಯವಾಗುತ್ತದೆ'
    ],
    benefits: [
      'Controls stem and root insects',
      'Effective against leaf-eating insects',
      'Provides long-lasting protection',
      'Applicable to many crops'
    ],
    dosageKn: '15 ಲೀಟರ್ ನೀರಿಗೆ 30-40 ಮಿಲಿ',
    dosage: '30-40 ml per 15 liters of water',
    usageKn: 'ನೀರಿನಲ್ಲಿ ಕರಗಿಸಿ ಬೆಳೆಯ ಮೇಲೆ ಸಮವಾಗಿ ಸಿಂಪಡಿಸಿ',
    usage: 'Dissolve in water and spray evenly on crops',
    timingKn: 'ಕೀಟಗಳ ದಾಳಿಯ ಆರಂಭದಲ್ಲಿ, 7-10 ದಿನಗಳ ಅಂತರದಲ್ಲಿ ಪುನರಾವರ್ತನೆ',
    timing: 'At early pest attack, repeat after 7-10 days',
    sprayWeatherKn: 'ತಂಪಾದ ಸಮಯ, ಬಿಸಿಲಿನ ಹೊತ್ತಿನಲ್ಲಿ ಬಳಸಬೇಡಿ',
    sprayWeather: 'Cool time, avoid during hot sunny hours',
    safetyKn: [
      'ಅತ್ಯಂತ ವಿಷಕಾರಿ - ಜಾಗರೂಕರಾಗಿರಿ',
      'ಮಾಸ್ಕ್, ಕೈಗವಸು ಮತ್ತು ರಕ್ಷಣಾ ಬಟ್ಟೆ ಧರಿಸಿ',
      'ಸಿಂಪಡಣೆಯ ನಂತರ ಸ್ನಾನ ಮಾಡಿ',
      'ಆಹಾರ ಪದಾರ್ಥಗಳ ಬಳಿ ಇಡಬೇಡಿ'
    ],
    safety: [
      'Highly toxic - be careful',
      'Wear mask, gloves and protective clothing',
      'Take bath after spraying',
      'Do not keep near food items'
    ]
  },

  'humic acid': {
    productNameKn: 'ಹ್ಯೂಮಿಕ್ ಆಸಿಡ್',
    productName: 'Humic Acid',
    typeKn: 'ಮಣ್ಣು ಸುಧಾರಕ',
    type: 'Soil Conditioner',
    benefitsKn: [
      'ಮಣ್ಣಿನ ರಚನೆ ಸುಧಾರಿಸುತ್ತದೆ',
      'ಪೋಷಕಾಂಶಗಳ ಹೀರಿಕೊಳ್ಳುವಿಕೆ ಹೆಚ್ಚಿಸುತ್ತದೆ',
      'ಬೇರಿನ ಬೆಳವಣಿಗೆಯನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುತ್ತದೆ',
      'ಮಣ್ಣಿನ ಉಪ್ಪು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ'
    ],
    benefits: [
      'Improves soil structure',
      'Increases nutrient absorption',
      'Promotes root growth',
      'Reduces soil salinity'
    ],
    dosageKn: 'ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 1-2 ಮಿಲಿ',
    dosage: '1-2 ml per liter of water',
    usageKn: 'ನೀರಿನಲ್ಲಿ ಕರಗಿಸಿ ಮಣ್ಣಿಗೆ ಹಾಕಿ ಅಥವಾ ಎಲೆಗಳ ಮೇಲೆ ಸಿಂಪಡಿಸಿ',
    usage: 'Dissolve in water and apply to soil or spray on leaves',
    timingKn: 'ಎಲ್ಲಾ ಬೆಳೆ ಹಂತಗಳಲ್ಲಿ, 15 ದಿನಗಳ ಅಂತರದಲ್ಲಿ',
    timing: 'At all crop stages, 15 days interval',
    sprayWeatherKn: 'ಯಾವುದೇ ಹವಾಮಾನದಲ್ಲಿ ಬಳಸಬಹುದು',
    sprayWeather: 'Can be used in any weather',
    safetyKn: [
      'ಸುರಕ್ಷಿತ ಮತ್ತು ನೈಸರ್ಗಿಕ ಉತ್ಪನ್ನ',
      'ಮೂಲಭೂತ ಸುರಕ್ಷತೆ ಅನುಸರಿಸಿ',
      'ಮಕ್ಕಳ ವ್ಯಾಪ್ತಿಯಿಂದ ದೂರವಿಡಿ'
    ],
    safety: [
      'Safe and natural product',
      'Follow basic safety measures',
      'Keep away from children'
    ]
  },

  'urea': {
    productNameKn: 'ಯೂರಿಯಾ',
    productName: 'Urea (46% Nitrogen)',
    typeKn: 'ಸಾರಜನಕ ರಸಗೊಬ್ಬರ',
    type: 'Nitrogen Fertilizer',
    benefitsKn: [
      'ಸಸ್ಯಗಳ ಹಸಿರು ಬೆಳವಣಿಗೆಗೆ',
      'ಎಲೆಗಳ ಬೆಳವಣಿಗೆ ಹೆಚ್ಚಿಸುತ್ತದೆ',
      'ಪ್ರೋಟೀನ್ ಉತ್ಪಾದನೆ ಹೆಚ್ಚಿಸುತ್ತದೆ',
      'ಬೆಳೆ ಇಳುವರಿ ಹೆಚ್ಚು ಮಾಡುತ್ತದೆ'
    ],
    benefits: [
      'For green plant growth',
      'Increases leaf development',
      'Increases protein production',
      'Improves crop yield'
    ],
    dosageKn: 'ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 5 ಗ್ರಾಂ (ಎಲೆ ಸಿಂಪಡಣೆ)',
    dosage: '5 grams per liter of water (foliar spray)',
    usageKn: 'ನೀರಿನಲ್ಲಿ ಕರಗಿಸಿ ಬೆಳಗಿನ ಜಾವದಲ್ಲಿ ಸಿಂಪಡಿಸಿ',
    usage: 'Dissolve in water and spray in morning',
    timingKn: 'ಬೆಳೆಯ ಬೆಳವಣಿಗೆ ಹಂತದಲ್ಲಿ, 15 ದಿನಗಳ ಅಂತರದಲ್ಲಿ',
    timing: 'During growth stage, 15 days interval',
    sprayWeatherKn: 'ತಂಪಾದ ಸಮಯ, ಬಿಸಿಲಿನಲ್ಲಿ ಸಿಂಪಡಿಸಬೇಡಿ',
    sprayWeather: 'Cool time, do not spray in hot sun',
    safetyKn: [
      'ಅತಿಯಾಗಿ ಬಳಸಬೇಡಿ',
      'ಸೂಚಿತ ಪ್ರಮಾಣ ಮಾತ್ರ ಬಳಸಿ',
      'ತೇವಾಂಶದಿಂದ ದೂರವಿಡಿ'
    ],
    safety: [
      'Do not overuse',
      'Use only recommended dosage',
      'Keep away from moisture'
    ]
  }
};

export default function ProductScannerScreen({ navigation }: ProductScannerScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [notFound, setNotFound] = useState(false);

  const searchProduct = () => {
    setNotFound(false);
    setProductInfo(null);

    const query = searchText.toLowerCase().trim();
    
    // Search in database
    for (const key in CHEMICAL_DATABASE) {
      if (query.includes(key) || key.includes(query)) {
        setProductInfo(CHEMICAL_DATABASE[key]);
        return;
      }
    }
    
    // Not found
    setNotFound(true);
  };

  const quickSearch = (chemicalKey: string) => {
    setSearchText(CHEMICAL_DATABASE[chemicalKey].productName);
    setProductInfo(CHEMICAL_DATABASE[chemicalKey]);
    setNotFound(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={{alignSelf:"flex-start"}} 
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>
              ← ಹಿಂದಕ್ಕೆ
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ರಾಸಾಯನಿಕ ಮಾಹಿತಿ</Text>
          <Text style={styles.headerSubtitle}>Chemical Information</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Search Input */}
        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>
            🔍 ರಾಸಾಯನಿಕ ಹೆಸರು ನಮೂದಿಸಿ | Enter Chemical Name
          </Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="ಉದಾ: NPK, Aliette, Urea..."
              placeholderTextColor="#9ca3af"
              onSubmitEditing={searchProduct}
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchProduct}>
              <Text style={styles.searchButtonText}>ಹುಡುಕಿ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Search Buttons */}
        <View style={styles.quickSection}>
          <Text style={styles.quickTitle}>⚡ ಜನಪ್ರಿಯ ರಾಸಾಯನಿಕಗಳು | Popular:</Text>
          <View style={styles.quickButtons}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => quickSearch('npk')}>
              <Text style={styles.quickBtnText}>NPK 19:19:19</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => quickSearch('aliette')}>
              <Text style={styles.quickBtnText}>Aliette</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => quickSearch('chlorpyrifos')}>
              <Text style={styles.quickBtnText}>Chlorpyrifos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => quickSearch('humic acid')}>
              <Text style={styles.quickBtnText}>Humic Acid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickBtn} onPress={() => quickSearch('urea')}>
              <Text style={styles.quickBtnText}>Urea</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Not Found */}
        {notFound && (
          <View style={styles.notFoundCard}>
            <Text style={styles.notFoundIcon}>❌</Text>
            <Text style={styles.notFoundTitle}>ಕಂಡುಬಂದಿಲ್ಲ</Text>
            <Text style={styles.notFoundText}>
              ಈ ರಾಸಾಯನಿಕ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.{'\n'}
              ಮೇಲಿನ ಜನಪ್ರಿಯ ಆಯ್ಕೆಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ.
            </Text>
            <Text style={styles.notFoundTextEn}>
              This chemical is not available in database.{'\n'}
              Try popular options above.
            </Text>
          </View>
        )}

        {/* Product Details */}
        {productInfo && (
          <View style={styles.resultsContainer}>
            
            {/* Product Name Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>📦</Text>
                <Text style={styles.cardTitle}>ಉತ್ಪನ್ನದ ಹೆಸರು | Product Name</Text>
              </View>
              <Text style={styles.productNameKn}>{productInfo.productNameKn}</Text>
              <Text style={styles.productNameEn}>{productInfo.productName}</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {productInfo.typeKn} | {productInfo.type}
                </Text>
              </View>
            </View>

            {/* Benefits Card */}
            <View style={[styles.infoCard, styles.benefitsCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>✅</Text>
                <Text style={styles.cardTitle}>ಪ್ರಯೋಜನಗಳು | Benefits</Text>
              </View>
              {productInfo.benefitsKn.map((benefit, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>●</Text>
                  <View style={styles.bulletContent}>
                    <Text style={styles.bulletTextKn}>{benefit}</Text>
                    <Text style={styles.bulletTextEn}>
                      {productInfo.benefits[index]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Dosage Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>💧</Text>
                <Text style={styles.cardTitle}>ಪ್ರಮಾಣ | Dosage</Text>
              </View>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightTextKn}>{productInfo.dosageKn}</Text>
                <Text style={styles.highlightTextEn}>{productInfo.dosage}</Text>
              </View>
            </View>

            {/* Usage Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>📋</Text>
                <Text style={styles.cardTitle}>ಬಳಕೆಯ ವಿಧಾನ | Usage</Text>
              </View>
              <Text style={styles.descriptionKn}>{productInfo.usageKn}</Text>
              <Text style={styles.descriptionEn}>{productInfo.usage}</Text>
            </View>

            {/* Timing Card */}
            <View style={styles.infoCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>⏰</Text>
                <Text style={styles.cardTitle}>ಸೂಕ್ತ ಸಮಯ | Best Time</Text>
              </View>
              <Text style={styles.descriptionKn}>{productInfo.timingKn}</Text>
              <Text style={styles.descriptionEn}>{productInfo.timing}</Text>
            </View>

            {/* Weather Card */}
            <View style={[styles.infoCard, styles.weatherCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>🌤️</Text>
                <Text style={styles.cardTitle}>ಹವಾಮಾನ | Weather</Text>
              </View>
              <Text style={styles.weatherTextKn}>{productInfo.sprayWeatherKn}</Text>
              <Text style={styles.weatherTextEn}>{productInfo.sprayWeather}</Text>
            </View>

            {/* Safety Card */}
            <View style={[styles.infoCard, styles.safetyCard]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>⚠️</Text>
                <Text style={styles.cardTitle}>ಸುರಕ್ಷತೆ | Safety</Text>
              </View>
              {productInfo.safetyKn.map((safety, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>⚡</Text>
                  <View style={styles.bulletContent}>
                    <Text style={styles.safetyTextKn}>{safety}</Text>
                    <Text style={styles.safetyTextEn}>
                      {productInfo.safety[index]}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.spacer} />
          </View>
        )}

        {/* Empty State */}
        {!productInfo && !notFound && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔬</Text>
            <Text style={styles.emptyText}>ರಾಸಾಯನಿಕ ಹುಡುಕಿ</Text>
            <Text style={styles.emptyTextEn}>Search for a chemical</Text>
            <Text style={styles.emptyDescription}>
              ಮೇಲೆ ಹೆಸರು ನಮೂದಿಸಿ ಅಥವಾ{'\n'}
              ಜನಪ್ರಿಯ ಆಯ್ಕೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ
            </Text>
          </View>
        )}
        
      </ScrollView>
    </View>
  );
}

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
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0f2fe',
  },
  content: {
    flex: 1,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  searchButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quickSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickBtn: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0369a1',
  },
  notFoundCard: {
    backgroundColor: '#fee2e2',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fca5a5',
  },
  notFoundIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 12,
  },
  notFoundText: {
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  notFoundTextEn: {
    fontSize: 13,
    color: '#ef4444',
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsContainer: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  productNameKn: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0284c7',
    marginBottom: 6,
  },
  productNameEn: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0369a1',
  },
  benefitsCard: {
    backgroundColor: '#dcfce7',
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
  },
  bulletDot: {
    fontSize: 16,
    color: '#16a34a',
    marginTop: 2,
  },
  bulletContent: {
    flex: 1,
  },
  bulletTextKn: {
    fontSize: 15,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 2,
    lineHeight: 20,
  },
  bulletTextEn: {
    fontSize: 13,
    color: '#16a34a',
    lineHeight: 18,
  },
  highlightBox: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    padding: 16,
    borderRadius: 8,
  },
  highlightTextKn: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 4,
  },
  highlightTextEn: {
    fontSize: 15,
    color: '#0284c7',
  },
  descriptionKn: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
    marginBottom: 8,
  },
  descriptionEn: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  weatherCard: {
    backgroundColor: '#fef3c7',
  },
  weatherTextKn: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 6,
    lineHeight: 22,
  },
  weatherTextEn: {
    fontSize: 13,
    color: '#d97706',
    lineHeight: 20,
  },
  safetyCard: {
    backgroundColor: '#fee2e2',
  },
  safetyTextKn: {
    fontSize: 15,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 3,
    lineHeight: 20,
  },
  safetyTextEn: {
    fontSize: 13,
    color: '#dc2626',
    lineHeight: 18,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  emptyTextEn: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  spacer: {
    height: 40,
  },
});