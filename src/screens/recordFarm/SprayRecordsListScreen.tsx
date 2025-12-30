import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import {
  Header,
  Card,
  ListItem,
  SectionHeader,
  Button,
  Badge,
  BilingualText,
  FilterBar,
  InfoBox,
} from '../../components';

interface SprayRecord {
  id: number;
  date: string;
  chemicalName: string;
  disease: string;
  quantity: string;
  unit: string;
  acres: string;
  cost: string;
  weather: string;
  sprayTime: string;
  sprayMethod: string;
  notes: string;
  hasImage: boolean;
}

interface SprayRecordsListScreenProps {
  navigation: any;
}

const SprayRecordsListScreen: React.FC<SprayRecordsListScreenProps> = ({ navigation }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);

  const [records] = useState<SprayRecord[]>([
    {
      id: 1,
      date: '2024-12-20',
      chemicalName: 'ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್',
      disease: 'ಡೌನಿ ಮಿಲ್ಡ್ಯೂ',
      quantity: '200',
      unit: 'ml',
      acres: '2',
      cost: '350',
      weather: 'ಬಿಸಿಲು',
      sprayTime: 'ಬೆಳಿಗ್ಗೆ',
      sprayMethod: 'ಕೈ ಪಂಪ್',
      notes: 'ಮಳೆಯ ನಂತರ ಸಿಂಪಡಿಸಲಾಗಿದೆ',
      hasImage: true,
    },
    {
      id: 2,
      date: '2024-12-18',
      chemicalName: 'ಬವಿಸ್ಟಿನ್',
      disease: 'ಪುಡಿ ಕಾಯಿಲೆ',
      quantity: '500',
      unit: 'ml',
      acres: '3',
      cost: '280',
      weather: 'ಮೋಡ',
      sprayTime: 'ಸಂಜೆ',
      sprayMethod: 'ಮೋಟಾರ್ ಪಂಪ್',
      notes: '',
      hasImage: false,
    },
    {
      id: 3,
      date: '2024-12-15',
      chemicalName: 'ನೀಮ್ ಎಣ್ಣೆ',
      disease: 'ಕೀಟ ನಿಯಂತ್ರಣ',
      quantity: '1',
      unit: 'liter',
      acres: '2.5',
      cost: '450',
      weather: 'ಬಿಸಿಲು',
      sprayTime: 'ಬೆಳಿಗ್ಗೆ',
      sprayMethod: 'ಕೈ ಪಂಪ್',
      notes: 'ಸಾವಯವ ಚಿಕಿತ್ಸೆ',
      hasImage: true,
    },
  ]);

  const filterOptions = [
    { label: '📅 ಎಲ್ಲಾ | All', value: 'all' },
    { label: '📆 ಈ ವಾರ | This Week', value: 'week' },
    { label: '📊 ಈ ತಿಂಗಳು | This Month', value: 'month' },
  ];

  const getTotalCost = (): number => {
    return records.reduce((sum, record) => sum + parseFloat(record.cost || '0'), 0);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilters([value]);
  };

  const handleViewDetails = (record: SprayRecord) => {
    console.log('View details:', record);
  };

  const handleAddNew = () => {
    navigation.navigate('AddSprayRecord');
  };

  const renderRecord = ({ item }: { item: SprayRecord }) => (
    <Card style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <BilingualText
          kannada={item.date}
          english=""
          style={styles.recordDate}
          separator=""
        />
        <View style={styles.badges}>
          {item.hasImage && <Badge label="📷" variant="info" size="small" />}
          <Badge label={`₹${item.cost}`} variant="success" size="small" />
        </View>
      </View>

      <ListItem
        title={item.chemicalName}
        subtitle={`🦠 ${item.disease} • 📊 ${item.quantity} ${item.unit} • 🌾 ${item.acres} ಎಕರೆ`}
        rightIcon="→"
        onPress={() => handleViewDetails(item)}
      />

      {item.notes && (
        <InfoBox
          message={item.notes}
          variant="info"
          style={styles.notesBox}
        />
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="ಸ್ಪ್ರೇ ದಾಖಲೆಗಳು"
        subtitle="Spray Records"
        leftIcon="←"
        onLeftPress={() => navigation.goBack()}
        style={styles.header}
      />

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BilingualText
                kannada="ದಾಖಲೆಗಳು"
                english="Records"
                style={styles.statLabel}
              />
              <Badge label={`${records.length}`} variant="primary" />
            </View>
            <View style={styles.statItem}>
              <BilingualText
                kannada="ಒಟ್ಟು ವೆಚ್ಚ"
                english="Total Cost"
                style={styles.statLabel}
              />
              <Badge label={`₹${getTotalCost()}`} variant="success" />
            </View>
          </View>
        </Card>
      </View>

      <FilterBar
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        style={styles.filterBar}
      />

      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <InfoBox
            message="ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ | No records found"
            variant="info"
            style={styles.emptyMessage}
          />
        }
      />

      <Button
        title="+ ಹೊಸದನ್ನು ಸೇರಿಸಿ | Add New Record"
        onPress={handleAddNew}
        variant="primary"
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#16a34a',
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsCard: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  recordCard: {
    marginBottom: 12,
    padding: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  notesBox: {
    marginTop: 12,
  },
  emptyMessage: {
    marginTop: 40,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
});

export default SprayRecordsListScreen;
