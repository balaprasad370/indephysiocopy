import React, {useState, useContext, useEffect} from 'react';
import {Alert, FlatList, View, StyleSheet, Text, Image} from 'react-native';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthInput from '../../Components/InputFields/AuthInput';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import LineAfterBtn from '../../Components/CommonLines/LineAfterBtn';
import axios from 'axios';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import storage from '../../Constants/storage';
import LoadComponent from '../../Components/Loading/Index';
import Logo from '../../assets/logo.png';
import Toast from '../../Components/Toast/Index';
import scale from '../../utils/utils';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('student');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const {loadTime, setLoadTime, show, setShow, path} = useContext(AppContext);
  const [messageError, setMessageError] = useState('');

  const navigation = useNavigation();

  const handleSignup = async () => {
    // Clear previous errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setMobileNumberError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setMessageError('');

    // Perform client-side validation
    let validationPassed = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName) {
      setFirstNameError('First name is required');
      return;
    }

    if (!email) {
      setEmailError('Email is required');
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (!mobileNumber) {
      setMobileNumberError('Mobile number is required');
      return;
    } else if (mobileNumber.length !== 10) {
      setMobileNumberError('Mobile number must be 10 digits');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      return;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    try {
      setLoadTime(true);
      const response = await axios.post(`http://${path}:4000/app/register`, {
        firstName,
        lastName,
        email,
        mobileNumber,
        password,
        confirmPassword,
      });

      if (response.status === 200) {
        storage.setString('email', email);
        storage.setBool('show', true);
        setFirstName('');
        setLastName('');
        setEmail('');
        setMobileNumber('');
        setPassword('');
        setConfirmPassword('');
        setShow(true);
        setLoadTime(false);
        setMessageError('');
      } else {
        setLoadTime(false);
        setMessageError('Unexpected response status');
      }
    } catch (error) {
      console.log(error.message);
      setLoadTime(false);
      if (error.response) {
        const {status, data} = error.response;
        if (status === 400) {
          setEmailError('User with this email already exists');
        } else {
          setEmailError('An error occurred');
        }
      } else {
        setMessageError(
          'Something went wrong on our end. Please try again later.',
        );
        // setEmailError(error.message);
      }
    }
  };

  const data = [
    {
      id: '1',
      component: (
        <>
          <AuthTitle authTitle="Welcome to MedUniverse" />
          <AuthLine authLine="Please fill in the information below to register." />
        </>
      ),
    },
    {
      id: '2',
      component: (
        <View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between', // Ensure equal space between inputs
            }}>
            <AuthInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              wrong={!!firstNameError}
              isSmall={true}
            />
            <AuthInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              isSmall={true}
              wrong={!!lastNameError}
            />
          </View>
          {firstNameError ? (
            <Text style={styles.errorText}>{firstNameError}</Text>
          ) : null}

          <AuthInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            wrong={!!emailError}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <AuthInput
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Mobile Number"
            keyboardType="numeric"
            wrong={!!mobileNumberError}
          />
          {mobileNumberError ? (
            <Text style={styles.errorText}>{mobileNumberError}</Text>
          ) : null}

          <AuthInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
            wrong={!!passwordError}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <AuthInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder="Confirm Password"
            wrong={!!confirmPasswordError}
          />
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
          {messageError ? (
            <Text style={styles.errorText}>{messageError}</Text>
          ) : null}
        </View>
      ),
    },
    {
      id: '3',
      component: (
        <>
          <CommonButtonAuth handleData={handleSignup} buttonTitle="Sign up" />
          <LineAfterBtn
            lineBefore="Already have an account?"
            secondBtn="Sign in"
            route={ROUTES.LOGIN}
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
        showsVerticalScrollIndicator={false}
      />
      {loadTime && <LoadComponent />}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: scale(18),
  },
  errorText: {
    color: 'red',
    marginBottom: scale(10),
  },
  halfInput: {
    width: '48%',
  },
});

export default Signup;
