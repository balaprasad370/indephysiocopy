import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {useCallback, useState, useMemo, useEffect} from 'react';
import LottieView from 'lottie-react-native';
import axiosInstance from '../../Components/axiosInstance';
import storage from './../../Constants/storage';

const {width, height} = Dimensions.get('window');

// Make item size responsive to screen dimensions
const ITEM_SIZE = Math.min(width * 0.2, 120); // Cap at 120px for larger screens
const SPACING = Math.min(height * 0.05, 40); // Cap at 40px for larger screens

const Level = () => {
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (!dataFetched) {
      getLevels();
      setDataFetched(true);
    }
  }, [dataFetched, getLevels]);

  const getLevels = useCallback(async () => {
    try {
      // Check if cached data exists and is not expired
      const cachedTimestamp = await storage.getStringAsync(
        'levelsDataTimestamp',
      );
      const currentTime = new Date().getTime();

      // 30 minutes in milliseconds
      const thirtyMinutes = 30 * 60 * 1000;

      // If we have cached data and it's less than 30 minutes old
      if (
        cachedTimestamp &&
        currentTime - parseInt(cachedTimestamp) < thirtyMinutes
      ) {
        const data = await storage.getStringAsync('levelsData');
        if (data) {
          setLevels(JSON.parse(data));
          setLoading(false);
          return;
        }
      }

      // If no cached data or it's expired, fetch new data
      setLoading(true);
      const response = await axiosInstance.get('/student/profile/level/status');

      if (response.data && response.data.levels) {
        setLevels(response.data.levels);
        // Save the fetched data to storage for future use
        await storage.setStringAsync(
          'levelsData',
          JSON.stringify(response.data.levels),
        );
        // Save the current timestamp
        await storage.setStringAsync(
          'levelsDataTimestamp',
          currentTime.toString(),
        );
      } else {
        setError('Invalid response format');
      }
    } catch (error) {
      console.log(error?.response?.data || error.message);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  // Find the last active level
  const lastActiveLevelIndex = useMemo(() => {
    if (!levels.length) return -1;

    for (let i = levels.length - 1; i >= 0; i--) {
      if (levels[i].status === true) {
        return i;
      }
    }
    return -1;
  }, [levels]);

  // Create animated styles outside of the render method
  const getItemStyle = useCallback(
    index => {
      if (!levels[index]) return {};

      const position = levels[index].position;
      let translateX = 0;

      if (position === 'center-left') {
        translateX = -width * 0.25;
      } else if (position === 'center-right') {
        translateX = width * 0.25;
      }

      const isActive = levels[index].status === true;

      return {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: ITEM_SIZE / 2,
        backgroundColor: isActive
          ? levels[index].backgroundColor
          : 'transparent',
        borderWidth: isActive ? 0 : 2,
        borderColor: isActive ? 'transparent' : levels[index].backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
          {
            scale: isActive ? 1.1 : 1,
          },
          {
            translateX: translateX,
          },
        ],
        zIndex: 1,
      };
    },
    [levels, width],
  );

  const getLabelStyle = useCallback(
    index => {
      if (!levels[index]) return {};

      const position = levels[index].position;
      let translateX = 0;

      if (position === 'center-left') {
        translateX = -width * 0.27;
      } else if (position === 'center-right') {
        translateX = width * 0.25;
      }

      return {
        marginTop: 8,
        transform: [
          {
            translateX: translateX,
          },
        ],
      };
    },
    [levels, width],
  );

  const renderLevelItem = useCallback(
    ({item, index}) => {
      const itemStyle = getItemStyle(index);
      const labelStyle = getLabelStyle(index);

      return (
        <View key={item.id} style={{marginBottom: SPACING}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Animated.View style={itemStyle}>
              <LottieView
                source={{
                  uri: item.lottie,
                }}
                autoPlay
                loop
                style={{width: ITEM_SIZE * 0.8, height: ITEM_SIZE * 0.8}}
              />
            </Animated.View>

            {/* Custom "We are here" animation only for the last active level */}
            {item.status && index === lastActiveLevelIndex && (
              <View
                style={{
                  position: 'absolute',
                  left:
                    item.position === 'center'
                      ? ITEM_SIZE + 20
                      : item.position === 'center-left'
                      ? width * 0.01
                      : item.position === 'center-right'
                      ? -width * 0.25
                      : ITEM_SIZE + 20,
                }}>
                <LottieView
                  source={{
                    uri: item.hereAnimation,
                  }}
                  autoPlay
                  loop
                  style={{width: ITEM_SIZE * 0.9, height: ITEM_SIZE * 0.9}}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: item.backgroundColor,
                    textAlign: 'center',
                    marginTop: 5,
                  }}>
                  {item.hereLabel}
                </Text>
              </View>
            )}
          </View>
          <Animated.Text
            style={[
              {
                fontSize: 12,
                fontWeight: '600',
                color: item.status ? item.backgroundColor : '#fff',
                textAlign: 'center',
                width: ITEM_SIZE,
              },
              labelStyle,
            ]}>
            {item.label}
          </Animated.Text>
        </View>
      );
    },
    [getItemStyle, getLabelStyle, lastActiveLevelIndex, width, ITEM_SIZE],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#5AC8FA" />
      </View>
    );
  }

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      {levels.length > 0 ? (
        <FlatList
          data={levels}
          renderItem={renderLevelItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            alignItems: 'center',
            paddingTop: height * 0.1,
            paddingBottom: height * 0.1,
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>
            {error || loading ? 'Loading...' : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Level;
