import {View, Text, ScrollView, Image, Dimensions} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {AppContext} from '../../theme/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';

const GlobalLeaderboard = () => {
  const {isDark} = useContext(AppContext);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get('window').height,
  );

  useEffect(() => {
    const dimensionsHandler = () => {
      setScreenWidth(Dimensions.get('window').width);
      setScreenHeight(Dimensions.get('window').height);
    };

    const subscription = Dimensions.addEventListener(
      'change',
      dimensionsHandler,
    );

    return () => subscription.remove();
  }, []);

  return (
    <View className={`flex-1 bg-b50`}>
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            onError={() => console.warn('Failed to load background image')}
          />
        </View>
        <PageTitle pageName="Leaderboard" />
      </View>

      <View className="flex-row justify-between items-center px-4">
        <Text
          className={`text-[24px] font-bold text-center mt-4 ${
            isDark ? 'text-white' : 'text-n0'
          }`}>
          Top Performers
        </Text>
        <Icon name="trophy-outline" size={24} color="#FFD700" />
      </View>

      {/* Podium cards */}
      <View className="flex-row justify-center items-end mt-4 px-4">
        {/* 2nd place */}
        <View
          className={`w-[100px] h-[140px] rounded-xl mr-2 justify-between items-center p-3 bg-b200`}>
          <View className="w-[60px] h-[60px] rounded-full bg-[rgba(192,192,192,0.2)] justify-center items-center">
            <Icon name="medal-outline" size={36} color="#C0C0C0" />
          </View>
          <Text
            className={`text-[16px] font-bold ${
              isDark ? 'text-white' : 'text-n0'
            }`}>
            2nd
          </Text>
          <Text
            className={`text-[12px] ${isDark ? 'text-gray-300' : 'text-n400'}`}>
            ??
          </Text>
        </View>

        {/* 1st place - highlighted */}
        <View className="w-[120px] h-[180px] rounded-xl mx-2 shadow-lg overflow-hidden">
          <LinearGradient
            colors={['#613BFF', '#7C5CFF']}
            className="w-full h-full justify-between items-center p-3">
            <View className="w-[70px] h-[70px] rounded-full bg-[rgba(255,255,255,0.3)] justify-center items-center">
              <Icon name="trophy" size={44} color="#FFFFFF" />
            </View>
            <Text className="text-[20px] font-bold text-white">1st</Text>
            <Text
              className={`text-[12px] ${
                isDark ? 'text-gray-300' : 'text-b50'
              }`}>
              ??
            </Text>
          </LinearGradient>
        </View>

        {/* 3rd place */}
        <View
          className={`w-[100px] h-[120px] rounded-xl ml-2 justify-between items-center p-3 ${
            isDark ? 'bg-n75' : 'bg-b75'
          }`}>
          <View className="w-[50px] h-[50px] rounded-full bg-[rgba(205,127,50,0.2)] justify-center items-center">
            <Icon name="ribbon-outline" size={30} color="#CD7F32" />
          </View>
          <Text
            className={`text-[16px] font-bold ${
              isDark ? 'text-white' : 'text-n0'
            }`}>
            3rd
          </Text>
          <Text
            className={`text-[12px] ${isDark ? 'text-gray-300' : 'text-n400'}`}>
            ??
          </Text>
        </View>
      </View>

      {/* Leaderboard list - using more screen space */}
      <ScrollView
        className="mt-6 mx-4 flex-1"
        showsVerticalScrollIndicator={false}
        style={{maxHeight: screenHeight * 0.55}}>
        <View
          className={`w-full rounded-xl p-4 ${isDark ? 'bg-n6' : 'bg-b50'}`}
          style={{width: screenWidth - 32}}>
          {[4, 5, 6, 7, 8, 9, 10, 11, 12, 15].map(position => (
            <View key={position} className="flex-row items-center mb-4">
              <View className="w-8 h-8 rounded-full bg-b75 justify-center items-center mr-3">
                <Text className="font-bold text-n0">{position}</Text>
              </View>
              <View className="flex-1">
                <Text
                  className={`font-semibold ${
                    isDark ? 'text-white' : 'text-n0'
                  }`}>
                  {position === 4
                    ? ' ★★★'
                    : position === 5
                    ? ' ★★★'
                    : position === 6
                    ? ' ★★★'
                    : position === 7
                    ? ' ★★★'
                    : position === 8
                    ? ' ★★★'
                    : ' ★★★'}
                </Text>
                <Text
                  className={`text-xs ${isDark ? 'text-n40' : 'text-n400'}`}>
                  {position === 4
                    ? '1250'
                    : position === 5
                    ? '1120'
                    : position === 6
                    ? '980'
                    : position === 7
                    ? '840'
                    : position === 8
                    ? '700'
                    : '560'}{' '}
                  points
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Gradient mask at bottom of list */}
      <View style={{position: 'relative', marginTop: -20, zIndex: 10}}>
        <LinearGradient
          colors={[
            isDark ? 'rgba(18,18,18,0)' : 'rgba(239,235,255,0)',
            isDark ? 'rgba(18,18,18,1)' : 'rgba(239,235,255,1)',
          ]}
          className="h-20"
          style={{width: screenWidth - 32, alignSelf: 'center'}}
        />
      </View>

      {/* Not available message - positioned at absolute bottom */}
      <View
        className="p-5 mx-4 mb-4 rounded-xl bg-p1 shadow-sm"
        style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
        <Text
          className={`text-base text-center font-medium ${
            isDark ? 'text-white' : 'text-b50'
          }`}>
          Not available at the moment
        </Text>
        <Text className={`text-sm text-center mt-2 text-b50`}>
          The complete leaderboard will be coming soon. Stay tuned!
        </Text>
      </View>
    </View>
  );
};

export default GlobalLeaderboard;
