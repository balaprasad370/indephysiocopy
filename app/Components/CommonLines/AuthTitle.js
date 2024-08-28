import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';
import scale from '../../utils/utils';

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
    fontSize: 28,
    letterSpacing: 1.3,
    color: color.black,
    fontWeight: '700',
  },
});
