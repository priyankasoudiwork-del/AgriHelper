import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text as RNText, Alert, ActivityIndicator, Platform, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import { useFormik } from 'formik';
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
import sprayRecordService, { SprayRecord } from '../../services/sprayRecordService';
import { useAuth } from '../../hooks/useAuth';

interface EditSprayRecordScreenProps {
  navigation: any;
  route: any;
}

const EditSprayRecordScreen: React.FC<EditSprayRecordScreenProps> = ({ navigation, route }) => {
  const { userId } = useAuth();
  const record: SprayRecord = route.params?.record;

  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(record?.imageUrl || null);

  const formik = useFormik({
    initialValues: {
      date: record?.date || new Date().toISOString().split('T')[0],
      chemicalName: record?.chemicalName || '',
      disease: record?.disease || '',
      quantity: record?.quantity || '',
      unit: record?.unit || 'ml',
      acres: record?.acres || '',
      cost: record?.cost || '',
      weather: record?.weather || '',
      sprayTime: record?.sprayTime || '',
      sprayMethod: record?.sprayMethod || '',
      notes: record?.notes || '',
    },
    onSubmit: async (values) => {
      if (!userId || !record?.id) {
        Alert.alert(
          'ದೋಷ | Error',
          'ದಾಖಲೆ ID ಕಂಡುಬಂದಿಲ್ಲ | Record ID not found',
          [{ text: 'ಸರಿ | OK' }]
        );
        return;
      }

      setSaving(true);
      const data = {
        ...values,
        imageUrl: selectedImage || null,
      };

      try {
        await sprayRecordService.updateSprayRecord(userId, record.id, data);
        console.log('Spray record updated:', record.id);

        Alert.alert(
          'ಯಶಸ್ವಿ | Success',
          'ಸ್ಪ್ರೇ ದಾಖಲೆ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!\nSpray record updated successfully!',
          [
            {
              text: 'ಸರಿ | OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } catch (error: any) {
        console.error('Error updating spray record:', error);
        Alert.alert(
          'ದೋಷ | Error',
          'ದಾಖಲೆ ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.\nFailed to update record. Please try again.',
          [{ text: 'ಸರಿ | OK' }]
        );
      } finally {
        setSaving(false);
      }
    },
  });

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
    { label: 'ಆಯ್ಕೆ ಮಾಡಿ | Select', value: '' },
    { label: '☀️ ಬಿಸಿಲು | Sunny', value: 'sunny' },
    { label: '☁️ ಮೋಡ | Cloudy', value: 'cloudy' },
    { label: '🌧️ ಮಳೆ | Rainy', value: 'rainy' },
  ];

  const timeOptions: SelectOption[] = [
    { label: 'ಆಯ್ಕೆ ಮಾಡಿ | Select', value: '' },
    { label: '🌅 ಬೆಳಿಗ್ಗೆ | Morning', value: 'morning' },
    { label: '☀️ ಮಧ್ಯಾಹ್ನ | Afternoon', value: 'afternoon' },
    { label: '🌆 ಸಂಜೆ | Evening', value: 'evening' },
  ];

  const sprayMethodOptions: SelectOption[] = [
    { label: 'ಆಯ್ಕೆ ಮಾಡಿ | Select', value: '' },
    { label: '💪 ಕೈ ಪಂಪ್ | Hand Pump', value: 'hand_pump' },
    { label: '⚙️ ಮೋಟಾರ್ | Motor Pump', value: 'motor_pump' },
    { label: '🚜 ಟ್ರಾಕ್ಟರ್ | Tractor', value: 'tractor' },
  ];

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      formik.setFieldValue('date', formattedDate);
    }
  };

  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleImageSelection = () => {
    Alert.alert(
      'ಫೋಟೋ ಆಯ್ಕೆ | Select Photo',
      'ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಗ್ಯಾಲರಿಯಿಂದ ಆಯ್ಕೆ ಮಾಡಿ\nTake photo or select from gallery',
      [
        {
          text: '📷 ಕ್ಯಾಮೆರಾ | Camera',
          onPress: () => launchCameraHandler(),
        },
        {
          text: '🖼️ ಗ್ಯಾಲರಿ | Gallery',
          onPress: () => launchGalleryHandler(),
        },
        {
          text: 'ರದ್ದು | Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const launchCameraHandler = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 800,
        height: 800,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageQuality: 0.8,
        mediaType: 'photo',
        includeBase64: false,
        cropperToolbarTitle: 'ಕ್ರಾಪ್ ಮಾಡಿ | Crop Image',
        cropperChooseText: 'ಆಯ್ಕೆ | Choose',
        cropperCancelText: 'ರದ್ದು | Cancel',
      });

      if (image && image.path) {
        setSelectedImage(image.path);
      }
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Camera error:', error);
        Alert.alert(
          'ದೋಷ | Error',
          'ಕ್ಯಾಮೆರಾ ತೆರೆಯಲು ವಿಫಲವಾಗಿದೆ | Failed to open camera'
        );
      }
    }
  };

  const launchGalleryHandler = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 800,
        height: 800,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageQuality: 0.8,
        mediaType: 'photo',
        includeBase64: false,
        cropperToolbarTitle: 'ಕ್ರಾಪ್ ಮಾಡಿ | Crop Image',
        cropperChooseText: 'ಆಯ್ಕೆ | Choose',
        cropperCancelText: 'ರದ್ದು | Cancel',
      });

      if (image && image.path) {
        setSelectedImage(image.path);
      }
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Gallery error:', error);
        Alert.alert(
          'ದೋಷ | Error',
          'ಗ್ಯಾಲರಿ ತೆರೆಯಲು ವಿಫಲವಾಗಿದೆ | Failed to open gallery'
        );
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title="ಸ್ಪ್ರೇ ದಾಖಲೆ ಸಂಪಾದಿಸಿ"
        subtitle="Edit Spray Record"
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
            <TouchableOpacity style={styles.imageUploadBox} onPress={handleImageSelection}>
              <RNText style={styles.imageUploadIcon}>📷</RNText>
              <BilingualText
                kannada="ಫೋಟೋ ಸೇರಿಸಿ"
                english="Add Photo"
                style={styles.imageUploadText}
              />
              <RNText style={styles.imageUploadSubtext}>
                ಕ್ಯಾಮೆರಾ ಅಥವಾ ಗ್ಯಾಲರಿ | Camera or Gallery
              </RNText>
            </TouchableOpacity>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
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
          {/* Date Picker Field */}
          <View style={styles.datePickerContainer}>
            <BilingualText
              kannada="📅 ದಿನಾಂಕ"
              english="Date"
              style={styles.dateLabel}
              separator=" | "
            />
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <RNText style={styles.datePickerText}>
                {formatDisplayDate(formik.values.date)}
              </RNText>
              <RNText style={styles.datePickerIcon}>📅</RNText>
            </TouchableOpacity>
          </View>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={new Date(formik.values.date)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* iOS Date Picker Done Button */}
          {showDatePicker && Platform.OS === 'ios' && (
            <View style={styles.datePickerActions}>
              <Button
                title="ಮುಗಿದಿದೆ | Done"
                onPress={() => setShowDatePicker(false)}
                variant="primary"
                size="small"
              />
            </View>
          )}

          <CustomInput
            label="💧 ರಾಸಾಯನಿಕ ಹೆಸರು | Chemical Name"
            placeholder="ಉದಾ: ರಿಡೋಮಿಲ್ ಗೋಲ್ಡ್ | Ex: Ridomil Gold"
            value={formik.values.chemicalName}
            onChangeText={formik.handleChange('chemicalName')}
          />

          <Select
            label="🦠 ರೋಗ / ಸಮಸ್ಯೆ | Disease / Problem"
            placeholder="ಆಯ್ಕೆ ಮಾಡಿ | Select"
            options={diseaseOptions}
            value={formik.values.disease}
            onChange={(value) => formik.setFieldValue('disease', value)}
          />

          <View style={styles.row}>
            <View style={styles.flexInput}>
              <CustomInput
                label="📊 ಪ್ರಮಾಣ | Quantity"
                placeholder="100"
                value={formik.values.quantity}
                onChangeText={formik.handleChange('quantity')}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.flexSelect}>
              <Select
                label="ಘಟಕ | Unit"
                options={unitOptions}
                value={formik.values.unit}
                onChange={(value) => formik.setFieldValue('unit', value)}
              />
            </View>
          </View>

          <CustomInput
            label="🌾 ಎಕರೆ | Acres"
            placeholder="5"
            value={formik.values.acres}
            onChangeText={formik.handleChange('acres')}
            keyboardType="numeric"
          />

          <CustomInput
            label="💰 ವೆಚ್ಚ | Cost"
            placeholder="₹ 500"
            value={formik.values.cost}
            onChangeText={formik.handleChange('cost')}
            keyboardType="numeric"
          />

          <Select
            label="🌤️ ಹವಾಮಾನ | Weather"
            placeholder="ಆಯ್ಕೆ ಮಾಡಿ | Select"
            options={weatherOptions}
            value={formik.values.weather}
            onChange={(value) => formik.setFieldValue('weather', value)}
          />

          <Select
            label="⏰ ಸಮಯ | Time"
            placeholder="ಆಯ್ಕೆ ಮಾಡಿ | Select"
            options={timeOptions}
            value={formik.values.sprayTime}
            onChange={(value) => formik.setFieldValue('sprayTime', value)}
          />

          <Select
            label="🚜 ಸಿಂಪಡಿಸುವ ವಿಧಾನ | Spray Method"
            placeholder="ಆಯ್ಕೆ ಮಾಡಿ | Select"
            options={sprayMethodOptions}
            value={formik.values.sprayMethod}
            onChange={(value) => formik.setFieldValue('sprayMethod', value)}
          />

          <CustomInput
            label="📝 ಟಿಪ್ಪಣಿಗಳು | Notes"
            placeholder="ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ | Additional information..."
            value={formik.values.notes}
            onChangeText={formik.handleChange('notes')}
            multiline
            numberOfLines={4}
            inputStyle={styles.notesInput}
          />
        </Card>

        {/* Submit Button */}
        <Button
          title={saving ? "ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ... | Updating..." : "✅ ನವೀಕರಿಸಿ | Update Record"}
          onPress={formik.handleSubmit}
          variant="primary"
          disabled={saving}
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
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  imageUploadSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    gap: 12,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  removeButton: {
    marginTop: 8,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  flexInput: {
    flex: 2,
  },
  flexSelect: {
    flex: 1,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  spacer: {
    height: 40,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    minHeight: 56,
  },
  datePickerText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  datePickerIcon: {
    fontSize: 20,
  },
  datePickerActions: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
});

export default EditSprayRecordScreen;
