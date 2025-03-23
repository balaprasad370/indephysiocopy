import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Dashboard,
  SelfLearn,
  Documents,
  LiveClasses,
  MedTalk,
} from '../Screens';
import {ROUTES} from '../Constants/routes';
import {AppContext} from '../theme/AppContext';
import LighTheme from '../theme/LighTheme';
import DarkTheme from '../theme/Darktheme';
import color from '../Constants/color';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({state, descriptors, navigation}) => {
  const [index, setIndex] = React.useState(state.index);

  const onTabPress = ({routeName}) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeName,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const handleNavigateScreen = index => {
    console.log('index', index);
    setIndex(index);
    if (index === 0) {
      navigation.navigate(ROUTES.HOME);
    } else if (index === 1) {
      navigation.navigate(ROUTES.LIVE_CLASS);
    } else if (index === 2) {
      navigation.navigate(ROUTES.MEDTALK);
    } else if (index === 3) {
      navigation.navigate(ROUTES.SELF_LEARN);
    }
  };

  const {isDark, setIsDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  return (
    <SafeAreaView style={style.bottomTab}>
      <View className="items-center  py-3 flex-row justify-evenly bg-p1">
        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          onPress={() => handleNavigateScreen(0)}
          className={`${
            index === 0
              ? 'flex justify-center border-[0.8px] border-white rounded-[50px] p-1.5 w-1/2 pr-2 flex-row items-center bg-p1'
              : ''
          }`}>
          <Ionicons
            name="view-dashboard"
            className="ml-0"
            size={30}
            color="white"
          />
          {index === 0 && (
            <Text className="text-base text-white font-semibold ml-2.5">
              DASHBOARD
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          className={`${
            index === 1
              ? 'flex justify-center border-[0.8px] border-white rounded-[50px] p-1.5 w-1/2 pr-2 flex-row items-center bg-p1'
              : ''
          }`}
          onPress={() => handleNavigateScreen(1)}>
          <Ionicons
            name="monitor-dashboard"
            size={30}
            className="ml-0"
            color="white"
          />
          {index === 1 && (
            <Text className="text-base text-white font-semibold ml-2.5">
              LIVE CLASS
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          className={`${
            index === 2
              ? 'flex justify-center border-[0.8px] border-white rounded-[50px] p-1.5 w-1/2 pr-2 flex-row items-center bg-p1'
              : ''
          }`}
          onPress={() => handleNavigateScreen(2)}>
          <View className="relative">
            <Ionicons name="robot" size={30} className="ml-0" color="white" />
            <View className="absolute -top-2 -right-2 bg-yellow-400 rounded-full px-1 py-0.5">
              <Text className="text-[10px] text-black font-bold">NEW</Text>
            </View>
          </View>
          {index === 2 && (
            <Text className="text-base text-white font-semibold ml-2.5">
              MEDTALK
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          className={`${
            index === 3
              ? 'flex justify-center border-[0.8px] border-white rounded-[50px] p-1.5 w-1/2 pr-2 flex-row items-center bg-p1'
              : ''
          }`}
          onPress={() => handleNavigateScreen(3)}>
          <Ionicons
            name="book-open-blank-variant"
            className="ml-0"
            size={30}
            color="white"
          />
          {index === 3 && (
            <Text className="text-base text-white font-semibold ml-2.5">
              SELF LEARN
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name={ROUTES.HOME} component={Dashboard} />
      <Tab.Screen name={ROUTES.LIVE_CLASS} component={LiveClasses} />
      <Tab.Screen name={ROUTES.SELF_LEARN} component={SelfLearn} />
      <Tab.Screen name={ROUTES.MEDTALK} component={MedTalk} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
