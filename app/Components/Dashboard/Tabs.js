import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Linking,
} from 'react-native';
import {AppContext} from '../../theme/AppContext';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Level from './Level';
import LottieView from 'lottie-react-native';
import {ROUTES} from './../../Constants/routes';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
const Tabs = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(1);
  const [message, setMessage] = useState('');
  const {isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  // Dummy data for registration status
  const [isRegistered, setIsRegistered] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(new Date());
  useEffect(() => {
    getRegistrationTabData();
  }, []);

  const getRegistrationTabData = async () => {
    try {
      const response = await axiosInstance.get(
        '/profile/user/registration-tab',
      );
      // console.log('Registration tab response:', response);
      // console.log('Registration tab data:', response.data);

      setIsRegistered(response.data?.status);
      setMessage(response.data?.message);
      setSubscriptionExpiry(new Date(response.data?.subscriptionExpiry));
    } catch (error) {
      console.log('Error object:', error);
      console.error(
        'Error fetching registration tab data:',
        error?.response?.data || error.message || error,
      );
    }
  };

  const tabs = [
    {
      label: 'Registration Status',
      value: 'registration',
      icon: 'clipboard-outline',
      color: '#4CAF50',
    },
    {
      label: 'Services',
      value: 'services',
      icon: 'grid-outline',
      color: '#FFC107',
    },
    {
      label: 'My Journey',
      value: 'profile',
      icon: 'person-outline',
      color: '#2196F3',
    },
  ];

  const services = [
    {
      id: '1',
      name: 'Self Learn',
      icon: 'book-outline',
      color: '#4CAF50',
      route: ROUTES.SELF_LEARN,
    },
    {
      id: '2',
      name: 'Live Classes',
      icon: 'videocam-outline',
      color: '#2196F3',
      route: ROUTES.LIVE_CLASS,
    },
    {
      id: '3',
      name: 'Leaderboard',
      icon: 'trophy-outline',
      color: '#FFC107',
      route: ROUTES.GLOBAL_LEADERBOARD,
    },

    {
      id: '4',
      name: 'Subscriptions',
      icon: 'card-outline',
      color: '#FF5722',
      route: ROUTES.SUBSCRIPTIONS,
    },
    {
      id: '5',
      name: 'Translations',
      icon: 'language-outline',
      color: '#00BCD4',
      route: ROUTES.TRANSLATIONS,
    },
    {
      id: '6',
      name: 'Resumes',
      icon: 'document-text-outline',
      color: '#795548',
      route: ROUTES.RESUMES,
    },
    {
      id: '7',
      name: 'FAQ',
      icon: 'help-circle-outline',
      color: '#9C27B0',
      route: ROUTES.FAQ,
    },
    {
      id: '8',
      name: 'Help',
      icon: 'information-circle-outline',
      color: '#3F51B5',
      route: ROUTES.HELP,
    },
    {
      id: '9',
      name: 'Support',
      icon: 'headset-outline',
      color: '#E91E63',
      route: ROUTES.SUPPORT,
    },
  ];

  const handleTabPress = index => {
    setActiveTab(index);
  };

  const renderServiceItem = ({item}) => (
    <TouchableOpacity
      className="flex-1 m-2 rounded-xl overflow-hidden"
      onPress={() => {
        navigation.navigate(item.route);
      }}
      style={{
        minWidth: '28%',
        maxWidth: '28%',
        aspectRatio: 1,
      }}>
      <LinearGradient
        colors={[item.color, '#1A1A1A']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        className="w-full h-full justify-center items-center p-3">
        <View className="items-center">
          <Ionicons
            name={item.icon}
            size={32}
            color={isDark ? '#FFFFFF' : '#FFFFFF'}
            style={{
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }}
          />
          <Text
            className="text-center mt-2 font-medium text-white dark:text-white"
            numberOfLines={2}
            ellipsizeMode="tail">
            {item.name}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View className="p-4 rounded-lg shadow-sm">
            {isRegistered ? (
              <View className="items-center">
                <LottieView
                  source={{
                    uri: 'https://assets9.lottiefiles.com/packages/lf20_touohxv0.json',
                  }}
                  autoPlay
                  loop={false}
                  style={{width: 150, height: 150}}
                />
                <View className="flex-row items-center mb-3 mt-2">
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text className="text-white text-base ml-2 font-medium">
                    Registration Complete
                  </Text>
                </View>
                <Text className="text-white mb-2 text-center">
                  Your account has been successfully registered and verified.
                </Text>

                {subscriptionExpiry && (
                  <View className="mb-3 p-3 bg-green-100 dark:bg-green-900 rounded-lg w-full">
                    <Text className="text-green-800 dark:text-green-200 text-center">
                      Subscription valid until:{' '}
                      {moment(subscriptionExpiry).format('DD MMM, YYYY')}
                    </Text>
                  </View>
                )}

                <View className="mt-3 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg w-full">
                  <Text className="text-blue-800 dark:text-blue-200 font-bold text-center text-base mb-2">
                    Welcome to Your Professional Journey
                  </Text>
                  <Text className="text-blue-800 dark:text-blue-200 text-center mb-2">
                    Whether you're just starting your learning path, preparing
                    for your move, or already working in Germany, we're here to
                    support you at every stage.
                  </Text>
                  <Text className="text-blue-800 dark:text-blue-200 text-center">
                    Use our comprehensive resources to enhance your skills, stay
                    updated with industry trends, and continue your professional
                    development throughout your career.
                  </Text>
                </View>
              </View>
            ) : (
              <View className="items-center">
                <LottieView
                  source={{
                    uri: 'https://lottie.host/232d5d4a-9d1d-494b-857b-1dc269636af2/wB0Sla6kbo.json',
                  }}
                  autoPlay
                  loop
                  style={{width: 200, height: 200}}
                />
                <Text className="text-xl font-bold text-center text-white mb-3">
                  Complete Your Registration
                </Text>
                {message && (
                  <View className="mb-3 p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg w-full">
                    <Text className="text-yellow-800 dark:text-yellow-200 text-center">
                      Current Progress state : {message}
                    </Text>
                  </View>
                )}
                <Text className="text-white text-center mb-4">
                  Register now to unlock all features and services available in
                  the app. Take your learning experience to the next level!
                </Text>

                <TouchableOpacity
                  className="bg-p1 py-3 px-6 rounded-full"
                  onPress={() => {
                    Linking.openURL('https://portal.indephysio.com/sign-in');
                  }}>
                  <Text className="text-white font-bold">Register Now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 2:
        return (
          <View className="p-4">
            <Level />
          </View>
        );
      case 1:
        return (
          <View className="p-4  dark:bg-gray-800 rounded-lg shadow-sm">
            <Text className=" text-white text-lg font-semibold mb-4">
              Available Services
            </Text>
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={item => item.id}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 16}}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center w-full py-4 rounded-lg">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTabPress(index)}
            className="flex-1 mx-1 rounded-lg overflow-hidden"
            style={{
              minWidth: '30%',
              maxWidth: `${100 / tabs.length}%`,
              height: 150,
              transform: activeTab === index ? [{scale: 1.05}] : [{scale: 1}],
              zIndex: activeTab === index ? 1 : 0,
              elevation: activeTab === index ? 5 : 0,
            }}>
            <LinearGradient
              colors={[tab.color, activeTab === index ? tab.color : '#1A1A1A']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              className={`w-full h-full flex-col justify-around items-center py-3 px-2 ${
                activeTab === index ? 'border-2 border-white' : 'opacity-80'
              }`}>
              <Ionicons
                name={tab.icon}
                size={activeTab === index ? 32 : 28}
                color="#FFFFFF"
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                }}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={`text-sm font-medium text-white ${
                  activeTab === index ? 'font-bold' : ''
                }`}>
                {tab.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
      <View className="mt-3">{renderTabContent()}</View>
    </View>
  );
};

export default Tabs;
