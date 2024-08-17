import {StyleSheet, Text, Platform, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
// import { Platform } from 'react-native';
const Index = ({name, iconName, isLocked, ROUTE}) => {
  const navigation = useNavigation();

  const changeRoute = option => {
    console.log(option);
    if (option === 'Quiz') {
      setModalVisible(!modalVisible);
    } else if (option === 'Self learn') {
      navigation.navigate(ROUTES.SELF_LEARN);
    } else if (option === 'Live') {
      navigation.navigate('Meeting', {room: 'status'});
    }
  };

  return (
    <TouchableOpacity
      onPress={() => changeRoute(`${ROUTE}`)}
      style={{
        marginTop: 15,
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
          padding: 8,
          backgroundColor: isLocked ? '#E4F2FC' : '#8A8A8A',
        }}>
        <Icon
          name={isLocked ? `${iconName}` : `${'lock'}`}
          style={{fontSize: 34, color: isLocked ? '#3898ff' : '#FFF'}}
        />
      </View>
      <Text
        style={{
          marginTop: 8,
          color: isLocked ? '#3898ff' : '#8A8A8A',
          fontWeight: 'bold',
          fontSize: 12,
        }}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Index;

const styles = StyleSheet.create({});
