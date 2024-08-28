import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';
import scale from '../../utils/utils';

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
    marginBottom: scale(8),
    backgroundColor: color.darkPrimary,
    padding: scale(8),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonText: {
    fontSize: 24,
    color: color.white,
  },
});
