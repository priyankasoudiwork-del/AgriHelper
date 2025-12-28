import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    // Email validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email is invalid');
      return;
    }

    // Password validation
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasNumber || !hasSpecialChar) {
      setError('Password must contain a number and a special character');
      return;
    }

    setError('');
    // API call will go here
  };

  return (
    <View style={{ flex: 1, marginTop: '20%', margin: '10%' }}>

      {/* Heading */}
      <Text testID="registerTitle">Register</Text>

      {/* Email */}
      <TextInput
        testID="emailInput"
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <TextInput
        testID="passwordInput"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Error Message */}
      {error ? <Text testID="errorText">{error}</Text> : null}

      {/* Register Button */}
      <Button
        title="Register"
        testID="registerButton"
        onPress={handleRegister}
      />
    </View>
  );
};

export default Register;
