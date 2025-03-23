import {Text, View, TouchableOpacity, Alert} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import NetInfo from '@react-native-community/netinfo';
import LottieView from 'lottie-react-native';

const OfflineScreen = ({onRetry}) => {
  const navigation = useNavigation();

  // Function to check internet and redirect if connected
  const handleRetry = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // If the internet is available, navigate to Dashboard
        navigation.navigate(ROUTES.DASHBOARD);
      } else {
        // If no internet, show an alert
        Alert.alert(
          'No Connection',
          'Please check your connection and try again.',
        );
      }
    });
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-5 py-10">
      <View className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <LottieView
          source={require('../../assets/lottie/offline.json')}
          autoPlay
          loop
          style={{width: 200, height: 200, alignSelf: 'center'}}
          className="mb-8"
        />
        <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
          No Internet Connection
        </Text>
        <Text className="text-base text-gray-600 text-center mb-8">
          Please check your internet connection and try again.
        </Text>
        <TouchableOpacity
          onPress={handleRetry}
          className="bg-blue-600 active:bg-blue-700 rounded-xl py-4 px-6 shadow-md">
          <Text className="text-white font-semibold text-lg text-center">
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OfflineScreen;
