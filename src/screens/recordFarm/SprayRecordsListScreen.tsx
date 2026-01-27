import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Text as RNText, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Header,
  Card,
  ListItem,
  Button,
  Badge,
  BilingualText,
  FilterBar,
  InfoBox,
} from '../../components';
import sprayRecordService, { SprayRecord } from '../../services/sprayRecordService';
import { useAuth } from '../../hooks/useAuth';

interface SprayRecordsListScreenProps {
  navigation: any;
}

const SprayRecordsListScreen: React.FC<SprayRecordsListScreenProps> = ({ navigation }) => {
  const { userId } = useAuth();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
  const [records, setRecords] = useState<SprayRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<SprayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch spray records from Firestore
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('ದಯವಿಟ್ಟು ಮೊದಲು ಲಾಗಿನ್ ಮಾಡಿ | Please login first');
      return;
    }

    // Set a timeout to stop loading if Firestore takes too long
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // Stop loading after 3 seconds

    // Subscribe to real-time updates
    const unsubscribe = sprayRecordService.subscribeToUserRecords(
      userId,
      (fetchedRecords) => {
        clearTimeout(loadingTimeout);
        setRecords(fetchedRecords);
        setLoading(false);
        setRefreshing(false);
        setError(null);
      }
    );

    // Cleanup subscription and timeout on unmount
    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, [userId]);

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    if (!userId) return;

    setRefreshing(true);
    try {
      const fetchedRecords = await sprayRecordService.getUserSprayRecords(userId);
      setRecords(fetchedRecords);
      setError(null);
    } catch (err) {
      console.error('Error refreshing records:', err);
      setError('ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ | Failed to load records');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter records based on selected filter
  useEffect(() => {
    if (!records.length) {
      setFilteredRecords([]);
      setFilterLoading(false);
      return;
    }

    // Show loading when filter changes
    setFilterLoading(true);

    const filterType = selectedFilters[0] || 'all';
    const now = new Date();
    const filtered = records.filter(record => {
      if (filterType === 'all') {
        return true;
      }

      const recordDate = new Date(record.date);

      if (filterType === 'week') {
        // Last 7 days
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return recordDate >= weekAgo && recordDate <= now;
      }

      if (filterType === 'month') {
        // Current month
        return (
          recordDate.getMonth() === now.getMonth() &&
          recordDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });

    // Small delay to show loading effect
    setTimeout(() => {
      setFilteredRecords(filtered);
      setFilterLoading(false);
    }, 200);
  }, [records, selectedFilters]);

  const filterOptions = [
    { label: '📅 ಎಲ್ಲಾ | All', value: 'all' },
    { label: '📆 ಈ ವಾರ | This Week', value: 'week' },
    { label: '📊 ಈ ತಿಂಗಳು | This Month', value: 'month' },
  ];

  const getTotalCost = (): number => {
    return filteredRecords.reduce((sum, record) => sum + parseFloat(record.cost || '0'), 0);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilters([value]);
  };

  const handleViewDetails = (record: SprayRecord) => {
    navigation.navigate('SprayRecordDetail', { record });
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
          <Badge label={`₹${item.cost}`} variant="success" size="small" />
        </View>
      </View>

      <TouchableOpacity
        style={styles.recordContent}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.recordInfo}>
          <RNText style={styles.chemicalName}>{item.chemicalName}</RNText>
          <RNText style={styles.recordDetails}>
            🦠 {item.disease} • 📊 {item.quantity} {item.unit} • 🌾 {item.acres} ಎಕರೆ
          </RNText>
        </View>

        {item.imageUrl && (
          <FastImage source={{ uri: item.imageUrl }} style={styles.circularImage} resizeMode={FastImage.resizeMode.cover} />
        )}
      </TouchableOpacity>

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

      {error && (
        <InfoBox
          message={error}
          variant="error"
          style={styles.errorBox}
        />
      )}

      {loading && (
        <View style={styles.loadingBanner}>
          <ActivityIndicator size="small" color="#16a34a" />
          <BilingualText
            kannada="ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
            english="Loading..."
            style={styles.loadingBannerText}
          />
        </View>
      )}

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BilingualText
                kannada="ದಾಖಲೆಗಳು"
                english="Records"
                style={styles.statLabel}
              />
              <Badge label={`${filteredRecords.length}`} variant="primary" />
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

      {filterLoading && (
        <View style={styles.filterLoadingContainer}>
          <ActivityIndicator size="small" color="#16a34a" />
          <RNText style={styles.filterLoadingText}>
            ಫಿಲ್ಟರ್ ಮಾಡಲಾಗುತ್ತಿದೆ... | Filtering...
          </RNText>
        </View>
      )}

      <FlatList
        data={filteredRecords}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id || ''}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#16a34a']}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <BilingualText
                kannada={selectedFilters[0] === 'all' ? 'ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ' : 'ಈ ಅವಧಿಯಲ್ಲಿ ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ'}
                english={selectedFilters[0] === 'all' ? 'No Records Yet' : 'No Records in This Period'}
                style={styles.emptyTitle}
              />
              <BilingualText
                kannada="ಹೊಸ ಸ್ಪ್ರೇ ದಾಖಲೆ ಸೇರಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ"
                english="Press the button below to add a spray record"
                style={styles.emptySubtitle}
              />
            </View>
          )
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
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: '#bbf7d0',
    gap: 8,
  },
  loadingBannerText: {
    fontSize: 14,
    color: '#16a34a',
  },
  errorBox: {
    marginHorizontal: 16,
    marginTop: 16,
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
  recordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  recordInfo: {
    flex: 1,
    gap: 6,
  },
  chemicalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  recordDetails: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  circularImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
    borderWidth: 3,
    borderColor: '#16a34a',
  },
  notesBox: {
    marginTop: 12,
  },
  emptyContainer: {
    marginTop: 60,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  filterLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: '#bbf7d0',
    gap: 8,
  },
  filterLoadingText: {
    fontSize: 14,
    color: '#16a34a',
    fontWeight: '500',
  },
});

export default SprayRecordsListScreen;
