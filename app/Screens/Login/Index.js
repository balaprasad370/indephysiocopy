import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import AuthLine from '../../Components/CommonLines/AuthLine';
import FormField from '../../ui/FormField';
import RememberField from '../../Components/InputFields/RememberField';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import LineAfterBtn from '../../Components/CommonLines/LineAfterBtn';
import axios from 'axios';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import storage from '../../Constants/storage';
import LoadComponent from '../../Components/Loading/Loading';
import Logo from '../../assets/logo.png';
import {Mixpanel} from 'mixpanel-react-native';
import DeviceInfo from 'react-native-device-info';
import axiosInstance from '../../Components/axiosInstance';
import messaging from '@react-native-firebase/messaging';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {loadTime, setLoadTime, isAuthenticate, setIsAuthenticate, path} =
    useContext(AppContext);
  const navigation = useNavigation();

  const [deviceUniqueId, setDeviceUniqueId] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [agreementVisible, setAgreementVisible] = useState(false);
  const [deviceRestrictionVisible, setDeviceRestrictionVisible] =
    useState(false);
  const [registeredDeviceModel, setRegisteredDeviceModel] = useState('');
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  useEffect(() => {
    DeviceInfo.getUniqueId().then(id => {
      setDeviceUniqueId(id);
    });

    const brand = DeviceInfo.getBrand(); // e.g., "Vivo", "Xiaomi"
    const model = DeviceInfo.getModel(); // e.g., "2823", "Redmi 7S"
    setBrand(brand);
    setModel(model);
  }, [deviceUniqueId]);

  const trackAutomaticEvents = false;
  const mixpanel = new Mixpanel(
    '307ab8f1e535a257669ab35fffe22d8f',
    trackAutomaticEvents,
  );
  mixpanel.init();

  const validateEmail = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const requestDeviceChange = async () => {
    setDeviceRestrictionVisible(false);
    try {
      setLoadTime(true);
      const response = await axios.post(
        `${path}/v2/portal/request-device-change`,
        {
          email,
          brand,
          newDeviceModel: model,
          newDeviceId: deviceUniqueId,
        },
      );
      setLoadTime(false);
      Alert.alert(
        'Request Sent',
        'Your request to change devices has been submitted. You will be notified once approved.',
        [{text: 'OK'}],
      );
    } catch (error) {
      setLoadTime(false);
      Alert.alert(
        'Request Failed',
        'Unable to submit your request. Please try again later.',
        [{text: 'OK'}],
      );
      console.log('Device change request error:', error);
    }
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      return;
    } else if (password.length < 6) {
      setPasswordError('Password length must be at least 6 characters');
      return;
    }

    try {
      setLoadTime(true);
      const response = await axios.post(`${path}/v2/portal/signin`, {
        email,
        password,
        userType: 'student',
      });
      setLoadTime(false);

      if (!response.data.current_device_unique_id) {
        setAgreementVisible(true);
      } else if (response.data.current_device_unique_id !== deviceUniqueId) {
        if (!response.data.new_device_unique_id) {
          setRegisteredDeviceModel(response.data.device_model);
          setDeviceRestrictionVisible(true);
        } else {
          console.log('response.data.new_device_unique_id', response.data);
          // show them new request in pending list
          setRegisteredDeviceModel(response.data.device_model);
          setAlreadyRequested(true);
        }
      } else {
        //update the device unique id, model, brand
        await storage.setStringAsync('token', response.data.token);
        await storage.setBoolAsync('isLoggedIn', true);
        await storage.setStringAsync('studentName', response.data?.studentName);
        await storage.setStringAsync(
          'studentId',
          response.data?.studentId.toString(),
        );
        await storage.setStringAsync(
          'isAdmin',
          response.data?.isAdmin ? 'true' : 'false',
        );

        await storage.setStringAsync('email', response.data?.email);

        const resultDeviceInfo = await axiosInstance.post(
          `/v2/portal/update-device-info`,
          {
            deviceUniqueId,
            deviceModel: model,
            brand,
          },
        );

        console.log('resultDeviceInfo', resultDeviceInfo);

        mixpanel.identify(
          response.data?.studentName + ' ' + response.data?.studentId,
        );
        mixpanel.getPeople().set('Student Name', response.data?.studentName);
        mixpanel.getPeople().set('Student ID', response.data?.studentId);
        mixpanel.getPeople().set('Email', response.data?.email);
        mixpanel.track('Login', {
          studentName: response.data?.studentName,
          studentId: response.data?.studentId,
          email: response.data?.email,
        });

        try {
          //subscribe this person to the topic for crated acounts
          await messaging().subscribeToTopic('users');
          await messaging().unsubscribeFromTopic('installedNoAccount');
        } catch (error) {
          console.log('error', error);
        }

        setIsAuthenticate(true);
        setEmail('');
        setPassword('');
        navigation.replace(ROUTES.HOME_TAB);
      }
    } catch (error) {
      setLoadTime(false);
      console.log(
        'error.response',
        error?.response?.data || error?.message || error,
      );
      if (error.response) {
        const {status, data} = error.response;
        if (status === 400) {
          if (data.msg === 'User not found!') {
            setEmailError('User not found');
          } else if (data.msg === 'Invalid credentials') {
            setPasswordError('Incorrect password');
          } else if (data.msg === 'Valid email is required') {
            setEmailError('Please enter a valid email');
          } else {
            Alert.alert('Error', data.msg || 'An error occurred', [
              {text: 'OK'},
            ]);
          }
        } else {
          Alert.alert('Error', data.msg || 'An error occurred', [{text: 'OK'}]);
        }
      } else {
        Alert.alert('Error', error.message, [{text: 'OK'}]);
      }
    } finally {
      setLoadTime(false);
    }
  };

  const handleAgreement = async () => {
    setAgreementVisible(false);
    try {
      setLoadTime(true);
      const response = await axios.post(`${path}/v2/portal/signin`, {
        email,
        password,
        userType: 'student',
      });
      setLoadTime(false);

      await storage.setStringAsync('token', response.data.token);
      await storage.setBoolAsync('isLoggedIn', true);
      await storage.setStringAsync('studentName', response.data?.studentName);
      await storage.setStringAsync(
        'isAdmin',
        response.data?.isAdmin ? 'true' : 'false',
      );

      await storage.setStringAsync(
        'studentId',
        response.data?.studentId.toString(),
      );
      await storage.setStringAsync('email', response.data?.email);

      const resultDeviceInfo = await axiosInstance.post(
        `/v2/portal/update-device-info`,
        {
          deviceUniqueId,
          deviceModel: model,
          brand,
        },
      );

      console.log('resultDeviceInfo', resultDeviceInfo);

      mixpanel.identify(
        response.data?.studentName + ' ' + response.data?.studentId,
      );
      mixpanel.getPeople().set('Student Name', response.data?.studentName);
      mixpanel.getPeople().set('Student ID', response.data?.studentId);
      mixpanel.getPeople().set('Email', response.data?.email);
      mixpanel.track('Login', {
        studentName: response.data?.studentName,
        studentId: response.data?.studentId,
        email: response.data?.email,
      });

      try {
        //subscribe this person to the topic for crated acounts
        await messaging().subscribeToTopic('users');
        await messaging().unsubscribeFromTopic('installedNoAccount');
      } catch (error) {
        console.log('error', error);
      }

      setIsAuthenticate(true);
      setEmail('');
      setPassword('');
      navigation.replace(ROUTES.HOME_TAB);
    } catch (error) {
      setLoadTime(false);
      if (error.response) {
        console.log(error.response);
        const {status, data} = error.response;
        if (status === 400) {
          if (data.msg === 'User not found!') {
            setEmailError('User not found');
          } else if (data.msg === 'Invalid credentials') {
            setPasswordError('Incorrect password');
          } else if (data.msg === 'Valid email is required') {
            setEmailError('Please enter a valid email');
          } else {
            Alert.alert('Error', data.msg || 'An error occurred', [
              {text: 'OK'},
            ]);
          }
        } else {
          Alert.alert('Error', data.msg || 'An error occurred', [{text: 'OK'}]);
        }
      } else {
        Alert.alert('Error', error.message, [{text: 'OK'}]);
      }
    } finally {
      setLoadTime(false);
    }
  };

  const data = [
    {
      id: '1',
      component: (
        <View className="mb-8">
          <AuthTitle authTitle="Welcome back!" />
          <AuthLine authLine="Please enter your info below to start using app." />
        </View>
      ),
    },
    {
      id: '2',
      component: (
        <View className="space-y-6">
          <View>
            <FormField
              isTitle={false}
              placeholder="Email"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setEmailError('');
              }}
              otherStyle={emailError ? 'border-red-500' : 'border-p1'}
            />
            {emailError && (
              <Text className="text-red-500 text-sm mt-2">{emailError}</Text>
            )}
          </View>

          <View>
            <FormField
              isTitle={false}
              title="Password"
              placeholder="Password"
              value={password}
              onChangeText={text => {
                setPassword(text);
                setPasswordError('');
              }}
              otherStyle={passwordError ? 'border-red-500' : 'border-p1'}
            />
            {passwordError && (
              <Text className="text-red-500 text-sm mt-2">{passwordError}</Text>
            )}
          </View>

          <RememberField route={ROUTES.RECOVERY_PASSWORD} />
        </View>
      ),
    },
    {
      id: '3',
      component: (
        <View className="mt-8 space-y-6">
          <CommonButtonAuth
            handleData={handleLogin}
            buttonTitle="Login"
            loading={loadTime}
            className="bg-p1"
          />
          <LineAfterBtn
            lineBefore="Not a member?"
            secondBtn="Join Now"
            route={ROUTES.SIGNUP}
            className="text-p1"
          />
        </View>
      ),
    },
  ];

  return (
    <View className="flex-1 bg-b50 dark:bg-n50 min-h-full">
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View className="px-6 py-4">{item.component}</View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{flexGrow: 1, paddingVertical: 24}}
        showsVerticalScrollIndicator={false}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={agreementVisible}
        onRequestClose={() => {
          setAgreementVisible(!agreementVisible);
        }}>
        <View className="flex-1 justify-center items-center bg-black/30 bg-opacity-50">
          <View className="w-4/5 bg-white rounded-lg p-5 items-center">
            <Text className="text-lg font-bold mb-2">Agreement</Text>
            <Text className="text-base text-center mb-4">
              By logging in, you agree that this will be your primary device and
              you cannot login to another device with the same account.
            </Text>
            <View className="flex-row justify-center w-full  items-center mb-4">
              <Text className="text-base text-center ">Device Model: </Text>
              <Text className="text-p1 font-bold">{model}</Text>
            </View>
            <View className="flex-row justify-between w-full">
              <TouchableOpacity
                className="bg-purple-600 py-2 px-4 rounded mr-2"
                onPress={handleAgreement}>
                <Text className="text-white text-base">Agree</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 py-2 px-4 rounded"
                onPress={() => setAgreementVisible(false)}>
                <Text className="text-white text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deviceRestrictionVisible}
        onRequestClose={() => {
          setDeviceRestrictionVisible(false);
        }}>
        <View className="flex-1 justify-center items-center bg-black/30 bg-opacity-50">
          <View className="w-4/5 bg-white rounded-lg p-5 items-center">
            <Text className="text-lg font-bold mb-2">Device Restriction</Text>
            <Text className="text-base text-center mb-4">
              Your account is currently linked to another device. For security
              reasons, you can only access your account from your registered
              device.
            </Text>
            <View className="flex-row justify-center w-full items-center mb-4">
              <Text className="text-base text-center">Registered device: </Text>
              <Text className="text-p1 font-bold">{registeredDeviceModel}</Text>
            </View>
            <View className="flex-row justify-center w-full items-center mb-4">
              <Text className="text-base text-center">Current device: </Text>
              <Text className="text-p1 font-bold">{model}</Text>
            </View>
            <Text className="text-sm text-center mb-4 text-gray-700">
              {registeredDeviceModel === model
                ? "Even though the device models appear to be the same, each device has a unique identifier that doesn't match your registered device. This can happen if you've reset your phone, reinstalled the app, or are using a different device of the same model."
                : 'Your current device model is different from your registered device.'}
            </Text>
            <View className="flex-row justify-between w-full">
              <TouchableOpacity
                className="bg-purple-600 py-2 px-4 rounded mr-2"
                onPress={requestDeviceChange}>
                <Text className="text-white text-base">
                  Request Device Change
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-red-600 py-2 px-4 rounded"
                onPress={() => setDeviceRestrictionVisible(false)}>
                <Text className="text-white text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-600 mt-2 text-center">
              If you click "Request Device Change", this device ({model}) will
              be sent for approval. If you're experiencing issues, please
              contact support for assistance.
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={alreadyRequested}
        onRequestClose={() => {
          setAlreadyRequested(false);
        }}>
        <View className="flex-1 justify-center items-center bg-black/30 bg-opacity-50">
          <View className="w-4/5 bg-white rounded-lg p-5 items-center">
            <Text className="text-lg font-bold mb-2">Request Pending</Text>
            <Text className="text-base text-center mb-4">
              You have already requested a device change. Please wait for
              approval from the administrator.
            </Text>
            <View className="flex-row justify-center w-full items-center mb-4">
              <Text className="text-base text-center">Registered device: </Text>
              <Text className="text-p1 font-bold">{registeredDeviceModel}</Text>
            </View>
            <View className="flex-row justify-center w-full items-center mb-4">
              <Text className="text-base text-center">Current device: </Text>
              <Text className="text-p1 font-bold">{model}</Text>
            </View>
            <Text className="text-sm text-center mb-4 text-gray-700">
              {registeredDeviceModel === model
                ? "Even though the device models appear to be the same, each device has a unique identifier that doesn't match. Your request to use this device is pending approval."
                : 'Your request to change to this device model is pending approval.'}
            </Text>
            <TouchableOpacity
              className="bg-purple-600 py-2 px-4 rounded w-full"
              onPress={() => setAlreadyRequested(false)}>
              <Text className="text-white text-base text-center">OK</Text>
            </TouchableOpacity>
            <Text className="text-xs text-gray-600 mt-3 text-center">
              You will be notified once your request is approved. If you need
              immediate assistance, please contact support.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Index;
