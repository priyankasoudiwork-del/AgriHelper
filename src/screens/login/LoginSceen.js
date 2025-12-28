import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Dimensions,ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function PhoneAuthScreen({ navigation }) {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [timer, setTimer] = useState(0);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Generate a random 6-digit OTP
  const generateOTP = () => {
    const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(randomOTP);
    return randomOTP;
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        const newOTP = generateOTP();
        console.log('🔐 Generated OTP:', newOTP); // For testing
        
        setStep('otp');
        setTimer(60); // 60 seconds countdown
        setLoading(false);
        
        Alert.alert(
          'ಯಶಸ್ವಿ | Success',
          `OTP ಕಳುಹಿಸಲಾಗಿದೆ +91${phoneNumber} ಗೆ\nOTP sent to +91${phoneNumber}\n\n🔐 Test OTP: ${newOTP}`,
          [{ text: 'ಸರಿ | OK' }]
        );
      }, 1000);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      setLoading(true);
      
      // Simulate verification delay
      setTimeout(() => {
        // Check if OTP matches
        if (otp === generatedOTP) {
          Alert.alert(
            'ಯಶಸ್ವಿ | Success',
            'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!\nLogin successful!',
            [
              {
                text: 'ಸರಿ | OK',
                onPress: () => navigation.replace('Home')
              }
            ]
          );
        } else {
          navigation.replace('Home')
        }
        setLoading(false);
      }, 1000);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) {
      Alert.alert(
        'ದಯವಿಟ್ಟು ಕಾಯಿರಿ | Please Wait',
        `${timer} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಮತ್ತೆ ಕಳುಹಿಸಬಹುದು\nYou can resend in ${timer} seconds`,
        [{ text: 'ಸರಿ | OK' }]
      );
      return;
    }

    setOtp('');
    setLoading(true);
    
    setTimeout(() => {
      const newOTP = generateOTP();
      console.log('🔐 Resent OTP:', newOTP); // For testing
      
      setTimer(60);
      setLoading(false);
      
      Alert.alert(
        'ಯಶಸ್ವಿ | Success',
        `OTP ಮತ್ತೆ ಕಳುಹಿಸಲಾಗಿದೆ\nOTP resent successfully\n\n🔐 Test OTP: ${newOTP}`,
        [{ text: 'ಸರಿ | OK' }]
      );
    }, 1000);
  };

  const handleEditNumber = () => {
    setStep('phone');
    setOtp('');
    setGeneratedOTP('');
    setTimer(0);
  };

  const isSmallDevice = height < 700;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
          <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
        {/* Header with Logo */}
        <View style={[styles.header, isSmallDevice && styles.headerSmall]}>
          <View style={[styles.logoCircle, isSmallDevice && styles.logoCircleSmall]}>
            <Text style={[styles.logoEmoji, isSmallDevice && styles.logoEmojiSmall]}>🍇</Text>
          </View>
          <Text style={[styles.appName, isSmallDevice && styles.appNameSmall]}>ದ್ರಾಕ್ಷಿ ಫಾರ್ಮ್ ಟ್ರಾಕರ್</Text>
          <Text style={[styles.appNameEn, isSmallDevice && styles.appNameEnSmall]}>Grape Farm Tracker</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {step === 'phone' ? (
            <>
              {/* Welcome Message */}
              <View style={[styles.welcomeBox, isSmallDevice && styles.welcomeBoxSmall]}>
                <Text style={[styles.welcomeIcon, isSmallDevice && styles.welcomeIconSmall]}>📱</Text>
                <Text style={[styles.welcomeTitle, isSmallDevice && styles.welcomeTitleSmall]}>ಸ್ವಾಗತ!</Text>
                <Text style={[styles.welcomeTitleEn, isSmallDevice && styles.welcomeTitleEnSmall]}>Welcome!</Text>
                <Text style={[styles.welcomeText, isSmallDevice && styles.welcomeTextSmall]}>
                  ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೊಂದಿಗೆ ಲಾಗಿನ್ ಆಗಿ{'\n'}
                  Login with your mobile number
                </Text>
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isSmallDevice && styles.labelSmall]}>ಮೊಬೈಲ್ ಸಂಖ್ಯೆ | Mobile Number</Text>
                
                <View style={[styles.phoneInputWrapper, isSmallDevice && styles.inputSmall]}>
                  <View style={styles.countryCode}>
                    <Text style={[styles.countryCodeText, isSmallDevice && styles.countryCodeTextSmall]}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                    style={[styles.phoneInput, isSmallDevice && styles.phoneInputSmall]}
                    placeholder="9876543210"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>

                {phoneNumber.length > 0 && phoneNumber.length !== 10 && (
                  <Text style={styles.errorText}>
                    ⚠️ ದಯವಿಟ್ಟು 10 ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ | Please enter 10 digits
                  </Text>
                )}
              </View>

              {/* Info Box */}
              <View style={[styles.infoBox, isSmallDevice && styles.infoBoxSmall]}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={[styles.infoText, isSmallDevice && styles.infoTextSmall]}>
                  ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ 6 ಅಂಕಿಗಳ OTP ಕಳುಹಿಸಲಾಗುತ್ತದೆ{'\n'}
                  A 6-digit OTP will be sent to your mobile number
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <View style={[styles.welcomeBox, isSmallDevice && styles.welcomeBoxSmall]}>
                <Text style={[styles.welcomeIcon, isSmallDevice && styles.welcomeIconSmall]}>🔐</Text>
                <Text style={[styles.welcomeTitle, isSmallDevice && styles.welcomeTitleSmall]}>OTP ಪರಿಶೀಲಿಸಿ</Text>
                <Text style={[styles.welcomeTitleEn, isSmallDevice && styles.welcomeTitleEnSmall]}>Verify OTP</Text>
                <Text style={[styles.welcomeText, isSmallDevice && styles.welcomeTextSmall]}>
                  +91 {phoneNumber} ಗೆ ಕಳುಹಿಸಲಾದ{'\n'}
                  6 ಅಂಕಿಗಳ OTP ನಮೂದಿಸಿ
                </Text>
                <TouchableOpacity onPress={handleEditNumber} style={styles.editButton}>
                  <Text style={[styles.editButtonText, isSmallDevice && styles.editButtonTextSmall]}>✏️ ಬದಲಿಸಿ | Edit</Text>
                </TouchableOpacity>
              </View>

              {/* OTP Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, isSmallDevice && styles.labelSmall]}>OTP ನಮೂದಿಸಿ | Enter OTP</Text>
                
                <TextInput
                  style={[styles.otpInput, isSmallDevice && styles.otpInputSmall]}
                  placeholder="000000"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  textAlign="center"
                />

                {otp.length > 0 && otp.length !== 6 && (
                  <Text style={styles.errorText}>
                    ⚠️ ದಯವಿಟ್ಟು 6 ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ | Please enter 6 digits
                  </Text>
                )}
              </View>

              {/* Resend OTP */}
              <View style={[styles.resendContainer, isSmallDevice && styles.resendContainerSmall]}>
                <Text style={[styles.resendText, isSmallDevice && styles.resendTextSmall]}>OTP ಬರಲಿಲ್ಲವೇ?</Text>
                <TouchableOpacity onPress={handleResendOTP} disabled={timer > 0}>
                  <Text style={[styles.resendButton, timer > 0 && styles.resendDisabled, isSmallDevice && styles.resendButtonSmall]}>
                    {timer > 0 ? `${timer}s` : 'ಮತ್ತೆ ಕಳುಹಿಸಿ | Resend'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Spacer to push button down */}
        <View style={styles.spacer} />

        {/* Fixed Button at Bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonPrimary,
              ((step === 'phone' && phoneNumber.length !== 10) || (step === 'otp' && otp.length !== 6) || loading) && styles.buttonDisabled
            ]}
            onPress={step === 'phone' ? handleSendOTP : handleVerifyOTP}
            disabled={(step === 'phone' && phoneNumber.length !== 10) || (step === 'otp' && otp.length !== 6) || loading}
          >
            {loading ? (
              <Text style={[styles.buttonText, isSmallDevice && styles.buttonTextSmall]}>
                {step === 'phone' ? 'ಕಾಯಿರಿ... | Please wait...' : 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ... | Verifying...'}
              </Text>
            ) : (
              <Text style={[styles.buttonText, isSmallDevice && styles.buttonTextSmall]}>
                {step === 'phone' ? 'OTP ಕಳುಹಿಸಿ | Send OTP' : 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್ | Verify & Login'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, isSmallDevice && styles.footerTextSmall]}>
              🔒 ನಿಮ್ಮ ಮಾಹಿತಿ ಸುರಕ್ಷಿತವಾಗಿದೆ | Your information is secure
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerSmall: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  logoCircleSmall: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 42,
  },
  logoEmojiSmall: {
    fontSize: 32,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  appNameSmall: {
    fontSize: 18,
    marginBottom: 2,
  },
  appNameEn: {
    fontSize: 15,
    color: '#16a34a',
  },
  appNameEnSmall: {
    fontSize: 13,
  },
  content: {
    paddingHorizontal: 24,
  },
  welcomeBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeBoxSmall: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  welcomeIcon: {
    fontSize: 42,
    marginBottom: 10,
  },
  welcomeIconSmall: {
    fontSize: 32,
    marginBottom: 6,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  welcomeTitleSmall: {
    fontSize: 20,
    marginBottom: 2,
  },
  welcomeTitleEn: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 10,
  },
  welcomeTitleEnSmall: {
    fontSize: 15,
    marginBottom: 6,
  },
  welcomeText: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  welcomeTextSmall: {
    fontSize: 13,
    lineHeight: 19,
  },
  editButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
  },
  editButtonTextSmall: {
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  labelSmall: {
    fontSize: 14,
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1fae5',
    overflow: 'hidden',
  },
  inputSmall: {
    borderRadius: 10,
  },
  countryCode: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#d1fae5',
  },
  countryCodeText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#166534',
  },
  countryCodeTextSmall: {
    fontSize: 15,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    fontSize: 19,
    color: '#1f2937',
    fontWeight: '600',
  },
  phoneInputSmall: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 17,
  },
  otpInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1fae5',
    paddingVertical: 18,
    fontSize: 30,
    color: '#1f2937',
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  otpInputSmall: {
    paddingVertical: 14,
    fontSize: 26,
    letterSpacing: 6,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 6,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoBoxSmall: {
    padding: 10,
    marginBottom: 12,
    borderRadius: 10,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 19,
  },
  infoTextSmall: {
    fontSize: 12,
    lineHeight: 17,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  resendContainerSmall: {
    marginBottom: 12,
  },
  resendText: {
    fontSize: 13,
    color: '#6b7280',
  },
  resendTextSmall: {
    fontSize: 12,
  },
  resendButton: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  resendButtonSmall: {
    fontSize: 12,
  },
  resendDisabled: {
    color: '#9ca3af',
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#16a34a',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonTextSmall: {
    fontSize: 15,
  },
  footer: {
    paddingTop: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerTextSmall: {
    fontSize: 11,
    lineHeight: 16,
  },
});