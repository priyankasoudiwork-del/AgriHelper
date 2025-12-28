import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform, Alert } from 'react-native';

export default function OpenChatGPTWeb() {

  const openChatGPTWeb = async () => {
    const webUrl =
      Platform.OS === 'android'
        ? 'https://www.google.com/url?q=https://chat.openai.com/'
        : 'https://chat.openai.com/';

    const supported = await Linking.canOpenURL(webUrl);

    if (supported) {
      Linking.openURL(webUrl);
    } else {
      Alert.alert('Error', 'Unable to open browser');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌐 Open ChatGPT in Web</Text>

      <TouchableOpacity style={styles.button} onPress={openChatGPTWeb}>
        <Text style={styles.buttonText}>Open ChatGPT (Web Only)</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        This will open ChatGPT in the browser, not the app.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
});
