import React, {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, View, StyleSheet, Text, Image} from 'react-native';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthInput from '../../Components/InputFields/AuthInput';
import RememberField from '../../Components/InputFields/RememberField';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import LineAfterBtn from '../../Components/CommonLines/LineAfterBtn';
import SocialMediaButton from '../../Components/Buttons/SocialMediaButton';
import axios from 'axios';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import storage from '../../Constants/storage';
import LoadComponent from '../../Components/Loading/Index';
import Logo from '../../assets/logo.png';
import scale from '../../utils/utils';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {loadTime, setLoadTime, isAuthenticate, setIsAuthenticate, path} =
    useContext(AppContext);
  const navigation = useNavigation();

  const validateEmail = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
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
      const response = await axios.post(
        `https://server.indephysio.com/portal/signin`,
        {
          email,
          password,
          userType: 'student',
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        await storage.setStringAsync('token', response.data.token);
        await storage.setBoolAsync('isLoggedIn', true);

        setIsAuthenticate(true);
        setEmail('');
        setPassword('');
        navigation.navigate(ROUTES.DASHBOARD);
      } else {
        Alert.alert('Error', 'Unexpected response status', [{text: 'OK'}]);
      }
    } catch (error) {
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

  const data = [
    {
      id: '1',
      component: (
        <>
          <AuthTitle authTitle="Welcome back!" />
          <AuthLine authLine="Please enter your info below to start using app." />
        </>
      ),
    },
    {
      id: '2',
      component: (
        <View>
          <AuthInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            wrong={!!emailError}
            errorMessage={emailError}
          />
          <AuthInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
            wrong={!!passwordError}
            errorMessage={passwordError}
          />
          <RememberField route={ROUTES.RECOVERY_PASSWORD} />
        </View>
      ),
    },
    {
      id: '3',
      component: (
        <>
          <CommonButtonAuth handleData={handleLogin} buttonTitle="Sign in" />
          <LineAfterBtn
            lineBefore="Not a member?"
            secondBtn="Join Now"
            route={ROUTES.SIGNUP}
          />
        </>
      ),
    },
  ];

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>{item.component}</View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainer}
      />
      {loadTime && <LoadComponent />}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: scale(10),
    padding: scale(18),
  },
});

export default Index;
