import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import BackgroundImage from '../../assets/logo.png';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import color from '../../Constants/color';
import scale from '../../utils/utils';

const AuthScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.background}>
      <Image
        style={{width: scale(250), height: scale(193), marginBottom: scale(20)}}
        source={BackgroundImage}
      />
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome to Med
          <Text style={{color: '#6FA7DB'}}>Universe</Text>
        </Text>
        <Text style={styles.subtitle}>
          Create an account to get started on your journey and happiness today.
        </Text>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => navigation.navigate(ROUTES.LOGIN)}>
          <Text style={styles.buttonTextPrimary}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.navigate(ROUTES.SIGNUP)}>
          <Text style={styles.buttonTextSecondary}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#674EA7', // Dark Blue color for title
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#674EA7', // Lighter Blue color for subtitle
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonPrimary: {
    backgroundColor: '#674EA7', // Primary Blue color for login button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: '#FFFFFF', // White text for primary button
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF', // White background for secondary button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderColor: '#674EA7', // Border color matching primary button
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: '#674EA7', // Blue text for secondary button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
