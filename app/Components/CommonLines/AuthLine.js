import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';

const AuthLine = ({authLine}) => {
  return (
    <View>
      <Text style={styles.authLine}>{authLine}</Text>
    </View>
  );
};

export default AuthLine;

const styles = StyleSheet.create({
  authLine: {
    color: color.lighGrey,
    fontSize: 17,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 10,
    width: '90%',
  },
});
