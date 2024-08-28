import {Alert, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import AuthInput from '../../Components/InputFields/AuthInput';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import scale from '../../utils/utils';
import {FlatList} from 'react-native';

const Recovery = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleRecoveryPassword = async () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Call your recovery password API or function here
    Alert.alert('Recovery instructions sent to your email');
  };

  const data = [
    {
      id: '1',
      component: (
        <>
          <AuthTitle authTitle="Recovery Password" />
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
            buttonTitle="Recovery Password"
            handleData={handleRecoveryPassword}
          />
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: scale(10),
    padding: scale(18),
  },
});

export default Recovery;
