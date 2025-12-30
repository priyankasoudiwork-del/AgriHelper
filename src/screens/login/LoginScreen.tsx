import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useAuth } from '../../hooks/useAuth';
import { ScreenProps } from '../../types';

const { height } = Dimensions.get('window');

type LoginStep = 'phone' | 'otp';

const PhoneAuthScreen = observer(({ navigation }: ScreenProps<'Login'>) => {
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [timer, setTimer] = useState(0);

  const { loginWithPhone, verifyOTP, clearError } = useAuth();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);


  const handleSendOTP = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);

      try {
        const confirmationResult = await loginWithPhone(phoneNumber);

        setConfirmation(confirmationResult);
        setStep('otp');
        setTimer(60);
        setLoading(false);

        Alert.alert(
          'ಯಶಸ್ವಿ | Success',
          `OTP ಕಳುಹಿಸಲಾಗಿದೆ +91${phoneNumber} ಗೆ\nOTP sent to +91${phoneNumber}`,
          [{ text: 'ಸರಿ | OK' }]
        );
      } catch (error: any) {
        setLoading(false);
        console.error('Error sending OTP:', error);

        let errorMessage = 'OTP ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ\nFailed to send OTP';

        if (error.code === 'auth/invalid-phone-number') {
          errorMessage = 'ಅಮಾನ್ಯ ಫೋನ್ ಸಂಖ್ಯೆ\nInvalid phone number';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'ಹಲವು ಪ್ರಯತ್ನಗಳು. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ\nToo many requests. Please try later';
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = 'ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ನಿಮ್ಮ ಸಂಪರ್ಕ ಪರಿಶೀಲಿಸಿ\nNetwork error. Check your connection';
        }

        Alert.alert('ದೋಷ | Error', errorMessage, [{ text: 'ಸರಿ | OK' }]);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6 && confirmation) {
      setLoading(true);

      try {
        await verifyOTP(confirmation, otp);

        console.log('User signed in successfully');
        setLoading(false);

        Alert.alert(
          'ಯಶಸ್ವಿ | Success',
          'ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!\nLogin successful!',
          [{ text: 'ಸರಿ | OK' }]
        );
      } catch (error: any) {
        setLoading(false);
        console.error('Error verifying OTP:', error);

        let errorMessage = 'OTP ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ\nOTP verification failed';

        if (error.code === 'auth/invalid-verification-code') {
          errorMessage = 'ಅಮಾನ್ಯ OTP. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ\nInvalid OTP. Please try again';
        } else if (error.code === 'auth/code-expired') {
          errorMessage = 'OTP ಅವಧಿ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಕಳುಹಿಸಿ\nOTP expired. Please resend';
        } else if (error.code === 'auth/session-expired') {
          errorMessage = 'ಸೆಷನ್ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ\nSession expired. Please try again';
          handleEditNumber();
        }

        Alert.alert('ದೋಷ | Error', errorMessage, [{ text: 'ಸರಿ | OK' }]);

        setOtp('');
      }
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

    try {
      const confirmationResult = await loginWithPhone(phoneNumber);

      setConfirmation(confirmationResult);
      setTimer(60);
      setLoading(false);

      Alert.alert(
        'ಯಶಸ್ವಿ | Success',
        'OTP ಮತ್ತೆ ಕಳುಹಿಸಲಾಗಿದೆ\nOTP resent successfully',
        [{ text: 'ಸರಿ | OK' }]
      );
    } catch (error) {
      setLoading(false);
      console.error('Error resending OTP:', error);
      Alert.alert(
        'ದೋಷ | Error',
        'OTP ಮತ್ತೆ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ\nFailed to resend OTP',
        [{ text: 'ಸರಿ | OK' }]
      );
    }
  };

  const handleEditNumber = () => {
    setStep('phone');
    setOtp('');
    setConfirmation(null);
    setTimer(0);
    clearError();
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerSmall: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircleSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 48,
  },
  logoEmojiSmall: {
    fontSize: 36,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  appNameSmall: {
    fontSize: 20,
  },
  appNameEn: {
    fontSize: 16,
    color: '#6b7280',
  },
  appNameEnSmall: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  welcomeBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeBoxSmall: {
    padding: 16,
    marginBottom: 16,
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  welcomeIconSmall: {
    fontSize: 36,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  welcomeTitleSmall: {
    fontSize: 22,
  },
  welcomeTitleEn: {
    fontSize: 20,
    color: '#6b7280',
    marginBottom: 8,
  },
  welcomeTitleEnSmall: {
    fontSize: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  welcomeTextSmall: {
    fontSize: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  labelSmall: {
    fontSize: 14,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  inputSmall: {
    borderRadius: 10,
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f3f4f6',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  countryCodeTextSmall: {
    fontSize: 14,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: '#1f2937',
  },
  phoneInputSmall: {
    fontSize: 16,
    paddingVertical: 14,
  },
  otpInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingVertical: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    letterSpacing: 8,
  },
  otpInputSmall: {
    paddingVertical: 16,
    fontSize: 28,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoBoxSmall: {
    padding: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  infoTextSmall: {
    fontSize: 12,
  },
  editButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  editButtonTextSmall: {
    fontSize: 12,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  resendContainerSmall: {
    marginTop: 4,
  },
  resendText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  resendTextSmall: {
    fontSize: 12,
  },
  resendButton: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
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
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#8b5cf6',
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonTextSmall: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerTextSmall: {
    fontSize: 11,
  },
});

export default PhoneAuthScreen;
