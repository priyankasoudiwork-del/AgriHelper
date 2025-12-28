import React, { useState } from 'react';

export default function AddSprayRecordScreen({navigation}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    chemicalName: '',
    disease: '',
    quantity: '',
    unit: 'ml',
    acres: '',
    cost: '',
    weather: '',
    sprayTime: '',
    sprayMethod: '',
    tankMixing: '',
    notes: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingField, setRecordingField] = useState(null);

  const diseaseOptions = [
    { label: 'ಆಯ್ಕೆ ಮಾಡಿ | Select', value: '' },
    { label: 'ಪುಡಿ ಕಾಯಿಲೆ | Powdery Mildew', value: 'powdery_mildew' },
    { label: 'ಡೌನಿ ಮಿಲ್ಡ್ಯೂ | Downy Mildew', value: 'downy_mildew' },
    { label: 'ಆಂಥ್ರಾಕ್ನೋಸ್ | Anthracnose', value: 'anthracnose' },
    { label: 'ಕಪ್ಪು ಕೊಳೆತ | Black Rot', value: 'black_rot' },
    { label: 'ಎಲೆ ಮಚ್ಚೆ | Leaf Spot', value: 'leaf_spot' },
    { label: 'ಕೀಟ ನಿಯಂತ್ರಣ | Pest Control', value: 'pest_control' },
    { label: 'ಬೇರು ಕೊಳೆತ | Root Rot', value: 'root_rot' },
    { label: 'ತ್ರಿಪ್ಸ್ | Thrips', value: 'thrips' },
    { label: 'ಮೀಲಿ ಬಗ್ | Mealy Bug', value: 'mealy_bug' },
    { label: 'ಇತರೆ | Other', value: 'other' },
  ];

  const unitOptions = [
    { label: 'ml', value: 'ml' },
    { label: 'ಲೀಟರ್ | Liter', value: 'liter' },
    { label: 'ಗ್ರಾಂ | Gram', value: 'gram' },
    { label: 'kg', value: 'kg' },
  ];

  const weatherOptions = [
    { label: '☀️ ಬಿಸಿಲು | Sunny', value: 'sunny' },
    { label: '☁️ ಮೋಡ | Cloudy', value: 'cloudy' },
    { label: '🌧️ ಮಳೆ | Rainy', value: 'rainy' },
  ];

  const timeOptions = [
    { label: '🌅 ಬೆಳಿಗ್ಗೆ | Morning', value: 'morning' },
    { label: '☀️ ಮಧ್ಯಾಹ್ನ | Afternoon', value: 'afternoon' },
    { label: '🌆 ಸಂಜೆ | Evening', value: 'evening' },
  ];

  const sprayMethodOptions = [
    { label: '💪 ಕೈ ಪಂಪ್ | Hand Pump', value: 'hand_pump' },
    { label: '⚙️ ಮೋಟಾರ್ | Motor Pump', value: 'motor_pump' },
    { label: '🚜 ಟ್ರಾಕ್ಟರ್ | Tractor', value: 'tractor' },
  ];

  const handleVoiceInput = (field) => {
    setIsRecording(true);
    setRecordingField(field);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsRecording(false);
      setRecordingField(null);
      
      // Simulate voice input result
      const sampleVoiceInput = {
        chemicalName: 'ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್',
        notes: 'ಮಳೆಯ ನಂತರ ಸಿಂಪಡಿಸಲಾಗಿದೆ',
      };
      
      if (sampleVoiceInput[field]) {
        updateField(field, sampleVoiceInput[field]);
      }
    }, 2000);
  };

  const handleImagePick = () => {
    console.log('Open image picker');
    setSelectedImage('captured');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    console.log('Image:', selectedImage);
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isFormValid = () => {
    return formData.chemicalName && formData.disease && formData.quantity && formData.acres && formData.cost;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity style={{alignSelf:"flex-start"}} onPress={() => navigation.goBack()}>
    <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold',alignSelf:"flex-start" }}>
      ← ಹಿಂದುಕ್ಕೆ
    </Text>
  </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>ಸ್ಪ್ರೇ ದಾಖಲೆ ಸೇರಿಸಿ</Text>
          <Text style={styles.headerSubtitle}>Add Spray Record</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 ಫೋಟೋ | Photo (ಐಚ್ಛಿಕ)</Text>
          
          {!selectedImage ? (
            <TouchableOpacity style={styles.imageUploadBox} onPress={handleImagePick}>
              <Text style={styles.imageUploadIcon}>📷</Text>
              <Text style={styles.imageUploadText}>ಫೋಟೋ ತೆಗೆಯಿರಿ | Take Photo</Text>
              <Text style={styles.imageUploadHint}>ಬಾಟಲಿ / ಫಾರ್ಮ್ ಫೋಟೋ | Bottle / Farm Photo</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <View style={styles.imagePreview}>
                <Text style={styles.imageIcon}>✅ ಫೋಟೋ ತೆಗೆದುಕೊಂಡಿದೆ</Text>
              </View>
              <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                <Text style={styles.removeImageText}>❌ ತೆಗೆದುಹಾಕಿ</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Date */}
        <View style={styles.section}>
          <Text style={styles.label}>📅 ದಿನಾಂಕ | Date *</Text>
          <TouchableOpacity style={styles.input}>
            <Text style={styles.inputText}>{formData.date}</Text>
          </TouchableOpacity>
        </View>

        {/* Chemical Name with Voice Input */}
        <View style={styles.section}>
          <Text style={styles.label}>💧 ರಾಸಾಯನಿಕ ಹೆಸರು | Chemical Name *</Text>
          <View style={styles.voiceInputContainer}>
            <TextInput
              style={styles.voiceInput}
              placeholder="ಉದಾ: ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ | Ex: Ridomil Gold"
              placeholderTextColor="#9ca3af"
              value={formData.chemicalName}
              onChangeText={(value) => updateField('chemicalName', value)}
            />
            <TouchableOpacity 
              style={[styles.voiceButton, isRecording && recordingField === 'chemicalName' && styles.voiceButtonActive]}
              onPress={() => handleVoiceInput('chemicalName')}
            >
              <Text style={styles.voiceButtonIcon}>
                {isRecording && recordingField === 'chemicalName' ? '🎙️' : '🎤'}
              </Text>
            </TouchableOpacity>
          </View>
          {isRecording && recordingField === 'chemicalName' && (
            <Text style={styles.recordingText}>🔴 ಆಲಿಸುತ್ತಿದೆ... | Listening...</Text>
          )}
        </View>

        {/* Disease Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>🦠 ರೋಗ / ಸಮಸ್ಯೆ | Disease / Problem *</Text>
          <View style={styles.pickerContainer}>
            {diseaseOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.pickerOption,
                  formData.disease === option.value && styles.pickerOptionSelected
                ]}
                onPress={() => updateField('disease', option.value)}
              >
                <Text style={[
                  styles.pickerOptionText,
                  formData.disease === option.value && styles.pickerOptionTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Acres */}
        <View style={styles.section}>
          <Text style={styles.label}>🌾 ಎಕರೆ ಪ್ರಮಾಣ | Acres Sprayed *</Text>
          <TextInput
            style={styles.input}
            placeholder="ಉದಾ: 2.5 ಎಕರೆ | Ex: 2.5 acres"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
            value={formData.acres}
            onChangeText={(value) => updateField('acres', value)}
          />
          <Text style={styles.helpText}>
            💡 ಒಂದು ಬಾಟಲಿಯನ್ನು ಎಷ್ಟು ಎಕರೆಗೆ ಬಳಸಿದ್ದೀರಿ{'\n'}
            How many acres did you spray with this quantity
          </Text>
        </View>

        {/* Quantity with Horizontal Scroll Units */}
        <View style={styles.section}>
          <Text style={styles.label}>📊 ಪ್ರಮಾಣ ಮತ್ತು ಘಟಕ | Quantity & Unit *</Text>
          <TextInput
            style={styles.input}
            placeholder="ಉದಾ: 200, 500, 1 | Ex: 200, 500, 1"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            value={formData.quantity}
            onChangeText={(value) => updateField('quantity', value)}
          />
          
          <Text style={styles.unitLabel}>ಘಟಕ ಆಯ್ಕೆಮಾಡಿ | Select Unit:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.unitScrollView}
            contentContainerStyle={styles.unitScrollContent}
          >
            {unitOptions.map((unit) => (
              <TouchableOpacity
                key={unit.value}
                style={[
                  styles.unitOptionScroll,
                  formData.unit === unit.value && styles.unitOptionScrollSelected
                ]}
                onPress={() => updateField('unit', unit.value)}
              >
                <Text style={[
                  styles.unitOptionTextScroll,
                  formData.unit === unit.value && styles.unitOptionTextScrollSelected
                ]}>
                  {unit.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityDisplayText}>
              ✓ {formData.quantity || '0'} {formData.unit}
              {formData.acres && ` → ${formData.acres} ಎಕರೆ | acres`}
            </Text>
          </View>
        </View>

        {/* Cost */}
        <View style={styles.section}>
          <Text style={styles.label}>💰 ಬೆಲೆ | Cost *</Text>
          <View style={styles.costInputWrapper}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.costInput}
              placeholder="ಉದಾ: 300"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={formData.cost}
              onChangeText={(value) => updateField('cost', value)}
            />
          </View>
          <Text style={styles.helpText}>
            💡 ಈ ಬಾರಿ ಬಳಸಿದ ಪ್ರಮಾಣದ ಬೆಲೆ{'\n'}
            Cost for the quantity used this time
          </Text>
        </View>

        {/* Weather Conditions */}
        <View style={styles.section}>
          <Text style={styles.label}>🌤️ ಹವಾಮಾನ | Weather (ಐಚ್ಛಿಕ)</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalOptions}
          >
            {weatherOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.weather === option.value && styles.optionButtonSelected
                ]}
                onPress={() => updateField('weather', option.value)}
              >
                <Text style={[
                  styles.optionButtonText,
                  formData.weather === option.value && styles.optionButtonTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Spray Time */}
        <View style={styles.section}>
          <Text style={styles.label}>⏰ ಸಮಯ | Spray Time (ಐಚ್ಛಿಕ)</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalOptions}
          >
            {timeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.sprayTime === option.value && styles.optionButtonSelected
                ]}
                onPress={() => updateField('sprayTime', option.value)}
              >
                <Text style={[
                  styles.optionButtonText,
                  formData.sprayTime === option.value && styles.optionButtonTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Spray Method */}
        <View style={styles.section}>
          <Text style={styles.label}>🔧 ಸ್ಪ್ರೇ ವಿಧಾನ | Spray Method (ಐಚ್ಛಿಕ)</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalOptions}
          >
            {sprayMethodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.sprayMethod === option.value && styles.optionButtonSelected
                ]}
                onPress={() => updateField('sprayMethod', option.value)}
              >
                <Text style={[
                  styles.optionButtonText,
                  formData.sprayMethod === option.value && styles.optionButtonTextSelected
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tank Mixing */}
        <View style={styles.section}>
          <Text style={styles.label}>🧪 ಟ್ಯಾಂಕ್ ಮಿಕ್ಸಿಂಗ್ | Tank Mixing (ಐಚ್ಛಿಕ)</Text>
          <View style={styles.voiceInputContainer}>
            <TextInput
              style={styles.voiceInput}
              placeholder="ಉದಾ: ರಿಡೋಮಿಲ್ + ಬವಿಸ್ಟಿನ್ | Ex: Ridomil + Bavistin"
              placeholderTextColor="#9ca3af"
              value={formData.tankMixing}
              onChangeText={(value) => updateField('tankMixing', value)}
            />
            <TouchableOpacity 
              style={[styles.voiceButton, isRecording && recordingField === 'tankMixing' && styles.voiceButtonActive]}
              onPress={() => handleVoiceInput('tankMixing')}
            >
              <Text style={styles.voiceButtonIcon}>
                {isRecording && recordingField === 'tankMixing' ? '🎙️' : '🎤'}
              </Text>
            </TouchableOpacity>
          </View>
          {isRecording && recordingField === 'tankMixing' && (
            <Text style={styles.recordingText}>🔴 ಆಲಿಸುತ್ತಿದೆ... | Listening...</Text>
          )}
          <Text style={styles.helpText}>
            💡 ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ರಾಸಾಯನಿಕಗಳನ್ನು ಬೆರೆಸಿದರೆ{'\n'}
            If you mixed multiple chemicals together
          </Text>
        </View>

        {/* Notes with Voice */}
        <View style={styles.section}>
          <Text style={styles.label}>📝 ಟಿಪ್ಪಣಿಗಳು | Notes (ಐಚ್ಛಿಕ)</Text>
          <View style={styles.voiceInputContainer}>
            <TextInput
              style={[styles.voiceInput, styles.textArea]}
              placeholder="ಉದಾ: ಮಳೆಯ ನಂತರ, ಬೆಳಿಗ್ಗೆ | Ex: After rain, morning"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              value={formData.notes}
              onChangeText={(value) => updateField('notes', value)}
            />
            <TouchableOpacity 
              style={[styles.voiceButton, styles.voiceButtonNotes, isRecording && recordingField === 'notes' && styles.voiceButtonActive]}
              onPress={() => handleVoiceInput('notes')}
            >
              <Text style={styles.voiceButtonIcon}>
                {isRecording && recordingField === 'notes' ? '🎙️' : '🎤'}
              </Text>
            </TouchableOpacity>
          </View>
          {isRecording && recordingField === 'notes' && (
            <Text style={styles.recordingText}>🔴 ಆಲಿಸುತ್ತಿದೆ... | Listening...</Text>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              * ಗುರುತಿಸಿದ ಕ್ಷೇತ್ರಗಳು ಅಗತ್ಯವಿದೆ{'\n'}
              * Marked fields are required
            </Text>
            <Text style={styles.infoTextSecondary}>
              🎤 ಧ್ವನಿ ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ{'\n'}
              Press voice button and speak
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid() && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid()}
        >
          <Text style={styles.submitButtonText}>
            ✓ ಉಳಿಸಿ | Save Record
          </Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </View>
    </ScrollView>
  );
}

