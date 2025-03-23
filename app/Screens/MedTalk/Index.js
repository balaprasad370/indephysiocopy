import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LightTheme from '../../theme/LighTheme';
import {ROUTES} from '../../Constants/routes';
import axiosInstance from '../../Components/axiosInstance';
import moment from 'moment';

const MedTalkIndex = () => {
  const navigation = useNavigation();
  const {isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LightTheme;
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(0);
  const {width, height} = useWindowDimensions();
  const [isComingSoon, setIsComingSoon] = useState(true);

  // Fetch chats and tokens
  useEffect(() => {
    if (!isComingSoon) {
      fetchChats();
      fetchTokens();
    }
  }, [isComingSoon]);

  const fetchChats = async () => {
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get('https://server.indephysio.com/student/getMedTalkChats');
      // setChats(response.data);
      // // Mock data for now
      // setTimeout(() => {
      //   // setChats([
      //   //   {
      //   //     id: '1',
      //   //     title: 'Cardiac Arrhythmias',
      //   //     lastMessage:
      //   //       'What are the common treatments for atrial fibrillation?',
      //   //     timestamp: new Date(Date.now() - 3600000),
      //   //   },
      //   //   {
      //   //     id: '2',
      //   //     title: 'Diabetes Management',
      //   //     lastMessage:
      //   //       'How do I adjust insulin dosage based on blood glucose readings?',
      //   //     timestamp: new Date(Date.now() - 86400000),
      //   //   },
      //   //   {
      //   //     id: '3',
      //   //     title: 'Neurological Disorders',
      //   //     lastMessage:
      //   //       'Can you explain the pathophysiology of multiple sclerosis?',
      //   //     timestamp: new Date(Date.now() - 172800000),
      //   //   },
      //   // ]);
      //   setLoading(false);
      // }, 1000);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  };

  const fetchTokens = async () => {
    try {
      // Replace with actual API call
      // const response = await axiosInstance.get('https://server.indephysio.com/student/getMedTalkTokens');
      // setTokens(response.data.tokens);

      // Mock data for now
      setTokens(0);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const formatDate = date => {
    return moment(date).calendar(null, {
      sameDay: 'h:mm A',
      lastDay: '[Yesterday]',
      lastWeek: 'ddd',
      sameElse: 'MM/DD/YY',
    });
  };

  const handleChatPress = chat => {
    navigation.navigate(ROUTES.MEDCHAT, {chatId: chat.id, title: chat.title});
  };

  const handleNewChat = () => {
    if (tokens > 0) {
      navigation.navigate(ROUTES.MEDCHAT);
    } else {
      handleBuyTokens();
    }
  };

  const handleBuyTokens = () => {
    try {
      navigation.navigate(ROUTES.TOKENS);
    } catch (error) {
      console.error('Error navigating to Tokens:', error);
    }
  };

  const handleBack = () => {
    navigation.canGoBack()
      ? navigation.goBack()
      : navigation.navigate(ROUTES.HOME);
  };

  const renderChatItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        {backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF'},
        {width: width > 600 ? width * 0.8 : width - 32},
      ]}
      onPress={() => handleChatPress(item)}>
      <View style={styles.chatContent}>
        <View style={styles.chatIcon}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            style={styles.iconGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
          </LinearGradient>
        </View>
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text
              style={[
                styles.chatTitle,
                {color: isDark ? '#FFFFFF' : '#000000'},
              ]}
              numberOfLines={1}>
              {item.title}
            </Text>
            <Text
              style={[
                styles.chatTime,
                {color: isDark ? '#AAAAAA' : '#666666'},
              ]}>
              {formatDate(item.timestamp)}
            </Text>
          </View>
          <Text
            style={[
              styles.chatMessage,
              {color: isDark ? '#CCCCCC' : '#666666'},
            ]}
            numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isComingSoon) {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: isDark ? '#121212' : '#F5F7FA'},
        ]}>
        {/* Header */}
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.header, {paddingTop: height * 0.05}]}>
          <View style={styles.headerContent}>
            <View>
              <Text
                style={[styles.headerTitle, {fontSize: width > 600 ? 28 : 24}]}>
                MedTalk AI
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  {fontSize: width > 600 ? 16 : 14},
                ]}>
                Your medical assistant
              </Text>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Coming Soon Content */}
        <View style={styles.comingSoonContainer}>
          <Ionicons
            name="time-outline"
            size={width > 600 ? 120 : 100}
            color={isDark ? '#4F46E5' : '#7C3AED'}
          />
          <Text
            style={[
              styles.comingSoonTitle,
              {color: isDark ? '#FFFFFF' : '#000000'},
              {fontSize: width > 600 ? 32 : 28},
            ]}>
            Coming Soon!
          </Text>
          <Text
            style={[
              styles.comingSoonText,
              {color: isDark ? '#AAAAAA' : '#666666'},
              {fontSize: width > 600 ? 18 : 16},
            ]}>
            We're working hard to bring you MedTalk AI, your personal medical
            assistant.
          </Text>
          <Text
            style={[
              styles.comingSoonSubtext,
              {color: isDark ? '#AAAAAA' : '#666666'},
              {fontSize: width > 600 ? 16 : 14},
            ]}>
            Stay tuned for updates!
          </Text>

          <TouchableOpacity
            style={[
              styles.backHomeButton,
              {width: width > 600 ? width * 0.3 : width * 0.5},
            ]}
            onPress={handleBack}>
            <Text style={styles.backHomeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDark ? '#121212' : '#F5F7FA'},
      ]}>
      {/* Header */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.header, {paddingTop: height * 0.05}]}>
        <View style={styles.headerContent}>
          <View>
            <Text
              style={[styles.headerTitle, {fontSize: width > 600 ? 28 : 24}]}>
              MedTalk AI
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                {fontSize: width > 600 ? 16 : 14},
              ]}>
              Your medical assistant
            </Text>
          </View>
          <TouchableOpacity
            style={styles.tokenContainer}
            onPress={handleBuyTokens}>
            <View style={styles.tokenBadge}>
              <Ionicons name="flash" size={16} color="#FFFFFF" />
              <Text style={styles.tokenText}>{tokens}</Text>
            </View>
            <Text style={styles.buyText}>Buy Tokens</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Chat List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text
            style={[
              styles.loadingText,
              {color: isDark ? '#FFFFFF' : '#000000'},
            ]}>
            Loading conversations...
          </Text>
        </View>
      ) : chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.chatList,
            {alignItems: width > 600 ? 'center' : 'stretch'},
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={width > 600 ? 100 : 80}
            color={isDark ? '#333333' : '#DDDDDD'}
          />
          <Text
            style={[
              styles.emptyTitle,
              {color: isDark ? '#FFFFFF' : '#000000'},
              {fontSize: width > 600 ? 24 : 20},
            ]}>
            No conversations yet
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              {color: isDark ? '#AAAAAA' : '#666666'},
              {fontSize: width > 600 ? 18 : 16},
            ]}>
            {tokens > 0
              ? 'Start a new chat with MedTalk AI to get medical information and advice'
              : 'Purchase tokens to start conversations with MedTalk AI for medical information and advice'}
          </Text>
          {tokens === 0 && (
            <TouchableOpacity
              style={[
                styles.buyTokensButton,
                {width: width > 600 ? width * 0.3 : width * 0.5},
              ]}
              onPress={handleBuyTokens}>
              <Text style={styles.buyTokensButtonText}>Buy Tokens</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* New Chat Button */}
      <TouchableOpacity
        style={[
          styles.newChatButton,
          {bottom: height * 0.03, right: width * 0.05},
        ]}
        onPress={handleNewChat}>
        {tokens > 0 ? (
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            style={styles.newChatGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Ionicons
                name="add"
                size={width > 600 ? 32 : 28}
                color="#FFFFFF"
              />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: width > 600 ? 18 : 16,
                  fontWeight: 'bold',
                }}>
                New Chat
              </Text>
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.buyTokensButton}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Ionicons
                name="flash"
                size={width > 600 ? 28 : 24}
                color="#FFFFFF"
              />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: width > 600 ? 18 : 16,
                  fontWeight: 'bold',
                }}>
                Buy Tokens
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  tokenContainer: {
    alignItems: 'center',
  },
  tokenBadge: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  tokenText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  buyText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  chatList: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatContent: {
    flexDirection: 'row',
    flex: 1,
  },
  chatIcon: {
    marginRight: 12,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
  },
  chatMessage: {
    fontSize: 14,
  },
  newChatButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  newChatGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  buyTokensButton: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyTokensButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Coming Soon styles
  backButton: {
    padding: 8,
  },
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  comingSoonSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    fontStyle: 'italic',
  },
  backHomeButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backHomeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MedTalkIndex;
