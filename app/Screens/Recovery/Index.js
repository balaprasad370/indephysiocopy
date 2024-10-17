import {Alert, StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import React, {useContext, useState} from 'react';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import AuthInput from '../../Components/InputFields/AuthInput';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import scale from '../../utils/utils';
import {FlatList} from 'react-native';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';

const Recovery = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const {path} = useContext(AppContext);

  const handleForgotPassword = async () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true); // Start loading
    setEmail('');

    try {
      const response = await axios.post(`${path}/api/forgot-password`, {
        email,
      });
      setMessage('Your request has been submitted. Please check your email.');
    } catch (error) {
      console.log('Error:', error.message);
      setMessage('Error sending password reset link.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const data = [
    {
      id: '1',
      component: (
        <>
          <AuthTitle authTitle="Forgot Password" />
          <AuthLine authLine="Enter your email below to receive your password reset instructions." />
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
          <CommonButtonAuth
            buttonTitle="Forgot Password"
            handleData={handleForgotPassword}
          />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Sending...</Text>
            </View>
          )}
          {message && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}
        </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: scale(10),
    padding: scale(18),
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(10),
  },
  loadingText: {
    marginLeft: scale(10),
    fontSize: scale(16),
    color: '#0000ff',
  },
  messageContainer: {
    marginTop: scale(10),
    alignItems: 'center',
  },
  messageText: {
    fontSize: scale(16),
    color: '#333',
  },
});

export default Recovery;