const { 
  View, 
  Text, 
  TextInput, 
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
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1fae5',
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  inputText: {
    fontSize: 16,
    color: '#1f2937',
  },
  voiceInputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  voiceInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1fae5',
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  voiceButton: {
    backgroundColor: '#3b82f6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  voiceButtonNotes: {
    height: 56,
  },
  voiceButtonActive: {
    backgroundColor: '#ef4444',
  },
  voiceButtonIcon: {
    fontSize: 24,
  },
  recordingText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
    marginTop: 8,
  },
  imageUploadBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#86efac',
    padding: 40,
    alignItems: 'center',
  },
  imageUploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  imageUploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 4,
  },
  imageUploadHint: {
    fontSize: 14,
    color: '#6b7280',
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 30,
    marginBottom: 12,
  },
  imageIcon: {
    fontSize: 16,
    color: '#166534',
    fontWeight: '600',
  },
  removeImageButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  removeImageText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pickerOption: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pickerOptionSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  pickerOptionTextSelected: {
    color: '#166534',
  },
  unitLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 8,
  },
  unitScrollView: {
    marginBottom: 12,
  },
  unitScrollContent: {
    paddingRight: 20,
    gap: 10,
  },
  unitOptionScroll: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginRight: 10,
  },
  unitOptionScrollSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  unitOptionTextScroll: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  unitOptionTextScrollSelected: {
    color: '#166534',
    fontWeight: 'bold',
  },
  quantityDisplay: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  quantityDisplayText: {
    fontSize: 15,
    color: '#166534',
    fontWeight: '600',
  },
  costInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1fae5',
    alignItems: 'center',
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
    marginRight: 8,
  },
  costInput: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  helpText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 20,
    marginBottom: 6,
  },
  infoTextSecondary: {
    fontSize: 12,
    color: '#3b82f6',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spacer: {
    height: 40,
  },
  horizontalOptions: {
    paddingRight: 20,
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  optionButtonSelected: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  optionButtonText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '600',
  },
  optionButtonTextSelected: {
    color: '#166534',
    fontWeight: 'bold',
  },
});