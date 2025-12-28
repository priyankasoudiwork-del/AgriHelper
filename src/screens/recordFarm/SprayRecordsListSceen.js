import React, { useState } from 'react';

export default function SprayRecordsListSceen({navigation}) {
  const [currentScreen, setCurrentScreen] = useState('list'); // 'list', 'details', 'form'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sample data
  const [records, setRecords] = useState([
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
      tankMixing: '',
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
      tankMixing: '',
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
      tankMixing: '',
      notes: 'ಸಾವಯವ ಚಿಕಿತ್ಸೆ',
      hasImage: true,
    },
  ]);

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setCurrentScreen('details');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setCurrentScreen('form');
  };

  const handleDelete = (id) => {
    setRecords(records.filter(r => r.id !== id));
    setCurrentScreen('list');
  };

  const handleAddNew = () => {
    setSelectedRecord(null);
    setIsEditing(false);
    navigation.navigate("AddSprayRecord")
    // setCurrentScreen('form');
  };

  const handleSave = () => {
    // Save logic here
    setCurrentScreen('list');
  };

  const handleBack = () => {
    if (currentScreen === 'details') {
      setCurrentScreen('list');
    } else if (currentScreen === 'form') {
      setCurrentScreen(selectedRecord ? 'details' : 'list');
    }
  };

  const getTotalCost = () => {
    return records.reduce((sum, record) => sum + parseFloat(record.cost || 0), 0);
  };

  // List Screen
  if (currentScreen === 'list') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <TouchableOpacity style={{alignSelf:"flex-start"}} onPress={() => navigation.goBack()}>
    <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold',alignSelf:"flex-start" }}>
      ← ಹಿಂದುಕ್ಕೆ
    </Text>
  </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>ಸ್ಪ್ರೇ ದಾಖಲೆಗಳು</Text>
            <Text style={styles.headerSubtitle}>Spray Records</Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.statsText}>📋 {records.length} ದಾಖಲೆಗಳು</Text>
            <Text style={styles.statsText}>💰 ₹{getTotalCost()}</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Filter/Sort Options */}
          <View style={styles.filterSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>📅 ಎಲ್ಲಾ | All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>📆 ಈ ವಾರ | This Week</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>📊 ಈ ತಿಂಗಳು | This Month</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Records List */}
          {records.map((record) => (
            <TouchableOpacity 
              key={record.id} 
              style={styles.recordCard}
              onPress={() => handleViewDetails(record)}
            >
              <View style={styles.recordHeader}>
                <View style={styles.recordDateBadge}>
                  <Text style={styles.recordDate}>📅 {record.date}</Text>
                </View>
                {record.hasImage && (
                  <View style={styles.imageBadge}>
                    <Text style={styles.imageBadgeText}>📷</Text>
                  </View>
                )}
              </View>

              <View style={styles.recordBody}>
                <Text style={styles.recordChemical}>{record.chemicalName}</Text>
                <View style={styles.recordDetails}>
                  <Text style={styles.recordDetailItem}>🦠 {record.disease}</Text>
                  <Text style={styles.recordDetailItem}>📊 {record.quantity} {record.unit}</Text>
                  <Text style={styles.recordDetailItem}>🌾 {record.acres} ಎಕರೆ</Text>
                </View>
              </View>

              <View style={styles.recordFooter}>
                <Text style={styles.recordCost}>₹ {record.cost}</Text>
                <Text style={styles.viewDetailsText}>ವಿವರಗಳು ನೋಡಿ →</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.spacer} />
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity style={styles.fab} onPress={handleAddNew}>
          <Text style={styles.fabText}>+ ಹೊಸದನ್ನು ಸೇರಿಸಿ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Details Screen
  if (currentScreen === 'details' && selectedRecord) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← ಹಿಂದೆ</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>ದಾಖಲೆ ವಿವರಗಳು</Text>
            <Text style={styles.headerSubtitle}>Record Details</Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          {/* Image Section */}
          {selectedRecord.hasImage && (
            <View style={styles.detailImageSection}>
              <View style={styles.detailImageBox}>
                <Text style={styles.detailImageIcon}>🖼️</Text>
                <Text style={styles.detailImageText}>ಫೋಟೋ ಲಭ್ಯವಿದೆ | Photo Available</Text>
              </View>
            </View>
          )}

          {/* Details Card */}
          <View style={styles.detailsCard}>
            {/* Date */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 ದಿನಾಂಕ | Date</Text>
              <Text style={styles.detailValue}>{selectedRecord.date}</Text>
            </View>

            <View style={styles.divider} />

            {/* Chemical Name */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💧 ರಾಸಾಯನಿಕ | Chemical</Text>
              <Text style={styles.detailValue}>{selectedRecord.chemicalName}</Text>
            </View>

            <View style={styles.divider} />

            {/* Disease */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🦠 ರೋಗ | Disease</Text>
              <Text style={styles.detailValue}>{selectedRecord.disease}</Text>
            </View>

            <View style={styles.divider} />

            {/* Quantity */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📊 ಪ್ರಮಾಣ | Quantity</Text>
              <Text style={styles.detailValue}>{selectedRecord.quantity} {selectedRecord.unit}</Text>
            </View>

            <View style={styles.divider} />

            {/* Acres */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🌾 ಎಕರೆ | Acres</Text>
              <Text style={styles.detailValue}>{selectedRecord.acres} ಎಕರೆ</Text>
            </View>

            <View style={styles.divider} />

            {/* Cost */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💰 ಬೆಲೆ | Cost</Text>
              <Text style={styles.detailValueHighlight}>₹ {selectedRecord.cost}</Text>
            </View>

            {selectedRecord.weather && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🌤️ ಹವಾಮಾನ | Weather</Text>
                  <Text style={styles.detailValue}>{selectedRecord.weather}</Text>
                </View>
              </>
            )}

            {selectedRecord.sprayTime && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>⏰ ಸಮಯ | Time</Text>
                  <Text style={styles.detailValue}>{selectedRecord.sprayTime}</Text>
                </View>
              </>
            )}

            {selectedRecord.sprayMethod && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🔧 ವಿಧಾನ | Method</Text>
                  <Text style={styles.detailValue}>{selectedRecord.sprayMethod}</Text>
                </View>
              </>
            )}

            {selectedRecord.tankMixing && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🧪 ಟ್ಯಾಂಕ್ ಮಿಕ್ಸಿಂಗ್</Text>
                  <Text style={styles.detailValue}>{selectedRecord.tankMixing}</Text>
                </View>
              </>
            )}

            {selectedRecord.notes && (
              <>
                <View style={styles.divider} />
                <View style={styles.detailRowColumn}>
                  <Text style={styles.detailLabel}>📝 ಟಿಪ್ಪಣಿಗಳು | Notes</Text>
                  <Text style={styles.detailValueNotes}>{selectedRecord.notes}</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Text style={styles.actionButtonText}>✏️ ಸಂಪಾದಿಸಿ | Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => {
              if (confirm('ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಬೇಕೇ? | Delete this record?')) {
                handleDelete(selectedRecord.id);
              }
            }}
          >
            <Text style={styles.actionButtonTextDelete}>🗑️ ಅಳಿಸಿ | Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Form Screen (simplified for demo)
  if (currentScreen === 'form') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← ಹಿಂದೆ</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'ಸಂಪಾದಿಸಿ | Edit' : 'ಹೊಸದನ್ನು ಸೇರಿಸಿ | Add New'}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.formPlaceholder}>
            <Text style={styles.formPlaceholderText}>📝</Text>
            <Text style={styles.formPlaceholderTitle}>
              {isEditing ? 'ಸಂಪಾದನೆ ಫಾರ್ಮ್' : 'ಹೊಸ ದಾಖಲೆ ಫಾರ್ಮ್'}
            </Text>
            <Text style={styles.formPlaceholderSubtitle}>
              {isEditing ? 'Edit Form' : 'New Record Form'}
            </Text>
            <Text style={styles.formPlaceholderHint}>
              (Previous form will be shown here)
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitButtonText}>✓ ಉಳಿಸಿ | Save</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet 
} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#0284c7',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#dcfce7',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statsText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  filterSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  recordCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordDateBadge: {
    backgroundColor: '#dbeafe',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  recordDate: {
    fontSize: 13,
    color: '#1e40af',
    fontWeight: '600',
  },
  imageBadge: {
    backgroundColor: '#dcfce7',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBadgeText: {
    fontSize: 16,
  },
  recordBody: {
    marginBottom: 12,
  },
  recordChemical: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  recordDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recordDetailItem: {
    fontSize: 13,
    color: '#6b7280',
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  recordCost: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailImageSection: {
    padding: 16,
  },
  detailImageBox: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#86efac',
  },
  detailImageIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  detailImageText: {
    fontSize: 16,
    color: '#166534',
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailRowColumn: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  detailValueHighlight: {
    fontSize: 20,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  detailValueNotes: {
    fontSize: 15,
    color: '#374151',
    marginTop: 8,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonTextDelete: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  formPlaceholderText: {
    fontSize: 80,
    marginBottom: 20,
  },
  formPlaceholderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  formPlaceholderSubtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 20,
  },
  formPlaceholderHint: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 100,
  },
});