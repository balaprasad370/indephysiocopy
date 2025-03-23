import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Switch,
  FlatList,
  SafeAreaView,
  Platform,
  Linking,
  Animated,
  StatusBar,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Action from 'react-native-vector-icons/SimpleLineIcons';
import Download from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Cross from 'react-native-vector-icons/Entypo';
import UserIcon from 'react-native-vector-icons/FontAwesome';
// import user from '../../Constants';
import CourseCard from '../../Components/CourseCard/Index';
import Menu from '../../Components/Menu/Index';
import Tasks from '../../Components/Tasks/Index';
import DocumentCard from '../../Components/DocumentCard/Index';
import ProfileLevel from '../../Components/ProfileLevel/index';
import {AppContext} from '../../theme/AppContext';
import scale from '../../utils/utils';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import ProgressNotification from '../../Components/ProgressNotification/Index';

import styles from './dashboardCss';
import {ROUTES} from '../../Constants/routes';
import notifee from '@notifee/react-native';
import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';
import color from '../../Constants/color';
import registerImage from '../../assets/registeredIcon.png';
import axios from 'axios';
import iconImage from '../../assets/scorecard.png';
import lockImage from '../../assets/lock.png';
import liveclass from '../../assets/live.png';

import mock from '../../assets/mock.png';
import docs from '../../assets/doc.png';
import book from '../../assets/book.png';
import LastComponent from './LastComponent';
import CurrentStatusComponent from './CurrentStatusComponent';
import Notfications from '../Notifications/Index';

import Information from '../../Components/Information/Index';
import Optional from '../../Components/Information/Optional';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import AppUpdate from './AppUpdate';
import {checkforUpdate} from '../../Components/CheckForUpdate/CheckForUpdate';
import {getFcmToken, registerListenerWithFCM} from '../../utils/fcm';
import LinearGradient from 'react-native-linear-gradient';
import SubscriptionExpiry from '..//SubscriptionExpiry/Index';
import LottieView from 'lottie-react-native';
import Tabs from '../../Components/Dashboard/Tabs';

