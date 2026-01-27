import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { ScreenProps } from '../../types';

const PhoneAuthScreen = observer(({ navigation }: ScreenProps<'Login'>) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const { loginWithPhone, verifyOTP, clearError, resetOtpState, pendingPhoneNumber } = useAuth();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  useEffect(() => {
    if (pendingPhoneNumber && pendingPhoneNumber !== phoneNumber) {
      setPhoneNumber(pendingPhoneNumber);
    }
  }, [pendingPhoneNumber]);

  const handleSendOTP = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);
      try {
        await loginWithPhone(phoneNumber);
        setStep('otp');
        setTimer(60);
        setLoading(false);
        Alert.alert(
          'Success',
          `OTP sent to +91 ${phoneNumber}`,
          [{ text: 'OK' }]
        );
      } catch (error: any) {
        setLoading(false);
        let errorMessage = 'Failed to send OTP';
        if (error.code === 'auth/invalid-phone-number') {
          errorMessage = 'Invalid phone number';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many requests. Please try later';
        } else if (error.code === 'auth/network-request-failed') {
          errorMessage = 'Network error. Check your connection';
        }
        Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      setLoading(true);
      try {
        await verifyOTP(otp);
        setLoading(false);
        navigation.replace('Home');
      } catch (error: any) {
        setLoading(false);
        let errorMessage = 'OTP verification failed';
        if (error.code === 'auth/invalid-verification-code') {
          errorMessage = 'Invalid OTP. Please try again';
        } else if (error.code === 'auth/code-expired') {
          errorMessage = 'OTP expired. Please resend';
        } else if (error.code === 'auth/session-expired') {
          errorMessage = 'Session expired. Please try again';
          handleEditNumber();
        }
        Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
        setOtp('');
      }
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) {
      Alert.alert('Please Wait', `You can resend in ${timer} seconds`, [{ text: 'OK' }]);
      return;
    }
    setOtp('');
    setLoading(true);
    try {
      const phoneToUse = pendingPhoneNumber || phoneNumber;
      await loginWithPhone(phoneToUse);
      setTimer(60);
      setLoading(false);
      Alert.alert('Success', 'OTP resent successfully', [{ text: 'OK' }]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to resend OTP', [{ text: 'OK' }]);
    }
  };

  const handleEditNumber = () => {
    setStep('phone');
    setOtp('');
    setTimer(0);
    resetOtpState();
    clearError();
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#7c3aed', '#8b5cf6', '#a78bfa']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Logo */}
              <View style={styles.logoSection}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoEmoji}>🍇</Text>
                </View>
                <Text style={styles.appName}>Grape Farm Tracker</Text>
              </View>

              {/* Card */}
              <View style={styles.card}>
                {step === 'phone' ? (
                  <>
                    <View style={styles.headerSection}>
                      <Text style={styles.title}>Welcome</Text>
                      <Text style={styles.subtitle}>Login with your mobile number</Text>
                    </View>

                    <View style={styles.inputSection}>
                      <Text style={styles.label}>Mobile Number</Text>
                      <View style={styles.phoneInputWrapper}>
                        <View style={styles.countryCode}>
                          <Text style={styles.countryCodeText}>+91</Text>
                        </View>
                        <TextInput
                          style={styles.phoneInput}
                          placeholder="Enter 10 digit number"
                          placeholderTextColor="#9ca3af"
                          keyboardType="phone-pad"
                          maxLength={10}
                          value={phoneNumber}
                          onChangeText={setPhoneNumber}
                        />
                      </View>
                      {phoneNumber.length > 0 && phoneNumber.length !== 10 && (
                        <Text style={styles.errorText}>Please enter 10 digits</Text>
                      )}
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoText}>A 6-digit OTP will be sent to your number</Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.button, phoneNumber.length !== 10 && styles.buttonDisabled]}
                      onPress={handleSendOTP}
                      disabled={phoneNumber.length !== 10 || loading}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? 'Sending...' : 'Send OTP'}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.headerSection}>
                      <Text style={styles.title}>Verify OTP</Text>
                      <Text style={styles.subtitle}>
                        Enter the code sent to +91 {pendingPhoneNumber || phoneNumber}
                      </Text>
                      <TouchableOpacity onPress={handleEditNumber} style={styles.editButton}>
                        <Text style={styles.editButtonText}>Change number</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputSection}>
                      <Text style={styles.label}>Enter OTP</Text>
                      <TextInput
                        style={styles.otpInput}
                        placeholder="------"
                        placeholderTextColor="#d1d5db"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
                        textAlign="center"
                      />
                      {otp.length > 0 && otp.length !== 6 && (
                        <Text style={styles.errorText}>Please enter 6 digits</Text>
                      )}
                    </View>

                    <View style={styles.resendRow}>
                      <Text style={styles.resendText}>Didn't receive code?</Text>
                      <TouchableOpacity onPress={handleResendOTP} disabled={timer > 0}>
                        <Text style={[styles.resendButton, timer > 0 && styles.resendDisabled]}>
                          {timer > 0 ? `Resend in ${timer}s` : 'Resend'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[styles.button, otp.length !== 6 && styles.buttonDisabled]}
                      onPress={handleVerifyOTP}
                      disabled={otp.length !== 6 || loading}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? 'Verifying...' : 'Verify & Login'}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Your information is secure</Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
  },
  otpInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    paddingVertical: 14,
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    letterSpacing: 12,
  },
  errorText: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 6,
  },
  infoRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  editButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 6,
  },
  resendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  resendButton: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '600',
  },
  resendDisabled: {
    color: '#9ca3af',
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default PhoneAuthScreen;
