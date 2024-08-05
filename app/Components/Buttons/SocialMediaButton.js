import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';
import Icon from 'react-native-vector-icons/AntDesign';

const SocialMediaButton = () => {
  return (
    <View style={styles.socialLogin}>
      <View style={styles.socialBefore}>
        <Text style={styles.loginWith}>Or sign in with</Text>
      </View>
      <View style={styles.socialbutton}>
        <TouchableOpacity style={styles.facebook}>
          <Icon name="facebook-square" style={styles.socialIcon} />
          <Text style={styles.facebookText}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.google}>
          <Icon name="google" style={styles.socialIcon} />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SocialMediaButton;

const styles = StyleSheet.create({
  socialBefore: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    fontSize: 24,
    color: color.lightPrimary,
  },
  socialbutton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  loginWith: {
    fontSize: 18,
  },
  facebook: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: color.darkPrimary,
  },
  google: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: color.grey,
    backgroundColor: color.white,
  },
  facebookText: {
    marginLeft: 10,
    fontSize: 20,
    color: color.white,
    fontWeight: '500',
  },
  googleText: {
    marginLeft: 10,
    fontSize: 20,
    color: color.black,
    fontWeight: '500',
  },
});
