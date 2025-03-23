import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import BackgroundImage from '../../assets/logo.png';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import scale from '../../utils/utils';
import topBgBackground from '../../assets/top-bg-shape2.png';

const AuthScreen = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-center items-center bg-b50 min-h-full dark:bg-n50 dark:text-white p-0 m-0 w-full">
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        {/* <View className="pb-16">
          <View className="absolute w-full top-0 left-0 right-0">
            <Image
              source={topBgBackground}
              className="w-full h-[250px] -mt-20"
            />
          </View>
        </View> */}
        <View className="items-center justify-center w-full h-full flex-1 justify-center">
          <Image
            style={{
              width: scale(250),
              height: scale(193),
              marginBottom: scale(20),
            }}
            source={BackgroundImage}
          />
          <View className="w-full items-center px-4">
            <Text className="text-[28px] text-p1 font-bold text-center mb-2.5">
              Welcome to Med
              <Text className="text-p1">Universe</Text>
            </Text>
            <Text className="text-base text-p1 text-center mb-7">
              Create an account to get started on your journey and happiness
              today.
            </Text>
            <Pressable
              hitSlop={{x: 25, y: 15}}
              className="bg-p1 py-[15px] px-10 rounded-[30px] mb-5 w-full items-center"
              onPress={() => navigation.navigate(ROUTES.LOGIN)}>
              <Text className="text-white text-base font-bold">Log In</Text>
            </Pressable>
            <Pressable
              hitSlop={{x: 25, y: 15}}
              className="bg-white py-[15px] px-10 rounded-[30px] border border-p1/60 shadow-md w-full items-center"
              onPress={() => navigation.navigate(ROUTES.SIGNUP)}>
              <Text className="text-p1 text-base font-bold">Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AuthScreen;
