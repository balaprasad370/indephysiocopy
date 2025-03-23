import React, {useState, useRef, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import moment from 'moment';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LightTheme from '../../theme/LighTheme';

const MedTalk = () => {
  const {isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LightTheme;
  const [message, setMessage] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [tokens, setTokens] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([
    {
      id: 1,
      text: 'Hello! How can I help you with your medical questions today?',
      sender: 'bot',
      timestamp: new Date(),
      hasAudio: true,
      audioUrl: 'https://example.com/audio1.mp3',
      isPlaying: false,
    },
    {
      id: 2,
      text: 'I have a question about cardiac arrhythmias.',
      sender: 'user',
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: 3,
      text: "Sure, I can help with that. Cardiac arrhythmias are abnormal heart rhythms that occur when the electrical signals that coordinate heartbeats don't work properly. What specific aspect would you like to know about?",
      sender: 'bot',
      timestamp: new Date(Date.now() - 30000),
      hasAudio: true,
      audioUrl: 'https://example.com/audio2.mp3',
      isPlaying: false,
    },
  ]);

  const waveAnimation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();

  useEffect(() => {
    if (isRecording) {
      startWaveAnimation();
    } else {
      waveAnimation.setValue(0);
    }
  }, [isRecording]);

  const startWaveAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const handleSend = () => {
    if (message.trim() === '') return;

    // Add user message
    const userMessage = {
      id: conversations.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setConversations([...conversations, userMessage]);
    setMessage('');
    setTokens(prev => Math.max(0, prev - 1));
    setIsLoading(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = {
        id: conversations.length + 2,
        text: 'Thank you for your message. This is a simulated response from the MedTalk AI assistant.',
        sender: 'bot',
        timestamp: new Date(),
        hasAudio: Math.random() > 0.5, // Randomly assign audio for demo
        audioUrl: 'https://example.com/audio3.mp3',
        isPlaying: false,
      };

      setConversations(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement actual recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement stop recording and send audio logic here
    setIsLoading(true);

    // Simulate a response after voice recording
    setTimeout(() => {
      const userMessage = {
        id: conversations.length + 1,
        text: '[Voice message]',
        sender: 'user',
        timestamp: new Date(),
      };

      const botResponse = {
        id: conversations.length + 2,
        text: "I've received your voice message. This is a simulated response to your audio input.",
        sender: 'bot',
        timestamp: new Date(),
        hasAudio: true,
        audioUrl: 'https://example.com/audio4.mp3',
        isPlaying: false,
      };

      setConversations(prev => [...prev, userMessage, botResponse]);
      setTokens(prev => Math.max(0, prev - 2));
      setIsLoading(false);
    }, 1500);
  };

  const toggleAudioPlay = id => {
    setConversations(
      conversations.map(conv =>
        conv.id === id ? {...conv, isPlaying: !conv.isPlaying} : conv,
      ),
    );

    // Implement actual audio playback logic here
    setTimeout(() => {
      setConversations(
        conversations.map(conv =>
          conv.id === id ? {...conv, isPlaying: false} : conv,
        ),
      );
    }, 3000);
  };

  const buyTokens = () => {
    // Implement token purchase logic
    setTokens(prev => prev + 50);
  };

  const renderMessage = ({item}) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.botMessage,
          {backgroundColor: isUser ? '#613BFF' : isDark ? '#333' : '#f0f0f0'},
        ]}>
        {!isUser && (
          <View style={styles.botAvatar}>
            <LinearGradient
              colors={['#613BFF', '#4285F4']}
              style={styles.avatarGradient}>
              <Text style={styles.avatarText}>AI</Text>
            </LinearGradient>
          </View>
        )}

        <View style={[styles.messageBubble, {maxWidth: '80%', borderRadius: 20}]}>
          <Text
            style={[
              styles.messageText,
              {color: isUser ? '#fff' : isDark ? '#fff' : '#000'},
            ]}>
            {item.text}
          </Text>

          {item.hasAudio && (
            <TouchableOpacity
              style={[
                styles.audioButton,
                {
                  backgroundColor: isUser
                    ? '#4a2dc2'
                    : isDark
                    ? '#444'
                    : '#e0e0e0',
                },
              ]}
              onPress={() => toggleAudioPlay(item.id)}>
              <Icon
                name={item.isPlaying ? 'pause' : 'play-arrow'}
                size={20}
                color={isUser ? '#fff' : isDark ? '#fff' : '#333'}
              />
              <Text
                style={{
                  color: isUser ? '#fff' : isDark ? '#fff' : '#333',
                  marginLeft: 5,
                }}>
                {item.isPlaying ? 'Playing...' : 'Play Audio'}
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={[
              styles.timestamp,
              {
                color: isUser
                  ? 'rgba(255,255,255,0.7)'
                  : isDark
                  ? 'rgba(255,255,255,0.5)'
                  : 'rgba(0,0,0,0.5)',
              },
            ]}>
            {moment(item.timestamp).format('h:mm A')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDark ? '#121212' : '#fff'},
      ]}>
      {/* Header */}
      <LinearGradient colors={['#613BFF', '#4285F4']} style={styles.header}>
        <Text style={styles.headerTitle}>MedTalk AI Assistant</Text>
        <View style={styles.tokenContainer}>
          <Icon name="token" size={20} color="#fff" />
          <Text style={styles.tokenText}>{tokens} tokens</Text>
          <TouchableOpacity style={styles.buyButton} onPress={buyTokens}>
            <Text style={styles.buyButtonText}>Buy More</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Chat Messages */}
      <FlatList
        data={conversations}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#613BFF" />
          <Text style={[styles.loadingText, {color: isDark ? '#fff' : '#fff'}]}>
            AI is thinking...
          </Text>
        </View>
      )}

      {/* Input Area */}
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: isDark ? '#1e1e1e' : '#f5f5f5'},
        ]}>
        {!isVoiceMode ? (
          <>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#333' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#444' : '#ddd',
                },
              ]}
              placeholder="Type your message..."
              placeholderTextColor={isDark ? '#aaa' : '#999'}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.iconButton, {backgroundColor: '#613BFF'}]}
              onPress={handleSend}
              disabled={tokens <= 0 || message.trim() === ''}>
              <Icon name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.voiceModeContainer}>
            {isRecording ? (
              <>
                <Text
                  style={{color: isDark ? '#fff' : '#000', marginBottom: 10}}>
                  Listening...
                </Text>
                <View style={styles.waveContainer}>
                  {[...Array(5)].map((_, i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.wave,
                        {
                          height: 20 + i * 5,
                          opacity: waveAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.3, 0.8],
                          }),
                          backgroundColor: '#613BFF',
                          transform: [
                            {
                              scaleY: waveAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.6, 1 + i * 0.1],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.recordButton, {backgroundColor: '#ff4444'}]}
                  onPress={stopRecording}>
                  <Icon name="stop" size={30} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.recordButton, {backgroundColor: '#613BFF'}]}
                onPress={startRecording}
                disabled={tokens <= 0}>
                <Icon name="mic" size={30} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.modeToggle,
            {
              backgroundColor: isVoiceMode
                ? '#613BFF'
                : isDark
                ? '#333'
                : '#e0e0e0',
            },
          ]}
          onPress={toggleVoiceMode}>
          <Icon
            name={isVoiceMode ? 'keyboard' : 'mic'}
            size={24}
            color={isVoiceMode ? '#fff' : isDark ? '#fff' : '#333'}
          />
        </TouchableOpacity>
      </View>

      {/* Token Warning */}
      {tokens <= 10 && (
        <View style={styles.tokenWarning}>
          <Icon name="warning" size={20} color="#FFC107" />
          <Text style={styles.tokenWarningText}>
            Low on tokens! Buy more to continue conversations.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
    borderRadius: 20,
  },
  userMessage: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  botAvatar: {
    marginRight: 8,
  },
  avatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    borderWidth: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  modeToggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  voiceModeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 10,
  },
  wave: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  tokenWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    padding: 8,
    position: 'absolute',
    bottom: 70,
    left: 16,
    right: 16,
    borderRadius: 8,
  },
  tokenWarningText: {
    color: '#FFC107',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MedTalk;
