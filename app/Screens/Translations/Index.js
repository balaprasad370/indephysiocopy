import React from 'react';
import {View, Text, TouchableOpacity, Linking, SafeAreaView, Image, Platform, Dimensions, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';

const Index = () => {
  const windowWidth = Dimensions.get('window').width;
  
  const handleOpenTranslationsPortal = () => {
    try {
      Linking.openURL('https://portal.indephysio.com/translations');
    } catch (error) {
        Alert.alert('Error', 'Failed to open URL:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image 
            source={topBgBackground} 
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
            onError={() => console.warn('Failed to load background image')}
            accessible={false}
          />
        </View>
        <PageTitle pageName="Translations" />
      </View>
      
      <View className="flex-1 justify-center items-center px-4 sm:px-6 md:px-8">
        <View className="w-full max-w-md">
          <View className="items-center">
            <Icon name="translate" size={windowWidth > 768 ? 100 : 80} color="#6366f1" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mt-6 mb-2 text-center">
            Translations Portal
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            The translations feature is currently only available through our web portal. 
            Please tap the button below to access it.
          </Text>
          <TouchableOpacity
            className="bg-indigo-600 py-3 px-6 rounded-lg w-full"
            activeOpacity={0.7}
            onPress={handleOpenTranslationsPortal}
            accessibilityLabel="Open Translations Portal"
            accessibilityRole="button">
            <Text className="text-white font-bold text-center text-lg">
              Open Translations Portal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;
