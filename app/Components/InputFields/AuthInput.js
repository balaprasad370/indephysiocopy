import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import color from '../../Constants/color';
import Check from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const AuthInput = ({
  value,
  onChangeText,
  placeholder,
  wrong,
  secureTextEntry,
}) => {
  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:4000/login', {
  //       email,
  //       password,
  //     });
  //     Alert.alert('Success', 'Logged in successfully', [{text: 'OK'}]);
  //     console.log('Token:', response.headers.authorization);
  //   } catch (error) {
  //     setIsWrong(true);
  //     Alert.alert('Error', 'Invalid credentials', [{text: 'OK'}]);
  //     console.error('Error:', error.response?.data);
  //   }
  // };

  // const handleSignup = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:4000/signup', {
  //       email,
  //       password,
  //     });
  //     Alert.alert('Success', 'Registered successfully', [{text: 'OK'}]);
  //     console.log('Token:', response.headers.authorization);
  //   } catch (error) {
  //     setIsWrong(true);
  //     Alert.alert('Error', 'Signup failed', [{text: 'OK'}]);
  //     console.error('Error:', error.response?.data);
  //   }
  // };

  return (
    <View style={wrong ? styles.authInputAlert : styles.authInput}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.authInputField}
        secureTextEntry={secureTextEntry}
      />

      {/* {wrong ? (
        <Icon name="circle-with-cross" style={styles.authIconAlert} />
      ) : (
        <Check name="checkcircle" style={styles.authIcon} />
      )} */}
      {/* <Icon name="check" style={styles.authIcon} />
      <Icon name="eye" style={styles.authIcon} />
      <Icon name="eye-with-line" style={styles.authIcon} /> */}
    </View>
  );
};

export default AuthInput;

const styles = StyleSheet.create({
  authInput: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.inputColor,
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: color.inputColor,
  },
  authInputAlert: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.danger,
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: color.inputColor,
  },
  authInputField: {
    fontSize: 18,
    padding: 5,
    width: '90%',
  },
  authIconAlert: {
    fontSize: 26,
    color: color.danger,
  },
  authIcon: {
    fontSize: 26,
    color: color.safe,
  },
});
