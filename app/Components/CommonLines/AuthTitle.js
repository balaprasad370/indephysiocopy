import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';

const AuthTitle = ({authTitle}) => {
  return (
    <View>
      <Text style={styles.AuthTitleText}>{authTitle}</Text>
    </View>
  );
};

export default AuthTitle;

const styles = StyleSheet.create({
  AuthTitleText: {
    fontSize: 30,
    letterSpacing: 1.3,
    marginTop: '5%',
    fontWeight: '700',
  },
  //   nameHighlight: {
  //     color: color.darkPrimary,
  //   },
});
