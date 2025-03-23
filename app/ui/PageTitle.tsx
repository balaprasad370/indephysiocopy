import {Pressable, StyleSheet, Text, View, BackHandler} from 'react-native';
import React, {ReactNode} from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../Constants/routes';


const PageTitle = ({
  pageName,
  isRightIcon,
  link,
  children,
  hideBackButton,
}: {
  pageName: string;
  isRightIcon?: boolean;
  link?: string;
  children?: ReactNode;
  hideBackButton?: boolean;
}) => {
  const navigation = useNavigation();
  return (
    <View className=" px-6 pt-4 pb-6 flex-row justify-between items-center z-50 ">
      <View className="flex-row justify-start items-center gap-x-6">
        {!hideBackButton && (
          <Pressable
            onPress={() => {
              try {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else {
                  navigation.replace(ROUTES.HOME_TAB);
                }
              } catch (error) {
                BackHandler.exitApp();
              }
            }}
            className="bg-white rounded-full flex-row justify-center items-center w-8 h-8">
            <Text>
              <EvilIcons name="chevron-left" size={32} color="black" />
            </Text>
          </Pressable>
        )}
        <View className="  ">
          <Text
            className="text-[28px] text-white"
            style={{fontFamily: 'Lato_700Bold'}}>
            {pageName}
          </Text>
        </View>
      </View>

      {isRightIcon && (
        <Pressable
          onPress={() => navigation.navigate(link as any)}
          className="flex items-center justify-center rounded-full border border-white p-2 text-white">
          {children}
        </Pressable>
      )}
    </View>
  );
};

export default PageTitle;

const styles = StyleSheet.create({});
