import { useState, useEffect, useCallback } from 'react';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import { PermissionsAndroid, Platform } from 'react-native';

interface UseVoiceInputReturn {
  isRecording: boolean;
  isProcessing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  result: string;
  error: string | null;
  hasPermission: boolean;
}

interface UseVoiceInputOptions {
  language?: string;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

export const useVoiceInput = (options?: UseVoiceInputOptions): UseVoiceInputReturn => {
  const {
    language = 'kn-IN', // Kannada language code
    onResult,
    onError,
  } = options || {};

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Request microphone permission on Android
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ | Microphone Permission',
            message:
              'ಧ್ವನಿ ಇನ್‌ಪುಟ್‌ಗಾಗಿ ಅಪ್ಲಿಕೇಶನ್‌ಗೆ ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶದ ಅಗತ್ಯವಿದೆ | App needs microphone access for voice input',
            buttonNeutral: 'ನಂತರ ಕೇಳಿ | Ask Later',
            buttonNegative: 'ರದ್ದುಮಾಡಿ | Cancel',
            buttonPositive: 'ಅನುಮತಿಸಿ | Allow',
          }
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasPermission(isGranted);
        return isGranted;
      } catch (err) {
        console.error('Permission error:', err);
        setHasPermission(false);
        return false;
      }
    }
    // iOS permissions are handled automatically by the system
    setHasPermission(true);
    return true;
  }, []);

  // Initialize Voice service
  useEffect(() => {
    // Check if Voice is available
    if (!Voice) {
      console.error('Voice module is not available');
      setError('ಧ್ವನಿ ಸೇವೆ ಲಭ್ಯವಿಲ್ಲ | Voice service not available');
      return;
    }

    try {
      Voice.onSpeechStart = () => {
        setIsRecording(true);
        setIsProcessing(false);
        setError(null);
      };

      Voice.onSpeechEnd = () => {
        setIsRecording(false);
        setIsProcessing(true);
      };

      Voice.onSpeechResults = (e: SpeechResultsEvent) => {
        setIsProcessing(false);
        if (e.value && e.value.length > 0) {
          const recognizedText = e.value[0];
          setResult(recognizedText);
          onResult?.(recognizedText);
        }
      };

      Voice.onSpeechError = (e: SpeechErrorEvent) => {
        setIsRecording(false);
        setIsProcessing(false);
        const errorMessage = e.error?.message || 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ವಿಫಲವಾಗಿದೆ | Voice recognition failed';
        setError(errorMessage);
        onError?.(errorMessage);
      };

      // Request permission on mount
      requestMicrophonePermission();
    } catch (err) {
      console.error('Voice initialization error:', err);
      setError('ಧ್ವನಿ ಸೇವೆ ಆರಂಭಿಸಲು ವಿಫಲವಾಗಿದೆ | Failed to initialize voice service');
    }

    return () => {
      try {
        if (Voice) {
          Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
        }
      } catch (err) {
        console.error('Voice cleanup error:', err);
      }
    };
  }, [onResult, onError, requestMicrophonePermission]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      // Check if Voice module and its methods are available
      if (!Voice || typeof Voice.start !== 'function') {
        const voiceError = 'ಧ್ವನಿ ಸೇವೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಅಪ್ಲಿಕೇಶನ್ ಮರುಪ್ರಾರಂಭಿಸಿ | Voice service not available. Please restart the app';
        console.error('Voice module not properly initialized:', {
          voiceExists: !!Voice,
          startExists: Voice ? typeof Voice.start : 'Voice is null',
        });
        setError(voiceError);
        onError?.(voiceError);
        return;
      }

      // Check permission first
      const permitted = hasPermission || (await requestMicrophonePermission());
      if (!permitted) {
        const permissionError = 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ | Microphone permission denied';
        setError(permissionError);
        onError?.(permissionError);
        return;
      }

      setError(null);
      setResult('');

      console.log('Starting voice recognition with language:', language);
      await Voice.start(language);
    } catch (e: any) {
      console.error('Start recording error:', e);
      const startError = e.message || 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಲು ವಿಫಲವಾಗಿದೆ | Failed to start recording';
      setError(startError);
      onError?.(startError);
    }
  }, [hasPermission, language, onError, requestMicrophonePermission]);

  // Stop recording
  const stopRecording = useCallback(async () => {
    try {
      if (Voice) {
        await Voice.stop();
      }
      setIsRecording(false);
    } catch (e: any) {
      console.error('Stop recording error:', e);
      setIsRecording(false);
    }
  }, []);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    result,
    error,
    hasPermission,
  };
};
