import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import {
  Header,
  CustomInput,
  Select,
  SelectOption,
  Button,
  Card,
  BilingualText,
  InfoBox,
} from '../../components';

interface FormData {
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
}

interface AddSprayRecordScreenProps {
  navigation: any;
}

const AddSprayRecordScreen: React.FC<AddSprayRecordScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
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
    notes: '',
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const diseaseOptions: SelectOption[] = [
    { label: 'ಆಯ್ಕೆ ಮಾಡಿ | Select', value: '' },
    { label: 'ಪುಡಿ ಕಾಯಿಲೆ | Powdery Mildew', value: 'powdery_mildew' },
    { label: 'ಡೌನಿ ಮಿಲ್ಡ್ಯೂ | Downy Mildew', value: 'downy_mildew' },
    { label: 'ಆಂಥ್ರಾಕ್ನೋಸ್ | Anthracnose', value: 'anthracnose' },
    { label: 'ಕಪ್ಪು ಕೊಳೆತ | Black Rot', value: 'black_rot' },
    { label: 'ಎಲೆ ಮಚ್ಚೆ | Leaf Spot', value: 'leaf_spot' },
    { label: 'ಕೀಟ ನಿಯಂತ್ರಣ | Pest Control', value: 'pest_control' },
    { label: 'ಬೇರು ಕೊಳೆತ | Root Rot', value: 'root_rot' },
    { label: 'ಇತರೆ | Other', value: 'other' },
  ];

  const unitOptions: SelectOption[] = [
    { label: 'ml', value: 'ml' },
    { label: 'ಲೀಟರ್ | Liter', value: 'liter' },
    { label: 'ಗ್ರಾಂ | Gram', value: 'gram' },
    { label: 'kg', value: 'kg' },
  ];

  const weatherOptions: SelectOption[] = [
    { label: '☀️ ಬಿಸಿಲು | Sunny', value: 'sunny' },
    { label: '☁️ ಮೋಡ | Cloudy', value: 'cloudy' },
    { label: '🌧️ ಮಳೆ | Rainy', value: 'rainy' },
  ];

  const timeOptions: SelectOption[] = [
    { label: '🌅 ಬೆಳಿಗ್ಗೆ | Morning', value: 'morning' },
    { label: '☀️ ಮಧ್ಯಾಹ್ನ | Afternoon', value: 'afternoon' },
    { label: '🌆 ಸಂಜೆ | Evening', value: 'evening' },
  ];

  const sprayMethodOptions: SelectOption[] = [
    { label: '💪 ಕೈ ಪಂಪ್ | Hand Pump', value: 'hand_pump' },
    { label: '⚙️ ಮೋಟಾರ್ | Motor Pump', value: 'motor_pump' },
    { label: '🚜 ಟ್ರಾಕ್ಟರ್ | Tractor', value: 'tractor' },
  ];

  const handleImagePick = () => {
    setSelectedImage('captured');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      return;
    }
    console.log('Form submitted:', formData);
    navigation.goBack();
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.chemicalName &&
      formData.disease &&
      formData.quantity &&
      formData.acres &&
      formData.cost
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="ಸ್ಪ್ರೇ ದಾಖಲೆ ಸೇರಿಸಿ"
        subtitle="Add Spray Record"
        leftIcon="←"
        onLeftPress={() => navigation.goBack()}
        style={styles.header}
      />

      <ScrollView style={styles.content}>
        {/* Image Upload Section */}
        <Card style={styles.section}>
          <BilingualText
            kannada="ಫೋಟೋ"
            english="Photo (Optional)"
            style={styles.sectionTitle}
          />

          {!selectedImage ? (
            <TouchableOpacity style={styles.imageUploadBox} onPress={handleImagePick}>
              <RNText style={styles.imageUploadIcon}>📷</RNText>
              <BilingualText
                kannada="ಫೋಟೋ ತೆಗೆಯಿರಿ"
                english="Take Photo"
                style={styles.imageUploadText}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <InfoBox
                message="✅ ಫೋಟೋ ತೆಗೆದುಕೊಂಡಿದೆ | Photo Captured"
                variant="success"
              />
              <Button
                title="❌ ತೆಗೆದುಹಾಕಿ | Remove"
                onPress={handleRemoveImage}
                variant="danger"
                size="small"
                style={styles.removeButton}
              />
            </View>
          )}
        </Card>

        {/* Form Fields */}
        <Card style={styles.section}>
          <CustomInput
            label="📅 ದಿನಾಂಕ | Date *"
            value={formData.date}
            onChangeText={(value) => updateField('date', value)}
            editable={false}
          />

          <CustomInput
            label="💧 ರಾಸಾಯನಿಕ ಹೆಸರು | Chemical Name *"
            placeholder="ಉದಾ: ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ | Ex: Ridomil Gold"
            value={formData.chemicalName}
            onChangeText={(value) => updateField('chemicalName', value)}
          />

          <Select
            label="🦠 ರೋಗ / ಸಮಸ್ಯೆ | Disease / Problem *"
            placeholder="ಆಯ್ಕೆ ಮಾಡಿ | Select"
            options={diseaseOptions}
            value={formData.disease}
            onChange={(value) => updateField('disease', value as string)}
          />

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <CustomInput
                label="📊 ಪ್ರಮಾಣ | Quantity *"
                placeholder="100"
                value={formData.quantity}
                onChangeText={(value) => updateField('quantity', value)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidth}>
              <Select
                label="ಘಟಕ | Unit"
                options={unitOptions}
                value={formData.unit}
                onChange={(value) => updateField('unit', value as string)}
              />
            </View>
          </View>

          <CustomInput
            label="🌾 ಎಕರೆ | Acres *"
            placeholder="5"
            value={formData.acres}
            onChangeText={(value) => updateField('acres', value)}
            keyboardType="numeric"
          />

          <CustomInput
            label="💰 ವೆಚ್ಚ | Cost *"
            placeholder="₹ 500"
            value={formData.cost}
            onChangeText={(value) => updateField('cost', value)}
            keyboardType="numeric"
          />

          <Select
            label="🌤️ ಹವಾಮಾನ | Weather"
            placeholder="ಆಯ್ಕೆ ಮಾಡಿ | Select"
            options={weatherOptions}
            value={formData.weather}
            onChange={(value) => updateField('weather', value as string)}
          />

          <Select
            label="⏰ ಸಮಯ | Time"
            placeholder="ಆಯ್ಕೆ ಮಾಡಿ | Select"
            options={timeOptions}
            value={formData.sprayTime}
            onChange={(value) => updateField('sprayTime', value as string)}
          />

          <Select
            label="🚜 ಸಿಂಪಡಿಸುವ ವಿಧಾನ | Spray Method"
            placeholder="ಆಯ್ಕೆ ಮಾಡಿ | Select"
            options={sprayMethodOptions}
            value={formData.sprayMethod}
            onChange={(value) => updateField('sprayMethod', value as string)}
          />

          <CustomInput
            label="📝 ಟಿಪ್ಪಣಿಗಳು | Notes"
            placeholder="ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ | Additional information..."
            value={formData.notes}
            onChangeText={(value) => updateField('notes', value)}
            multiline
            numberOfLines={4}
            inputStyle={styles.notesInput}
          />
        </Card>

        {/* Info Box */}
        <InfoBox
          message="* ಗುರುತಿಸಿದ ಕ್ಷೇತ್ರಗಳು ಕಡ್ಡಾಯ | * Marked fields are mandatory"
          variant="info"
          style={styles.infoBox}
        />

        {/* Submit Button */}
        <Button
          title={isFormValid() ? "✅ ಉಳಿಸಿ | Save Record" : "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ"}
          onPress={handleSubmit}
          variant={isFormValid() ? "primary" : "secondary"}
          disabled={!isFormValid()}
          style={styles.submitButton}
        />

        <View style={styles.spacer} />
      </ScrollView>
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
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  imageUploadBox: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  imageUploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    gap: 12,
  },
  removeButton: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  infoBox: {
    marginHorizontal: 16,
  },
  submitButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  spacer: {
    height: 40,
  },
});

export default AddSprayRecordScreen;
