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
  StatusBar
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
import StudentAccess from '../StudentAccess/StudentAccess';

const storage = new MMKVLoader().initialize();
const Index = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [informationData, setInformationData] = useState();

  const [optionalData, setOptionalData] = useState();

  const [isNotification, setIsNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  
  const [isAdmin, setisAdmin] = useState(null);



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
    const _isAdmin =  await storage.getStringAsync('isAdmin');
   setisAdmin(_isAdmin)
  }


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

  const courseData = [
    {
      locked: false,
      courseTitle: documentStatus === 2 ? 'Registered' : 'Not Registered',
      middleCourseCard: 'Approx D.O.R',
      plane: true,
      bottomCourseCard: '000€',
    },
    {
      locked: false,
      courseTitle: 'Referral Portal',
      middleCourseCard: 'My Euro Bank',
      refer: true,
      bottomCourseCard: '116🏚️',
    },
    {
      locked: true,
      courseTitle: 'Next Live Class',
      middleCourseCard: 'Anywhere in Germany',
      bottomCourseCard: 'Book Now',
    },
    {
      locked: true,
      courseTitle: 'Chapters',
      middleCourseCard: 'Dynamic date',
      bottomCourseCard: '33 days',
    },
  ];

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

  const [isSingleNotification, setIsSingleNotification] = useState();
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
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(false);
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
      console.log(response?.data);
      setSubscriptionExpiry(response?.data?.expired);
    } catch (error) {
      console.log('errors', error?.response?.data || error?.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      storeDeviceInfo();
      notificationCountFunction();
      getSubscriptionExpiry();
      notificationData();
      getWebinar();
      deviceInformation();
      checkforUpdate();
      cloudMessaging();
      getIsAdmin();
    });
    return unsubscribe;
  }, []);

  const renderItem = ({item}) => {
    return (
      <SafeAreaView>
        <StatusBar backgroundColor={isDark ? color.darkPrimary : color.lightPrimary} />
        {subscriptionExpiry ? (
          <Modal transparent={true} animationType="fade" visible={true}>
            <SubscriptionExpiry />
          </Modal>
        ) : null}
        
        {Platform.OS === 'android' || (Platform.OS === 'ios' && <AppUpdate />)}
        <View style={style.uppDash}>
          <View style={styles.textstyle}>
            <Text style={style.textWel}>Welcome back</Text>
            <Text style={[style.candName, {textTransform: 'capitalize'}]}>
              {userData
                ? `${userData.first_name} ${userData.last_name}`.length > 20
                  ? `${userData.first_name} ${userData.last_name}`.slice(
                      0,
                      20,
                    ) + '...'
                  : `${userData.first_name} ${userData.last_name}`
                : null}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image source={registerImage} />
              {/* <Icon name="crown-outline" style={style.crown} size={22} /> */}
              <Text style={style.registered}>
                {documentStatus && documentStatus === 2
                  ? 'Registered'
                  : 'Not Registered'}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{position: 'relative'}}>
              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}>
                <Ionicons name="notifications" size={32} color="black" />
              </TouchableOpacity>
              {notificationCount > 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: -8,
                    backgroundColor: color.darkPrimary,
                    borderRadius: 10,
                    paddingVertical: 2,
                    paddingHorizontal: 6,
                  }}>
                  <Text style={{fontSize: 10, color: 'white'}}>
                    {notificationCount}
                  </Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              onPress={() => navigation.openDrawer()}
              // onPress={() => navigation.navigate(ROUTES.PROFILE_SETTING)}
              style={{
                paddingRight: '3%',
              }}>
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
                style={{width: 55, height: 55, borderRadius: 27}}
              />
            </TouchableOpacity>
          </View>
        </View>

        {userData && (userData?.is_admin == 1 || isAdmin === "true") && (
          <TouchableOpacity
            style={{
              backgroundColor: color.darkPrimary,
              padding: scale(8),
              borderRadius: scale(8),
              width: 130,
              marginTop: 10,
              alignSelf: 'flex-end',
            }}
            onPress={() => navigation.navigate(ROUTES.STUDENT_ACCESS)}>
            <Text
              style={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>
              Student Access
            </Text>
          </TouchableOpacity>
        )}
        {/* <Notfications /> */}

        {/* <Information webinar={webinar} setAdVisible={setAdVisible} /> */}

        {webinar && (
          <Information webinar={webinar} setAdVisible={setAdVisible} />
        )}
        {isSingleNotification && (
          <Information
            webinar={isSingleNotification}
            setAdVisible={setIsModalVisible}
          />
        )}

        {/* <Optional optionalData={optionalData} />
        {data && data.chapter_id !== null && (
          <CurrentStatusComponent data={data} />
        )} */}
        {/* <LastComponent /> */}
        <FlatList
          data={courseData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <CourseCard
              locked={item.locked}
              courseTitle={item.courseTitle}
              toggleModal={toggleModal}
              middleCourseCard={item.middleCourseCard}
              plane={item.plane}
              refer={item.refer}
              bottomCourseCard={item.bottomCourseCard}
            />
          )}
          contentContainerStyle={{marginTop: 20}}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Menu
            name="Self Learn"
            iconImage={book}
            lock={lockImage}
            isLocked={false}
            ROUTE="Self learn"
            data={data}
          />
          <Menu
            name="Mock test"
            iconImage={mock}
            lock={lockImage}
            isLocked={true}
          />
          <Menu
            name="Live class"
            iconImage={liveclass}
            lock={lockImage}
            isLocked={false}
            ROUTE="Live"
          />
          <Menu
            name="Docs"
            iconImage={docs}
            lock={lockImage}
            isLocked={true}
            ROUTE="Documents"
          />
          <Menu
            name="Scorecard"
            iconImage={iconImage}
            lock={lockImage}
            isLocked={true}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}>
          <ScrollView style={style.modalDocument}>
            <View style={style.modalContent}>
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
                onPress={toggleModal}
                style={{display: 'flex', alignItems: 'flex-end'}}>
                <Cross name="cross" style={style.cross} />
              </TouchableOpacity>
            </View>
            <View style={styles.documentContainer}>
              <View>
                <Text style={style.buttonTab}>Documentation</Text>
                <Text style={style.modalStatus}>Status: Not started</Text>
              </View>
              <ScrollView
                style={{marginTop: 30, marginBottom: 10}}
                horizontal={true}>
                <DocumentCard isDone={(isDone = true)} />
                <DocumentCard />
                <DocumentCard />
              </ScrollView>
              <View style={{marginTop: 30}}>
                <Tasks name="Payments and Dues" />
                <Tasks name="Agreements" />
                <Tasks name="Request for Attestation" />
                <Tasks name="Software and App terms and agreement" />
              </View>
            </View>
          </ScrollView>
        </Modal>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: scale(14),
                color: 'black',
                fontWeight: 'bold',
              }}>
              Pathway: {userData?.package}
              {/* Pathway: Professionals */}
            </Text>
            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              onPress={() => navigation.navigate(ROUTES.REGULAR)}
              style={{
                backgroundColor: color.darkPrimary,
                padding: scale(8),
                borderRadius: scale(8),
              }}>
              <Text
                style={{
                  fontSize: scale(11),
                  color: 'white',
                  textAlign: 'center',
                }}>
                Check Regular Pathway
              </Text>
            </TouchableOpacity>
          </View>

          <ProfileLevel />
        </View>
        {webinar && isAdVisible ? (
          <Modal
            transparent={true}
            visible={isAdVisible}
            animationType="fade"
            onRequestClose={toggleAd}>
            <View style={styled.adOverlay}>
              {/* <TouchableOpacity style={styled.closeButton} onPress={toggleAd}>
                <Ionicons name="close" size={26} color="black" />
              </TouchableOpacity> */}
              <View style={styled.adContainer}>
                {webinar.web_type == 1 ? (
                  <>
                    {webinar?.webinar_image_url ? (
                      <TouchableOpacity
                        style={{
                          display: 'flex',
                          marginTop: '20%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 10,
                        }}
                        onPress={() => {
                          Linking.openURL(webinar?.webinar_url);
                          setAdVisible(false);
                        }}>
                        {webinar?.webinar_image_url ? (
                          <Image
                            source={{uri: webinar?.webinar_image_url}}
                            style={{
                              width: '100%',
                              height: undefined,
                              aspectRatio: 1,
                              resizeMode: 'contain',
                            }}
                          />
                        ) : null}
                      </TouchableOpacity>
                    ) : (
                      <LinearGradient
                        colors={['#133E87', '#5B99C2', '#87A2FF']}
                        // colors={['#4e54c8', '#8f94fb']}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          borderRadius: 20,
                          padding: 12,
                          // justifyContent: 'center',
                          // alignItems: 'center',
                        }}>
                        {/* <View
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'flex-end',
                          }}> */}
                        <TouchableOpacity
                          style={styled.closeButton}
                          onPress={toggleAd}>
                          <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                        {/* </View> */}
                        <View
                          style={{
                            position: 'absolute',
                            width: 200,
                            height: 200,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 100,
                            top: -30,
                            right: -30,
                          }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            width: 150,
                            height: 150,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 75,
                            bottom: -40,
                            left: -40,
                          }}
                        />
                        <View
                          style={{
                            marginBottom: 20,
                            alignItems: 'center',
                            zIndex: 1,
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 'bold',
                              color: 'white',
                              textAlign: 'center',
                              marginBottom: 8,
                              textShadowColor: 'rgba(0, 0, 0, 0.3)',
                              textShadowOffset: {width: 1, height: 1},
                              textShadowRadius: 2,
                            }}>
                            {webinar?.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'white',
                              textAlign: 'center',
                              opacity: 0.9,
                              paddingHorizontal: 10,
                            }}>
                            {webinar?.description}
                          </Text>
                        </View>
                        <Animated.View
                          style={{
                            transform: [{scale: downloadButtonScale}],
                            zIndex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(webinar?.webinar_url);
                              setAdVisible(false);
                            }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: '#1e90ff', // Light blue for the button
                              paddingVertical: 12,
                              paddingHorizontal: 24,
                              borderRadius: 10,
                              shadowColor: '#1e90ff',
                              shadowOffset: {width: 0, height: 5},
                              shadowOpacity: 0.4,
                              shadowRadius: 6,
                              elevation: 8,
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 18,
                                fontWeight: '600',
                                marginRight: 10,
                              }}>
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
                      // colors={['#4e54c8', '#8f94fb']}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        borderRadius: 20,
                        padding: 12,
                        // justifyContent: 'center',
                        // alignItems: 'center',
                      }}>
                      {/* <View
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'flex-end',
                        }}> */}
                      <TouchableOpacity
                        style={styled.closeButton}
                        onPress={toggleAd}>
                        <Ionicons name="close" size={20} color="white" />
                      </TouchableOpacity>
                      {/* </View> */}
                      <View
                        style={{
                          position: 'absolute',
                          width: 200,
                          height: 200,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 100,
                          top: -30,
                          right: -30,
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          width: 150,
                          height: 150,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 75,
                          bottom: -40,
                          left: -40,
                        }}
                      />
                      <View
                        style={{
                          marginBottom: 20,
                          alignItems: 'center',
                          zIndex: 1,
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: 8,
                            textShadowColor: 'rgba(0, 0, 0, 0.3)',
                            textShadowOffset: {width: 1, height: 1},
                            textShadowRadius: 2,
                          }}>
                          {webinar?.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'white',
                            textAlign: 'center',
                            opacity: 0.9,
                            paddingHorizontal: 10,
                          }}>
                          {webinar?.description}
                        </Text>
                      </View>
                      <Animated.View
                        style={{
                          transform: [{scale: downloadButtonScale}],
                          zIndex: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <TouchableOpacity
                          onPressIn={handlePressIn}
                          onPressOut={handlePressOut}
                          style={{
                            width: 150,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#1e90ff',
                            paddingVertical: 12,
                            paddingHorizontal: 25,
                            borderRadius: 25,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 6},
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 5,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 18,
                              marginRight: 8,
                              fontWeight: 'bold',
                            }}>
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
                        style={{
                          display: 'flex',
                          marginTop: '20%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 10,
                        }}
                        onPress={() => {
                          navigation.navigate('Meeting', {
                            room: webinar.webinar_url,
                          });
                          setAdVisible(false);
                        }}>
                        {webinar?.webinar_image_url ? (
                          <Image
                            source={{uri: webinar?.webinar_image_url}}
                            style={{
                              width: '100%',
                              height: undefined,
                              aspectRatio: 1,
                              resizeMode: 'contain',
                            }}
                          />
                        ) : null}
                      </TouchableOpacity>
                    ) : (
                      <LinearGradient
                        colors={['#133E87', '#5B99C2', '#87A2FF']}
                        // colors={['#4e54c8', '#8f94fb']}
                        style={{
                          position: 'absolute',
                          width: '100%',
                          borderRadius: 20,
                          padding: 12,
                          // justifyContent: 'center',
                          // alignItems: 'center',
                        }}>
                        {/* <View
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'flex-end',
                          }}> */}
                        <TouchableOpacity
                          style={styled.closeButton}
                          onPress={toggleAd}>
                          <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>
                        {/* </View> */}
                        <View
                          style={{
                            position: 'absolute',
                            width: 200,
                            height: 200,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 100,
                            top: -30,
                            right: -30,
                          }}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            width: 150,
                            height: 150,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 75,
                            bottom: -40,
                            left: -40,
                          }}
                        />
                        <View
                          style={{
                            marginBottom: 20,
                            alignItems: 'center',
                            zIndex: 1,
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: 'bold',
                              color: 'white',
                              textAlign: 'center',
                              marginBottom: 8,
                              textShadowColor: 'rgba(0, 0, 0, 0.3)',
                              textShadowOffset: {width: 1, height: 1},
                              textShadowRadius: 2,
                            }}>
                            {webinar?.title}
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: 'white',
                              textAlign: 'center',
                              opacity: 0.9,
                              paddingHorizontal: 10,
                            }}>
                            {webinar?.description}
                          </Text>
                        </View>
                        <Animated.View
                          style={{
                            transform: [{scale: downloadButtonScale}],
                            zIndex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('Meeting', {
                                room: webinar.webinar_url,
                              });
                              setAdVisible(false);
                            }}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: '#1e90ff', // Light blue for the button
                              paddingVertical: 12,
                              paddingHorizontal: 24,
                              borderRadius: 10,
                              shadowColor: '#1e90ff',
                              shadowOffset: {width: 0, height: 5},
                              shadowOpacity: 0.4,
                              shadowRadius: 6,
                              elevation: 8, // Android shadow
                            }}>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 18,
                                fontWeight: '600',
                                marginRight: 10,
                              }}>
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

        {isModalVisible && isSingleNotification ? (
          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType="fade"
            onRequestClose={() => {
              setIsModalVisible(false);
            }}>
            <View style={styled.adOverlay}>
              <View style={styled.adContainer}>
                <LinearGradient
                  colors={['#133E87', '#5B99C2', '#87A2FF']}
                  // colors={['#4e54c8', '#8f94fb']}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    borderRadius: 20,
                    padding: 12,
                  }}>
                  <TouchableOpacity
                    style={[
                      {
                        width: '100%',
                        display: 'flex',
                        alignSelf: 'flex-end',
                        alignItems: 'flex-end',
                        width: 40,
                        zIndex: 1,
                      },
                      // styled.closeButton,
                    ]}
                    onPress={() => {
                      notificationUpdate(isSingleNotification.notification_id);
                      setIsModalVisible(false);
                    }}>
                    <Ionicons name="close" size={26} color="white" />
                  </TouchableOpacity>

                  <View
                    style={{
                      position: 'absolute',
                      width: 200,
                      height: 200,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 100,
                      top: -30,
                      right: -30,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      width: 150,
                      height: 150,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 75,
                      bottom: -40,
                      left: -40,
                    }}
                  />
                  <View
                    style={{
                      marginBottom: 20,
                      alignItems: 'center',
                      zIndex: 1,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: 8,
                        textShadowColor: 'rgba(0, 0, 0, 0.3)',
                        textShadowOffset: {width: 1, height: 1},
                        textShadowRadius: 2,
                      }}>
                      {isSingleNotification?.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'white',
                        textAlign: 'center',
                        opacity: 0.9,
                        paddingHorizontal: 10,
                      }}>
                      {isSingleNotification?.description}
                    </Text>
                  </View>
                  <Animated.View
                    style={{
                      transform: [{scale: downloadButtonScale}],
                      zIndex: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={
                        isSingleNotification.notification_type == 0
                          ? () => {
                              navigation.navigate('Meeting', {
                                room: isSingleNotification.notification_url,
                              });
                              notificationUpdate(
                                isSingleNotification.notification_id,
                              );
                              setIsModalVisible(false);
                            }
                          : () => {
                              Linking.openURL(
                                isSingleNotification.notification_url,
                              );
                              notificationUpdate(
                                isSingleNotification.notification_id,
                              );
                              setIsModalVisible(false);
                            }
                      }
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#1e90ff', // Light blue for the button
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 10,
                        shadowColor: '#1e90ff',
                        shadowOffset: {width: 0, height: 5},
                        shadowOpacity: 0.4,
                        shadowRadius: 6,
                        elevation: 8, // Android shadow
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 18,
                          fontWeight: '600',
                          marginRight: 10,
                        }}>
                        Click here
                      </Text>
                      <Action name="action-redo" size={24} color="white" />
                    </TouchableOpacity>
                  </Animated.View>
                </LinearGradient>
              </View>
            </View>
          </Modal>
        ) : null}
      </SafeAreaView>
    );
  };

  return (
    <FlatList
      data={[{key: 'renderItem'}]}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      style={style.dashBoard}
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
