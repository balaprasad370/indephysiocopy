import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';

const CommonButtonAuth = ({handleData, buttonTitle}) => {
  return (
    <TouchableOpacity style={styles.commonBtn} onPress={handleData}>
      <Text style={styles.commonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default CommonButtonAuth;

const styles = StyleSheet.create({
  commonBtn: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: color.darkPrimary,
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonText: {
    fontSize: 24,
    color: color.white,
  },
});
