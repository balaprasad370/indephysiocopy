import {StyleSheet, Text, Platform, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Platform } from 'react-native';
const Index = ({name, iconName, isLocked}) => {
  return (
    <TouchableOpacity
      style={{
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
      }}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          padding: 10,
          backgroundColor: isLocked ? '#E4F2FC' : '#8A8A8A',
        }}>
        <Icon
          name={isLocked ? `${iconName}` : `${'lock'}`}
          style={{fontSize: 40, color: isLocked ? '#3898ff' : '#FFF'}}
        />
      </View>
      <Text
        style={{
          marginTop: 8,
          color: isLocked ? '#3898ff' : '#8A8A8A',
          fontWeight: 'bold',
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Index;

const styles = StyleSheet.create({});
