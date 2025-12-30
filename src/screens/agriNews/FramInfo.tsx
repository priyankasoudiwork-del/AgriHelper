import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Header, Loading, Button } from '../../components';

interface FramInfoProps {
  navigation: any;
}

const FramInfo: React.FC<FramInfoProps> = ({ navigation }) => {
  const newUrl = "https://www.prajavani.net/agriculture";

  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(newUrl);

  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
  };

  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  const handleReload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="ವೆಬ್ ಪುಟ | Web Page"
        subtitle={currentUrl}
        leftIcon="←"
        rightIcon="↻"
        onLeftPress={() => navigation.goBack()}
        onRightPress={handleReload}
        style={styles.header}
        titleStyle={styles.headerTitle}
        subtitleStyle={styles.headerUrl}
      />

      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: newUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={styles.webView}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderLoading={() => (
            <Loading message="ಲೋಡ್ ಆಗುತ್ತಿದೆ..." fullScreen />
          )}
        />
      </View>

      <View style={styles.navigationBar}>
        <Button
          title="← ಹಿಂದೆ"
          onPress={handleGoBack}
          disabled={!canGoBack}
          variant="primary"
          style={styles.navButton}
        />

        <Button
          title="ಮುಂದೆ →"
          onPress={handleGoForward}
          disabled={!canGoForward}
          variant="primary"
          style={styles.navButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#16a34a',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerUrl: {
    fontSize: 12,
    color: '#dcfce7',
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#16a34a',
  },
});

export default FramInfo;
