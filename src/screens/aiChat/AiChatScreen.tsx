import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Header, Card, BilingualText } from '../../components';
import aiChatService, { ChatMessage } from '../../services/aiChatService';
import { useAuth } from '../../hooks/useAuth';

interface AiChatScreenProps {
  navigation: any;
}

interface Section {
  title?: string;
  titleEn?: string;
  content: string;
  type: 'intro' | 'section';
  icon?: string;
  color?: string;
}

const AgriLoadingAnimation: React.FC = () => {
  const bounceAnim1 = useRef(new Animated.Value(0)).current;
  const bounceAnim2 = useRef(new Animated.Value(0)).current;
  const bounceAnim3 = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bouncing animation for emojis
    const bounce1 = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim1, {
          toValue: -8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim1, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    const bounce2 = Animated.loop(
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(bounceAnim2, {
          toValue: -8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim2, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    const bounce3 = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(bounceAnim3, {
          toValue: -8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim3, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    // Rotation animation for tractor
    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    bounce1.start();
    bounce2.start();
    bounce3.start();
    rotate.start();

    return () => {
      bounce1.stop();
      bounce2.stop();
      bounce3.stop();
      rotate.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.agriLoadingContainer}>
      <Animated.Text
        style={[
          styles.agriEmoji,
          { transform: [{ translateY: bounceAnim1 }] },
        ]}
      >
        🌾
      </Animated.Text>
      <Animated.Text
        style={[
          styles.agriEmoji,
          { transform: [{ rotate: spin }] },
        ]}
      >
        🚜
      </Animated.Text>
      <Animated.Text
        style={[
          styles.agriEmoji,
          { transform: [{ translateY: bounceAnim2 }] },
        ]}
      >
        🌱
      </Animated.Text>
      <Animated.Text
        style={[
          styles.agriEmoji,
          { transform: [{ translateY: bounceAnim3 }] },
        ]}
      >
        🌾
      </Animated.Text>
    </View>
  );
};

const AiChatScreen: React.FC<AiChatScreenProps> = ({ navigation }) => {
  const { userId } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const unsubscribe = aiChatService.subscribeToChatMessages(userId, (chatMessages) => {
      setMessages(chatMessages);
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !userId) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      await aiChatService.sendMessage(userId, messageText);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        'ದೋಷ | Error',
        'ಸಂದೇಶ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ | Failed to send message'
      );
      setInputText(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'ಇತಿಹಾಸ ತೆರವುಗೊಳಿಸಿ | Clear History',
      'ಎಲ್ಲಾ ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಅಳಿಸಬೇಕೇ?\nDelete all chat history?',
      [
        {
          text: 'ರದ್ದು | Cancel',
          style: 'cancel',
        },
        {
          text: 'ಅಳಿಸಿ | Delete',
          style: 'destructive',
          onPress: async () => {
            if (!userId) return;
            try {
              await aiChatService.clearChatHistory(userId);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const parseAIResponse = (text: string): Section[] => {
    const sections: Section[] = [];
    const lines = text.split('\n');
    let introText = '';
    let currentSection: Section | null = null;
    let currentContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip the --- separator
      if (line === '---') {
        continue;
      }

      // Check if it's a section header starting with * **
      if (line.startsWith('* **') && line.includes('**')) {
        // Save previous section
        if (currentSection) {
          sections.push({
            ...currentSection,
            content: currentContent.join('\n').trim()
          });
        }

        // Extract title (Kannada and English)
        const titleMatch = line.match(/\* \*\*(.+?)\*\*/);
        if (titleMatch) {
          const fullTitle = titleMatch[1];
          let title = '';
          let titleEn = '';

          // Check if title has English translation in parentheses
          const bilingualMatch = fullTitle.match(/(.+?)\s*\(([^)]+)\)/);
          if (bilingualMatch) {
            title = bilingualMatch[1].trim();
            titleEn = bilingualMatch[2].trim();
          } else {
            title = fullTitle.trim();
            titleEn = '';
          }

          const { icon, color } = getSectionStyle(title, titleEn);

          currentSection = {
            title,
            titleEn,
            type: 'section',
            icon,
            color
          };
          currentContent = [];
        }
      } else if (currentSection && line) {
        // Content within a section
        if (line.match(/^\d+\./)) {
          // Numbered lists
          currentContent.push(line);
        } else if (line.startsWith('*') && !line.startsWith('* **')) {
          // Single bullet points - replace * with •
          currentContent.push(line.replace(/^\*\s*/, '• '));
        } else {
          // Regular text
          currentContent.push(line);
        }
      } else if (!currentSection && line && !line.startsWith('*')) {
        // Intro text before any section (before ---)
        introText += (introText ? '\n' : '') + line;
      }
    }

    // Save last section
    if (currentSection) {
      sections.push({
        ...currentSection,
        content: currentContent.join('\n').trim()
      });
    }

    // Add intro if exists
    if (introText.trim()) {
      sections.unshift({
        type: 'intro',
        content: introText.trim()
      });
    }

    return sections.length > 0 ? sections : [{ type: 'intro', content: text }];
  };

  const getSectionStyle = (title: string, titleEn: string) => {
    const combinedTitle = `${title} ${titleEn}`.toLowerCase();

    if (combinedTitle.includes('ಇದೇನು') || combinedTitle.includes('what is')) {
      return { icon: '📘', color: '#e0f2fe' };
    }
    if (combinedTitle.includes('ಸಮಸ್ಯೆ') || combinedTitle.includes('problem')) {
      return { icon: '⚠️', color: '#fee2e2' };
    }
    if (combinedTitle.includes('ಏಕೆ') || combinedTitle.includes('why')) {
      return { icon: '🤔', color: '#fef3c7' };
    }
    if (combinedTitle.includes('ಗುರುತಿಸ') || combinedTitle.includes('identify')) {
      return { icon: '🔍', color: '#dbeafe' };
    }
    if (combinedTitle.includes('ಮಾಡಬೇಕು') || combinedTitle.includes('what to do')) {
      return { icon: '✅', color: '#dcfce7' };
    }
    if (combinedTitle.includes('ಮನೆಯಲ್ಲೇ') || combinedTitle.includes('home')) {
      return { icon: '🌿', color: '#f0fdf4' };
    }
    if (combinedTitle.includes('ತಪ್ಪುಗಳು') || combinedTitle.includes('mistake')) {
      return { icon: '🚫', color: '#fff1f2' };
    }
    return { icon: '📌', color: '#f3f4f6' };
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSection = (section: Section, index: number, isLast: boolean) => {
    if (section.type === 'intro') {
      return (
        <View key={index}>
          <View style={styles.sectionContent}>
            <View style={styles.cardHeader}>
              <RNText style={styles.cardIcon}>🤖</RNText>
              <RNText style={styles.cardTitle}>AI ಸಹಾಯಕ | Assistant</RNText>
            </View>
            <RNText style={styles.introText}>{section.content}</RNText>
          </View>
          {!isLast && <View style={styles.dottedSeparator} />}
        </View>
      );
    }

    return (
      <View key={index}>
        <View style={[styles.sectionContent, { backgroundColor: section.color }]}>
          <View style={styles.cardHeader}>
            <RNText style={styles.cardIcon}>{section.icon}</RNText>
            <View style={styles.titleContainer}>
              <RNText style={styles.sectionTitle}>{section.title}</RNText>
              {section.titleEn && (
                <RNText style={styles.sectionTitleEn}>{section.titleEn}</RNText>
              )}
            </View>
          </View>
          <RNText style={styles.sectionText}>{section.content}</RNText>
        </View>
        {!isLast && <View style={styles.dottedSeparator} />}
      </View>
    );
  };

  const toggleExpand = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const renderMessage = (message: ChatMessage, index: number) => {
    // Check processing status - updated to match service status values
    const isProcessing = message.status === 'processing';
    const isError = message.status === 'error';
    const isCompleted = message.status === 'completed';
    const hasResponse = message.Answer && message.Answer.trim().length > 0;
    const isExpanded = expandedMessages.has(message.id || '');

    return (
      <View key={message.id || index} style={styles.messageContainer}>
        {/* User Question */}
        <View style={styles.userMessageWrapper}>
          <View style={styles.userMessage}>
            <RNText style={styles.userMessageText}>{message.Question}</RNText>
            <RNText style={styles.userMessageTime}>{formatTime(message.createdAt)}</RNText>
          </View>
        </View>

        {/* AI Response - Processing */}
        {isProcessing && (
          <View style={styles.aiMessageWrapper}>
            <View style={styles.processingCard}>
              <AgriLoadingAnimation />
              <RNText style={styles.processingText}>
                AI ಉತ್ತರಿಸುತ್ತಿದೆ... | AI is responding...
              </RNText>
            </View>
          </View>
        )}

        {/* AI Response - Error */}
        {isError && (
          <View style={styles.aiMessageWrapper}>
            <View style={styles.errorCard}>
              <RNText style={styles.errorIcon}>⚠️</RNText>
              <RNText style={styles.errorText}>
                {message.errorMessage || 'ದೋಷ ಸಂಭವಿಸಿದೆ | An error occurred'}
              </RNText>
            </View>
          </View>
        )}

        {/* AI Response - Completed */}
        {isCompleted && hasResponse && (
          <View style={styles.aiMessageWrapper}>
            <View style={styles.singleResponseCard}>
              {(() => {
                const allSections = parseAIResponse(message.Answer);
                const sectionsToShow = isExpanded
                  ? allSections
                  : allSections.filter((section, idx) => {
                      // Show intro and first section (What is it)
                      if (section.type === 'intro') return true;
                      if (idx === 1) return true; // First section after intro
                      return false;
                    });

                const hasMoreSections = allSections.length > sectionsToShow.length;

                return (
                  <>
                    {sectionsToShow.map((section, idx, arr) =>
                      renderSection(section, idx, idx === arr.length - 1 && !hasMoreSections)
                    )}

                    {hasMoreSections && !isExpanded && (
                      <>
                        <View style={styles.dottedSeparator} />
                        <TouchableOpacity
                          style={styles.readMoreButton}
                          onPress={() => toggleExpand(message.id || '')}
                        >
                          <RNText style={styles.readMoreText}>
                            ಇನ್ನಷ್ಟು ಓದಿ | Read More ▼
                          </RNText>
                        </TouchableOpacity>
                      </>
                    )}

                    {isExpanded && (
                      <>
                        <View style={styles.dottedSeparator} />
                        <TouchableOpacity
                          style={styles.readMoreButton}
                          onPress={() => toggleExpand(message.id || '')}
                        >
                          <RNText style={styles.readMoreText}>
                            ಕಡಿಮೆ ತೋರಿಸು | Show Less ▲
                          </RNText>
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                );
              })()}

              {message.updatedAt && (
                <RNText style={styles.aiMessageTime}>
                  {formatTime(message.updatedAt)}
                </RNText>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Header
        title="AI ಸಹಾಯಕ"
        subtitle="AI Assistant"
        leftIcon="←"
        onLeftPress={() => navigation.goBack()}
        rightIcon="🗑️"
        onRightPress={handleClearHistory}
        style={styles.header}
      />

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0284c7" />
            <RNText style={styles.loadingText}>
              ಲೋಡ್ ಆಗುತ್ತಿದೆ... | Loading...
            </RNText>
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <RNText style={styles.emptyIcon}>💬</RNText>
            <BilingualText
              kannada="ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"
              english="Hello! How can I help you today?"
              style={styles.emptyTitle}
            />
            <RNText style={styles.emptySubtitle}>
              ಕೃಷಿ, ರಾಸಾಯನಿಕಗಳು, ಬೆಳೆಗಳು ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ
              {'\n'}
              Ask anything about farming, chemicals, crops
            </RNText>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((message, index) => renderMessage(message, index))}
          </ScrollView>
        )}
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ | Type your question..."
          placeholderTextColor="#9ca3af"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!sending}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || sending) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <RNText style={styles.sendIcon}>📤</RNText>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    backgroundColor: '#0284c7',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 20,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  userMessageText: {
    fontSize: 15,
    color: '#ffffff',
    marginBottom: 4,
  },
  userMessageTime: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.8,
    alignSelf: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
    maxWidth: '100%',
  },
  singleResponseCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dottedSeparator: {
    height: 1,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginHorizontal: 12,
  },
  readMoreButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginVertical: 4,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
    textAlign: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  titleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sectionTitleEn: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 2,
  },
  introText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
  sectionText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 22,
  },
  aiMessageTime: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
    marginLeft: 4,
  },
  processingCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    gap: 12,
  },
  agriLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  agriEmoji: {
    fontSize: 24,
  },
  processingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  errorIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 10,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1f2937',
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendIcon: {
    fontSize: 20,
  },
});

export default AiChatScreen;
