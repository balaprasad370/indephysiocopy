import {ActivityIndicator, StyleSheet, Text, View, Image} from 'react-native';
import React, {useContext} from 'react';
import color from '../../Constants/color';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import {AppContext} from '../../theme/AppContext';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';

const Loading = () => {
  const {isDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? color.black : color.white,
        zIndex: 9999,
      }}>
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image source={topBgBackground} className="w-full h-[200px] -mt-24" />
        </View>
        <PageTitle pageName={'Loading'} />
      </View>

      <ActivityIndicator
        size="large"
        color={isDark ? color.white : color.black}
      />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
