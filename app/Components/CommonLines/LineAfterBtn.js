import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';

const LineAfterBtn = ({lineBefore, secondBtn, route}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.member}>
      <Text style={styles.notMember}>{lineBefore}</Text>
      <TouchableOpacity onPress={() => navigation.navigate(route)}>
        <Text style={styles.joinNow}>{secondBtn}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LineAfterBtn;

const styles = StyleSheet.create({
  notMember: {
    fontSize: 18,

    marginRight: 10,
  },
  joinNow: {
    color: color.darkPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  member: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});
