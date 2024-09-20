import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import color from '../../Constants/color';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import {AppContext} from '../../theme/AppContext';

const Loading = () => {
  const {isDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? color.black : color.white,
        zIndex: 9999,
      }}>
      <ActivityIndicator
        size="large"
        color={isDark ? color.white : color.black}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
