import {StyleSheet, Text, Platform, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {Image} from 'react-native';
import color from '../../Constants/color';
const Index = ({name, iconImage, lock, isLocked, ROUTE}) => {
  const navigation = useNavigation();

  const changeRoute = option => {
    console.log(option);
    if (option === 'Quiz') {
      setModalVisible(!modalVisible);
    } else if (option === 'Self learn') {
      navigation.navigate(ROUTES.SELF_LEARN);
    } else if (option === 'Live') {
      navigation.navigate(ROUTES.LIVE_CLASS);
    } else if (option === 'Documents') {
      navigation.navigate(ROUTES.DOCUMENTS);
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
          backgroundColor: isLocked ? '#8A8A8A' : '#E4F2FC',
          position: 'relative',
        }}>
        {ROUTE !== 'Documents' && (
          <Image source={iconImage} style={{width: 45, height: 40}} />
        )}
        {ROUTE === 'Documents' && (
          <Icon
            name="folderopen"
            style={{fontSize: 37, color: isLocked ? 'rgba(0,0,0,0.3)' : '#FFF'}}
          />
        )}
        {isLocked ? (
          <View style={{position: 'absolute', bottom: 6}}>
            <Image source={lock} style={{width: 20, height: 20}} />
          </View>
        ) : null}
      </View>
      <Text
        style={{
          marginTop: 8,
          color: isLocked ? '#8A8A8A' : '#3898ff',
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
