import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import color from '../../Constants/color';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import LinearGradient from 'react-native-linear-gradient';
import LoadingArea from '../../Components/Loading/Index';

const Index = () => {
  const {path, langId, clientId, isDark, loader, setLoader} =
    useContext(AppContext);
  const [levels, setLevels] = useState([]);
  const navigation = useNavigation();
  const levelLangId = 1;
  const style = isDark ? DarkTheme : LighTheme;

  useEffect(() => {
    const fetchLevels = async () => {
      setLoader(true);
      try {
        const token = await storage.getStringAsync('token');
        if (token) {
          const response = await axios.get(`${path}/levels/${langId}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.status) {
            setLevels(response.data.data);
          } else {
            console.error('No levels found for this language ID');
          }
          setLoader(false);
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Error fetching levels: ', error);
      }
    };

    fetchLevels();
  }, []);
  const progressArray = [true, true, false, false, false];
  const completedCount = progressArray.filter(Boolean).length;
  const total = progressArray.length;
  const progressPercentage = Math.round((completedCount / total) * 100);

  const renderItem = ({item}) => (
    <TouchableOpacity
      hitSlop={{x: 25, y: 15}}
      onPress={
        item.completed
          ? null
          : () =>
              navigation.navigate(ROUTES.CHAPTERS, {level_id: item.level_id})
      }>
      <LinearGradient
        colors={['#2A89C6', '#3397CB', '#0C5CB4']}
        start={{x: 0, y: 0}} // Start from the left
        end={{x: 1, y: 0}}
        style={styles.level}>
        <View style={styles.levelCard}>
          {/* Left Side: Image */}
          <Image
            source={{
              uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.level_img}`,
            }}
            style={styles.levelImage}
            resizeMode="cover"
          />

          {/* Right Side: Level Info */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>{item.level_name}</Text>
            <Text style={styles.levelDescription}>
              {item.level_description}
            </Text>

            {/* Dynamic Level Progress */}
            <View style={styles.progressWrapper}>
              <Text style={styles.progressText}>{progressPercentage}%</Text>
              {progressArray.map((num, index) => (
                <React.Fragment key={index}>
                  <View
                    style={[
                      styles.progressDot,
                      num && styles.progressDotFilled,
                    ]}
                  />
                  {index < progressArray.length - 1 && (
                    <View
                      style={[
                        styles.progressLine,
                        num && styles.progressLineFilled,
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
              <Text style={{marginLeft: 5, fontSize: 12, color: color.black}}>
                100%
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loader) {
    return (
      <>
        <LoadingArea />
      </>
    );
  }

  return (
    <SafeAreaView style={style.levelcontainer}>
      <FlatList
        data={levels}
        renderItem={renderItem}
        keyExtractor={item => item.level_id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    height: 120,
    // backgroundColor: color.lowPrimary,
    borderRadius: 10,
    shadowColor: color.lowPrimary,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  levelImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  levelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: '700',
    color: color.black,
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginBottom: 10,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressText: {
    fontSize: 12,
    color: color.black,
    marginRight: 5,
  },
  progressDot: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  progressDotFilled: {
    backgroundColor: 'green',
  },
  progressLine: {
    width: 15,
    height: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
  },
  progressLineFilled: {
    width: 15,
    height: 2,
    backgroundColor: 'green',
    marginHorizontal: 5,
  },
});