const storage = new MMKVLoader().initialize();
const Index = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [informationData, setInformationData] = useState();

  const [optionalData, setOptionalData] = useState();

  const [isNotification, setIsNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');

  const [isAdmin, setisAdmin] = useState(null);

  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      try {
        if (remoteMessage?.notification) {
          setIsNotification(true);
          setNotificationTitle(remoteMessage?.notification?.title);
          setNotificationBody(remoteMessage?.notification?.body);
          const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
          });
        }
      } catch (error) {
        // console.log('index.js file error', error);
      }
    });

    return unsubscribe;
  }, []);

  const getIsAdmin = async () => {
    const _isAdmin = await storage.getStringAsync('isAdmin');
    setisAdmin(_isAdmin);
  };

  const storeDeviceInfo = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const androidId = await DeviceInfo.getAndroidId();
      const brand = await DeviceInfo.getBrand();
      const deviceId = await DeviceInfo.getDeviceId();
      const deviceName = await DeviceInfo.getDeviceName();
      const firstInstallTime = await DeviceInfo.getFirstInstallTime();
      const ipAddress = await DeviceInfo.getIpAddress();
      const lastUpdateTime = await DeviceInfo.getLastUpdateTime();
      const macAddress = await DeviceInfo.getMacAddress();
      const maxMemory = await DeviceInfo.getMaxMemory();
      // const isLowRamDevice = await DeviceInfo.isLowRamDevice();
      const isTablet = await DeviceInfo.isTablet();
      const deviceToken = await messaging().getToken();

      // const systemInfo = (await DeviceInfo.getSystemInfo()) || 0;

      // const isLowRamDevice = systemInfo.lowRam;
      let isLowRamDevice = 0;

      // Sending the device info to the backend
      await axios.post(
        `${path}/store-device-info`,
        {
          androidId,
          brand,
          deviceId,
          deviceName,
          firstInstallTime,
          ipAddress,
          lastUpdateTime,
          macAddress,
          maxMemory,
          isLowRamDevice,
          isTablet,
          deviceToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Device info stored successfully');
    } catch (error) {
      console.log(
        'Error storing device info: main index.js file',
        error?.response?.data || error.message,
      );
    }
  };

  const cloudMessaging = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const deviceToken = await messaging().getToken();
        if (deviceToken && token) {
          const response = await axios.post(
            `${path}/admin/v1/cloudMessaging`,
            {
              deviceToken: deviceToken,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
        console.log('Done');
      } catch (error) {
        console.log(
          'Error from cloud messaging:',
          error.response ? error.response.data : error.message,
        );
      }
    }
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const getInformation = async () => {
    const token = await storage.getStringAsync('token');

    if (token) {
      try {
        const response = await axios.get(`${path}/admin/v1/information`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const informationData = response.data.data;

        const optionalData = informationData.filter(
          item => item.type === 'optional',
        );
        const strictData = informationData.filter(
          item => item.type === 'strict',
        );

        // Set the filtered data to state
        setOptionalData(optionalData);
        setInformationData(strictData);
      } catch (error) {
        console.log('error occurred from getInformation:', error);
      }
    }
  };

  const getWebinar = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(`${path}/admin/v1/webinar`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const webinarData = response.data.data;
        setWebinar(webinarData);
        if (webinarData.modal_status === 1) {
          setAdVisible(true);
        }
      } catch (error) {
        setWebinar('');
        // console.log('error occurred from getInformation:', error);
      }
    }
  };

  const {
    isDark,
    setIsDark,
    userData,
    documentStatus,
    path,
    setDocumentStatus,
    packageId,
    clientId,
    levelId,
  } = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  let locked = true;

  const [isAdVisible, setAdVisible] = useState(false);

  const toggleAd = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.post(
        `${path}/admin/v1/update-modal-status`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAdVisible(!isAdVisible);
    } catch (error) {
      console.log('Error updating the status of the webinar', error);
    }
  };

  const [data, setData] = useState();
  const [webinar, setWebinar] = useState('');

  const getChapterStatus = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const res = await axios({
        method: 'get',
        url: `${path}/chapter/v5/student/status`,
        params: {
          level_id: levelId,
          client_id: clientId,
          package_id: packageId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const downloadButtonScale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(downloadButtonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(downloadButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const deviceInformation = async () => {
    const token = await storage.getStringAsync('token');
    if (!token) {
      console.log('Token is missing. Redirecting to login.');
      return;
    }

    const deviceInfo =
      Platform.OS === 'android'
        ? 'Android'
        : Platform.OS === 'ios'
        ? 'iOS'
        : 'unknown';
    const appVersion =
      Platform.OS === 'android' || Platform.OS === 'ios'
        ? DeviceInfo.getVersion()
        : null;

    try {
      const response = await axios.post(
        `${path}/admin/v1/deviceInfo`,
        {deviceInfo, appVersion},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Device information stored successfully:', response.data);
    } catch (error) {
      console.log(
        'Error storing device information:',
        error.response?.data || error.message,
      );
    }
  };

  const [isSingleNotification, setIsSingleNotification] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const notificationData = async () => {
    const token = await storage.getStringAsync('token');
    if (!token) {
      console.log('Authorization token is missing. notificationData');
      return;
    }
    try {
      const response = await axios.get(`${path}/admin/v1/single-notification`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setIsSingleNotification(response.data.notification);
      if (response?.data?.notification?.isModal == 1) {
        setIsModalVisible(true);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const notificationUpdate = async notificationId => {
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.post(
        `${path}/admin/v1/update-single-notification`,
        {notificationId},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  const [notificationCount, setNotificationCount] = useState(1);

  const notificationCountFunction = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.get(`${path}/admin/v1/notification-count`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setNotificationCount(response?.data?.unreadCount);
    } catch (error) {
      console.log('error', error);
    }
  };
  //noted
  const [subscriptionExpiryStatus, setSubscriptionExpiryStatus] =
    useState(false);
  const getSubscriptionExpiry = async () => {
    const token = await storage.getStringAsync('token');
    if (!token) {
      console.log('Authorization token is missing. getSubscriptionExpiry');
      return;
    }
    try {
      const response = await axios.get(
        `${path}/admin/v2/subscription-timestamp`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('dfbfg', response?.data);
      setSubscriptionExpiryStatus(response?.data?.expired);
    } catch (error) {
      console.log('errors', error?.response?.data || error?.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('jbg');
      // getSubscriptionExpiry();

      storeDeviceInfo();
      notificationCountFunction();
      notificationData();
      getWebinar();
      deviceInformation();
      checkforUpdate();
      cloudMessaging();
      getIsAdmin();
      setRendered(!rendered);
    });
    return unsubscribe;
  }, []);

  const renderItem = ({item}) => {
    return (
      <SafeAreaView
        className="min-h-screen"
        style={{position: 'relative', flex: 1, width: '100%', height: '100%'}}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: -1,
          }}>
          <LottieView
            source={{
              uri: 'https://lottie.host/8c5b5a42-228d-40a1-be1f-88e586dd4c98/sB2gF4vRJk.json',
            }}
            autoPlay
            loop
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
            // imageStyle={{opacity: 0.8}}
          />
        </View>

        <StatusBar backgroundColor={'#613BFF'} />

        {Platform.OS === 'android' || (Platform.OS === 'ios' && <AppUpdate />)}
        <View className="flex flex-row justify-between items-center p-4">
          <View>
            <Text className="text-md font-bold text-white ">Welcome back</Text>
            <Text className="text-lg font-semibold text-white capitalize">
              {userData
                ? `${userData.first_name} ${userData.last_name}`.length > 20
                  ? `${userData.first_name} ${userData.last_name}`.slice(
                      0,
                      20,
                    ) + '...'
                  : `${userData.first_name} ${userData.last_name}`
                : null}
            </Text>
            <View className="flex flex-row items-center">
              {documentStatus && documentStatus === 2 && (
                <View className="bg-green-100 p-1 rounded-full mr-2">
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                </View>
              )}
              <Text className="text-sm text-white">
                {documentStatus && documentStatus === 2
                  ? 'Registered'
                  : 'Not Registered'}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center">
            <View className="relative">
              <TouchableOpacity
                className="mr-2"
                onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}>
                <Ionicons name="notifications" size={32} color="white" />
              </TouchableOpacity>
              {notificationCount > 0 ? (
                <View className="absolute right-2 top-0 bg-darkPrimary rounded-full px-2 py-1">
                  <Text className="text-xs text-white">
                    {notificationCount}
                  </Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              onPress={() => navigation.openDrawer()}
              className="pr-3">
              <Image
                source={
                  userData && userData?.profile_pic
                    ? {
                        uri: `https://d2c9u2e33z36pz.cloudfront.net/${userData?.profile_pic}`,
                      }
                    : {
                        uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                      }
                }
                className="w-14 h-14 rounded-full"
              />
            </TouchableOpacity>
          </View>
        </View>

        {userData && (userData?.is_admin == 1 || isAdmin === 'true') && (
          <TouchableOpacity
            className="bg-p1 p-2 mr-2 rounded-lg w-32 mt-2 self-end"
            onPress={() => navigation.navigate(ROUTES.STUDENT_ACCESS)}>
            <Text className="text-white font-bold text-center">
              Student Access
            </Text>
          </TouchableOpacity>
        )}

        {webinar && (
          <Information webinar={webinar} setAdVisible={setAdVisible} />
        )}
        {isSingleNotification && (
          <Information
            webinar={isSingleNotification}
            setAdVisible={setIsModalVisible}
          />
        )}

        {/* //continue progress notification   */}

        <ProgressNotification />

        {/* 
        <View className="flex flex-row justify-center items-center">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.SAMPLE_QUIZ, {
                // module_id: 386,
                module_id: 4985,
              })
            }>
            <Text className="text-p1 font-bold text-base">Mock Test</Text>
          </TouchableOpacity>
        </View> */}

        <Tabs />

        {webinar && isAdVisible ? (
          <Modal
            transparent={true}
            visible={isAdVisible}
            animationType="fade"
            onRequestClose={toggleAd}>
            <View className="flex-1 bg-black/40 justify-center items-center">
              <View className="flex justify-center items-center w-11/12 h-4/5 rounded-lg overflow-hidden">
                {webinar.web_type == 1 ? (
                  <>
                    {webinar?.webinar_image_url ? (
                      <TouchableOpacity
                        className="flex mt-20 items-center justify-center p-2"
                        onPress={() => {
                          Linking.openURL(webinar?.webinar_url);
                          setAdVisible(false);
                        }}>
                        {webinar?.webinar_image_url ? (
                          <Image
                            source={{uri: webinar?.webinar_image_url}}
                            className="w-full h-auto aspect-square resize-contain"
                          />
                        ) : null}
                      </TouchableOpacity>
                    ) : (
                      <LinearGradient
                        colors={['#133E87', '#5B99C2', '#87A2FF']}
                        className="absolute w-full rounded-lg p-3">
                        <TouchableOpacity
                          className="flex self-end w-10 z-10"
                          onPress={toggleAd}>
                          <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                        <View className="absolute w-52 h-52 bg-white/10 rounded-full top-[-30px] right-[-30px]" />
                        <View className="absolute w-36 h-36 bg-white/10 rounded-full bottom-[-40px] left-[-40px]" />
                        <View className="mb-5 items-center z-10">
                          <Text className="text-xl font-bold text-white text-center mb-2 shadow-black/30 shadow-md">
                            {webinar?.title}
                          </Text>
                          <Text className="text-base text-white text-center opacity-90 px-2">
                            {webinar?.description}
                          </Text>
                        </View>
                        <Animated.View
                          className="z-10 flex justify-center items-center"
                          style={{
                            transform: [{scale: downloadButtonScale}],
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(webinar?.webinar_url);
                              setAdVisible(false);
                            }}
                            className="flex-row items-center bg-blue-500 p-3 rounded-lg shadow-blue-500/50 shadow-md">
                            <Text className="text-white text-lg font-semibold mr-2">
                              Click here
                            </Text>
                            <Action
                              name="action-redo"
                              size={24}
                              color="white"
                            />
                          </TouchableOpacity>
                        </Animated.View>
                      </LinearGradient>
                    )}
                  </>
                ) : webinar.web_type == 2 ? (
                  <>
                    <LinearGradient
                      colors={['#133E87', '#5B99C2', '#87A2FF']}
                      className="absolute w-full rounded-lg p-3">
                      <TouchableOpacity
                        className="flex self-end w-10 z-10"
                        onPress={toggleAd}>
                        <Ionicons name="close" size={20} color="white" />
                      </TouchableOpacity>
                      <View className="absolute w-52 h-52 bg-white/10 rounded-full top-[-30px] right-[-30px]" />
                      <View className="absolute w-36 h-36 bg-white/10 rounded-full bottom-[-40px] left-[-40px]" />
                      <View className="mb-5 items-center z-10">
                        <Text className="text-xl font-bold text-white text-center mb-2 shadow-black/30 shadow-md">
                          {webinar?.title}
                        </Text>
                        <Text className="text-base text-white text-center opacity-90 px-2">
                          {webinar?.description}
                        </Text>
                      </View>
                      <Animated.View
                        className="z-10 flex justify-center items-center"
                        style={{
                          transform: [{scale: downloadButtonScale}],
                        }}>
                        <TouchableOpacity
                          onPressIn={handlePressIn}
                          onPressOut={handlePressOut}
                          className="w-36 flex-row justify-center items-center bg-blue-500 p-3 rounded-full shadow-md">
                          <Text className="text-white text-lg font-bold mr-2">
                            Download
                          </Text>
                          <Download name="download" size={24} color="white" />
                        </TouchableOpacity>
                      </Animated.View>
                    </LinearGradient>
                  </>
                ) : webinar?.web_type == 0 ? (
                  <>
                    {webinar?.webinar_image_url ? (
                      <TouchableOpacity
                        className="flex mt-20 items-center justify-center p-2"
                        onPress={() => {
                          navigation.navigate('Meeting', {
                            room: webinar.webinar_url,
                          });
                          setAdVisible(false);
                        }}>
                        {webinar?.webinar_image_url ? (
                          <Image
                            source={{uri: webinar?.webinar_image_url}}
                            className="w-full h-auto aspect-square resize-contain"
                          />
                        ) : null}
                      </TouchableOpacity>
                    ) : (
                      <LinearGradient
                        colors={['#133E87', '#5B99C2', '#87A2FF']}
                        className="absolute w-full rounded-lg p-3">
                        <TouchableOpacity
                          className="flex self-end w-10 z-10"
                          onPress={toggleAd}>
                          <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                        <View className="absolute w-52 h-52 bg-white/10 rounded-full top-[-30px] right-[-30px]" />
                        <View className="absolute w-36 h-36 bg-white/10 rounded-full bottom-[-40px] left-[-40px]" />
                        <View className="mb-5 items-center z-10">
                          <Text className="text-xl font-bold text-white text-center mb-2 shadow-black/30 shadow-md">
                            {webinar?.title}
                          </Text>
                          <Text className="text-base text-white text-center opacity-90 px-2">
                            {webinar?.description}
                          </Text>
                        </View>
                        <Animated.View
                          className="z-10 flex justify-center items-center"
                          style={{
                            transform: [{scale: downloadButtonScale}],
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('Meeting', {
                                room: webinar.webinar_url,
                              });
                              setAdVisible(false);
                            }}
                            className="flex-row items-center bg-blue-500 p-3 rounded-lg shadow-blue-500/50 shadow-md">
                            <Text className="text-white text-lg font-semibold mr-2">
                              Join Now
                            </Text>
                            <Action
                              name="action-redo"
                              size={24}
                              color="white"
                            />
                          </TouchableOpacity>
                        </Animated.View>
                      </LinearGradient>
                    )}
                  </>
                ) : null}
              </View>
            </View>
          </Modal>
        ) : null}

        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => {
            setIsModalVisible(false);
          }}>
          <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="flex justify-center items-center w-11/12 h-4/5 rounded-lg overflow-hidden">
              <LinearGradient
                colors={['#133E87', '#5B99C2', '#87A2FF']}
                className="absolute w-full rounded-lg p-3">
                <TouchableOpacity
                  className="flex self-end w-10 z-10"
                  onPress={() => {
                    notificationUpdate(isSingleNotification?.notification_id);
                    setIsModalVisible(false);
                  }}>
                  <Ionicons name="close" size={26} color="white" />
                </TouchableOpacity>
                <View className="absolute w-52 h-52 bg-white/10 rounded-full top-[-30px] right-[-30px]" />
                <View className="absolute w-36 h-36 bg-white/10 rounded-full bottom-[-40px] left-[-40px]" />
                <View className="mb-5 items-center z-10">
                  <Text className="text-xl font-bold text-white text-center mb-2 shadow-black/30 shadow-md">
                    {isSingleNotification?.title}
                  </Text>
                  <Text className="text-base text-white text-center opacity-90 px-2">
                    {isSingleNotification?.description}
                  </Text>
                </View>
                <Animated.View
                  className="z-10 flex justify-center items-center"
                  style={{
                    transform: [{scale: downloadButtonScale}],
                  }}>
                  <TouchableOpacity
                    onPress={
                      isSingleNotification?.notification_type == 0
                        ? () => {
                            navigation.navigate('Meeting', {
                              room: isSingleNotification?.notification_url,
                            });
                            notificationUpdate(
                              isSingleNotification?.notification_id,
                            );
                            setIsModalVisible(false);
                          }
                        : () => {
                            console.log(
                              'isSingleNotification?.notification_url',
                              isSingleNotification?.notification_url,
                            );

                            try {
                              notificationUpdate(
                                isSingleNotification?.notification_id,
                              );
                              Linking.openURL(
                                isSingleNotification?.notification_url,
                              );
                              setIsModalVisible(false);
                            } catch (error) {
                              // console.log('error', error);
                            }
                          }
                    }
                    className="flex-row items-center bg-blue-500 p-3 rounded-lg shadow-blue-500/50 shadow-md">
                    <Text className="text-white text-lg font-semibold mr-2">
                      Click here
                    </Text>
                    <Action name="action-redo" size={24} color="white" />
                  </TouchableOpacity>
                </Animated.View>
              </LinearGradient>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  };

  return (
    <FlatList
      data={[{key: 'renderItem'}]}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      className="bg-white dark:bg-n75"
      showsVerticalScrollIndicator={false}
    />
  );
};

const styled = StyleSheet.create({
  adOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden', // Ensures rounded corners
  },
  adImage: {
    width: '100%',

    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    display: 'flex',
    alignSelf: 'flex-end',
    width: 30,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Index;
