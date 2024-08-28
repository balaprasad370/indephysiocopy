import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import Forward from 'react-native-vector-icons/MaterialIcons';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';

const Index = ({name}) => {
  const {isDark, setIsDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;
  return (
    <TouchableOpacity style={style.taskBox}>
      <View style={style.taskImage}></View>
      <Text style={style.taskText}>{name}</Text>
      <Forward name="arrow-forward-ios" style={style.taskIcon} />
    </TouchableOpacity>
  );
};

export default Index;

const styles = StyleSheet.create({});
