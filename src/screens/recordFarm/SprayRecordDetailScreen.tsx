import { View, ScrollView, StyleSheet, Text as RNText, Alert, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Header,
  Card,
  BilingualText,
  Badge,
  InfoBox,
  Button,
} from '../../components';
import sprayRecordService, { SprayRecord } from '../../services/sprayRecordService';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

interface SprayRecordDetailScreenProps {
  navigation: any;
  route: any;
}

const SprayRecordDetailScreen: React.FC<SprayRecordDetailScreenProps> = ({ navigation, route }) => {
  const { userId } = useAuth();
  const initialRecord: SprayRecord = route.params?.record;
  const [record, setRecord] = useState<SprayRecord | null>(initialRecord);
  const [loading, setLoading] = useState(false);

  // Fetch fresh data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRecord();
    });

    return unsubscribe;
  }, [navigation, userId, initialRecord?.id]);

  const fetchRecord = async () => {
    if (!userId || !initialRecord?.id) return;

    setLoading(true);
    try {
      const freshRecord = await sprayRecordService.getSprayRecord(userId, initialRecord.id);
      if (freshRecord) {
        setRecord(freshRecord);
      }
    } catch (error) {
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditSprayRecord', { record });
  };

  const handleDelete = () => {
    Alert.alert(
      'ದಾಖಲೆ ಅಳಿಸಿ | Delete Record',
      'ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?\nAre you sure you want to delete this record?',
      [
        {
          text: 'ರದ್ದು | Cancel',
          style: 'cancel',
        },
        {
          text: 'ಅಳಿಸಿ | Delete',
          style: 'destructive',
          onPress: async () => {
            if (!userId || !record?.id) return;

            try {
              await sprayRecordService.deleteSprayRecord(userId, record.id);
              Alert.alert(
                'ಯಶಸ್ವಿ | Success',
                'ದಾಖಲೆ ಅಳಿಸಲಾಗಿದೆ | Record deleted',
                [
                  {
                    text: 'ಸರಿ | OK',
                    onPress: () => navigation.navigate('SprayRecordsList'),
                  },
                ]
              );
            } catch (error) {
              console.error('Error deleting record:', error);
              Alert.alert(
                'ದೋಷ | Error',
                'ದಾಖಲೆ ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ | Failed to delete record'
              );
            }
          },
        },
      ]
    );
  };

  if (!record) {
    return (
      <View style={styles.container}>
        <Header
          title="ದೋಷ"
          subtitle="Error"
          leftIcon="←"
          onLeftPress={() => navigation.goBack()}
          style={styles.header}
        />
        <InfoBox
          message="ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ | Record not found"
          variant="error"
          style={styles.errorBox}
        />
      </View>
    );
  }

  const getDiseaseLabel = (value: string): string => {
    const diseaseMap: { [key: string]: string } = {
      powdery_mildew: 'ಪುಡಿ ಕಾಯಿಲೆ | Powdery Mildew',
      downy_mildew: 'ಡೌನಿ ಮಿಲ್ಡ್ಯೂ | Downy Mildew',
      anthracnose: 'ಆಂಥ್ರಾಕ್ನೋಸ್ | Anthracnose',
      black_rot: 'ಕಪ್ಪು ಕೊಳೆತ | Black Rot',
      leaf_spot: 'ಎಲೆ ಮಚ್ಚೆ | Leaf Spot',
      pest_control: 'ಕೀಟ ನಿಯಂತ್ರಣ | Pest Control',
      root_rot: 'ಬೇರು ಕೊಳೆತ | Root Rot',
      other: 'ಇತರೆ | Other',
    };
    return diseaseMap[value] || value;
  };

  const getWeatherLabel = (value: string): string => {
    const weatherMap: { [key: string]: string } = {
      sunny: '☀️ ಬಿಸಿಲು | Sunny',
      cloudy: '☁️ ಮೋಡ | Cloudy',
      rainy: '🌧️ ಮಳೆ | Rainy',
    };
    return weatherMap[value] || value;
  };

  const getTimeLabel = (value: string): string => {
    const timeMap: { [key: string]: string } = {
      morning: '🌅 ಬೆಳಿಗ್ಗೆ | Morning',
      afternoon: '☀️ ಮಧ್ಯಾಹ್ನ | Afternoon',
      evening: '🌆 ಸಂಜೆ | Evening',
    };
    return timeMap[value] || value;
  };

  const getMethodLabel = (value: string): string => {
    const methodMap: { [key: string]: string } = {
      hand_pump: '💪 ಕೈ ಪಂಪ್ | Hand Pump',
      motor_pump: '⚙️ ಮೋಟಾರ್ | Motor Pump',
      tractor: '🚜 ಟ್ರಾಕ್ಟರ್ | Tractor',
    };
    return methodMap[value] || value;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="ಸ್ಪ್ರೇ ವಿವರಗಳು"
        subtitle="Spray Record Details"
        leftIcon="←"
        onLeftPress={() => navigation.goBack()}
        style={styles.header}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#16a34a" />
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* Date and Cost Header */}
        <Card style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerItem}>
              <RNText style={styles.headerLabel}>📅 ದಿನಾಂಕ | Date</RNText>
              <RNText style={styles.headerValue}>{formatDate(record.date)}</RNText>
            </View>
            <View style={styles.headerDivider} />
            <View style={styles.headerItem}>
              <RNText style={styles.headerLabel}>💰 ವೆಚ್ಚ | Cost</RNText>
              <RNText style={styles.headerCost}>₹{record.cost}</RNText>
            </View>
          </View>
        </Card>

        {/* Image Section */}
        {record.imageUrl && (
          <Card style={styles.section}>
            <BilingualText
              kannada="ಫೋಟೋ"
              english="Photo"
              style={styles.sectionTitle}
            />
            <FastImage source={{ uri: record.imageUrl }} style={styles.recordImage} resizeMode={FastImage.resizeMode.cover} />
          </Card>
        )}

        {/* Chemical Information */}
        <Card style={styles.section}>
          <BilingualText
            kannada="ರಾಸಾಯನಿಕ ಮಾಹಿತಿ"
            english="Chemical Information"
            style={styles.sectionTitle}
          />

          <DetailRow
            icon="💧"
            label="ರಾಸಾಯನಿಕ ಹೆಸರು | Chemical Name"
            value={record.chemicalName}
          />

          <DetailRow
            icon="🦠"
            label="ರೋಗ / ಸಮಸ್ಯೆ | Disease / Problem"
            value={getDiseaseLabel(record.disease)}
          />

          <DetailRow
            icon="📊"
            label="ಪ್ರಮಾಣ | Quantity"
            value={`${record.quantity} ${record.unit}`}
          />
        </Card>

        {/* Farm Information */}
        <Card style={styles.section}>
          <BilingualText
            kannada="ಜಮೀನು ಮಾಹಿತಿ"
            english="Farm Information"
            style={styles.sectionTitle}
          />

          <DetailRow
            icon="🌾"
            label="ಎಕರೆ | Acres"
            value={`${record.acres} ಎಕರೆ | acres`}
          />
        </Card>

        {/* Spray Conditions */}
        <Card style={styles.section}>
          <BilingualText
            kannada="ಸಿಂಪಡಿಸುವ ಪರಿಸ್ಥಿತಿಗಳು"
            english="Spray Conditions"
            style={styles.sectionTitle}
          />

          {record.weather && (
            <DetailRow
              icon="🌤️"
              label="ಹವಾಮಾನ | Weather"
              value={getWeatherLabel(record.weather)}
            />
          )}

          {record.sprayTime && (
            <DetailRow
              icon="⏰"
              label="ಸಮಯ | Time"
              value={getTimeLabel(record.sprayTime)}
            />
          )}

          {record.sprayMethod && (
            <DetailRow
              icon="🚜"
              label="ಸಿಂಪಡಿಸುವ ವಿಧಾನ | Spray Method"
              value={getMethodLabel(record.sprayMethod)}
            />
          )}
        </Card>

        {/* Notes */}
        {record.notes && (
          <Card style={styles.section}>
            <BilingualText
              kannada="ಟಿಪ್ಪಣಿಗಳು"
              english="Notes"
              style={styles.sectionTitle}
            />
            <InfoBox
              message={record.notes}
              variant="info"
            />
          </Card>
        )}

        {/* Metadata */}
        <Card style={styles.section}>
          <BilingualText
            kannada="ದಾಖಲೆ ಮಾಹಿತಿ"
            english="Record Information"
            style={styles.sectionTitle}
          />

          <RNText style={styles.metadataText}>
            ರಚಿಸಲಾಗಿದೆ | Created: {new Date(record.createdAt).toLocaleString('en-IN')}
          </RNText>
          <RNText style={styles.metadataText}>
            ನವೀಕರಿಸಲಾಗಿದೆ | Updated: {new Date(record.updatedAt).toLocaleString('en-IN')}
          </RNText>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="✏️ ಸಂಪಾದಿಸಿ | Edit"
            onPress={handleEdit}
            variant="primary"
            style={styles.editButton}
          />
          <Button
            title="🗑️ ಅಳಿಸಿ | Delete"
            onPress={handleDelete}
            variant="danger"
            style={styles.deleteButton}
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <RNText style={styles.detailLabel}>
      {icon} {label}
    </RNText>
    <RNText style={styles.detailValue}>{value}</RNText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#16a34a',
  },
  content: {
    flex: 1,
  },
  errorBox: {
    margin: 16,
  },
  headerCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#16a34a',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  headerItem: {
    flex: 1,
    alignItems: 'center',
  },
  headerDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  headerLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerCost: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  recordImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  metadataText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  spacer: {
    height: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 80,
    right: 16,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default SprayRecordDetailScreen;
