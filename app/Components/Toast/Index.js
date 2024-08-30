import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';

const Toast = ({visible, onClose}) => {
  const {
    loadTime,
    setLoadTime,
    show,
    setShow,
    path,
    isAuthenticate,
    setIsAuthenticate,
  } = useContext(AppContext);

  const navigation = useNavigation();

  const [title, setTitle] = useState(
    'Verification email sent. Please check your inbox.',
  );

  const [changed, setChanged] = useState(false);

  const CheckStatus = async () => {
    const email = storage.getString('email');
    if (email) {
      try {
        const response = await axios.get(
          `http://${path}:4000/checkVerification`,
          {
            params: {email: email},
          },
        );

        setTitle(`Processing...`);
        setChanged(false);
        storage.setBool('show', false);
        console.log(response.data.token);
        const token = response.data.token;
        setIsAuthenticate(true);
        await storage.setStringAsync('token', response.data.token);
        await storage.setBoolAsync('isLoggedIn', true);
        navigation.navigate(ROUTES.DASHBOARD);
        setShow(false);
      } catch (error) {
        setTitle(`Email not verify yet!. Check your inbox or spam folder.`);
        setChanged(true);
        console.log('error', error);
        console.log('error', error?.response?.data?.msg);
      }
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.toastContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <Text style={styles.smiley}>😊</Text>
            </View>
          </View>
          <Text style={styles.title}>verify your email!</Text>
          <Text style={changed ? styles.newMessage : styles.message}>
            {title}
          </Text>
          <TouchableOpacity onPress={CheckStatus}>
            <Text style={styles.buttonText}>I've verified my email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  toastContainer: {
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    backgroundColor: '#E0F7FA',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  icon: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 10,
  },
  smiley: {
    fontSize: 24,
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  newMessage: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Toast;
