import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TouchableHighlight,
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
import Loading from '../../Components/Loading/Loading';
import IconTimer from 'react-native-vector-icons/Ionicons';

const Index = ({route}) => {
  const {path, langId, clientId, isDark, loader, setLoader} =
    useContext(AppContext);

  const {lang_id} = route.params;
  const [levels, setLevels] = useState([]);
  const navigation = useNavigation();
  const levelLangId = 1;
  const style = isDark ? DarkTheme : LighTheme;

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setLoader(true);
        const token = await storage.getStringAsync('token');
        console.log('my', lang_id);

        if (token) {
          const response = await axios.get(`${path}/levels/${lang_id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('response', response.data.data);

          if (response.data.status) {
            setLevels(response.data?.data);
          } else {
            setLevels([]);
            console.log('No levels found for this language ID');
          }
        } else {
          console.log('No token found');
        }
      } catch (error) {
        console.log('Error fetching levels: ', error.response);
      } finally {
        setLoader(false);
      }
    };

    fetchLevels();
  }, [lang_id, path]); // Add dependencies if necessary

  const progressArray = [true, true, false, false, false];
  const completedCount = progressArray.filter(Boolean).length;
  const total = progressArray.length;
  const progressPercentage = Math.round((completedCount / total) * 100);

  const renderItem = ({item}) => (
    <TouchableOpacity
      hitSlop={{x: 0, y: 0}}
      onPress={
        item.completed
          ? null
          : (item.status.a1 === 'locked' && item.level_name.includes('A1')) ||
            (item.status.a2 === 'locked' && item.level_name.includes('A2')) ||
            (item.status.b1 === 'locked' && item.level_name.includes('B1')) ||
            (item.status.b2 === 'locked' && item.level_name.includes('B2')) ||
            (item.status.exam_module === 'locked' &&
              item.level_name.includes('Exam Module'))
          ? null // Disable press if the respective level is locked
          : () =>
              navigation.navigate(ROUTES.CHAPTERS, {level_id: item.level_id})
      }>
      <LinearGradient
        colors={[color.lowPrimary, color.lowPrimary]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.level}>
        <View style={{position: 'absolute', left: '50%', zIndex: 9999}}>
          <IconTimer
            name={
              item.status.a1 === 'locked' && item.level_name.includes('A1')
                ? 'lock-closed-sharp'
                : item.status.a2 === 'locked' && item.level_name.includes('A2')
                ? 'lock-closed-sharp'
                : item.status.b1 === 'locked' && item.level_name.includes('B1')
                ? 'lock-closed-sharp'
                : item.status.exam_module === 'locked' &&
                  item.level_name.includes('Exam Module')
                ? 'lock-closed-sharp'
                : item.status.b2 === 'locked' && item.level_name.includes('B2')
                ? 'lock-closed-sharp'
                : null
            }
            style={{fontSize: 26}}
            color="black"
          />
        </View>
        <View
          style={[
            styles.levelCard,
            {
              opacity:
                (item.status.a1 === 'locked' &&
                  item.level_name.includes('A1')) ||
                (item.status.a2 === 'locked' &&
                  item.level_name.includes('A2')) ||
                (item.status.b1 === 'locked' &&
                  item.level_name.includes('B1')) ||
                (item.status.b2 === 'locked' &&
                  item.level_name.includes('B2')) ||
                (item.status.exam_module === 'locked' &&
                  item.level_name.includes('Exam Module'))
                  ? 0.1
                  : 1,
            },
          ]}>
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
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loader) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={style.levelcontainer}>
      {levels.length > 0 ? (
        <FlatList
          data={levels}
          renderItem={renderItem}
          keyExtractor={item => item.level_id.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, fontWeight: '900'}}>
            There is no content
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 20,
    padding: 5,
    marginHorizontal: 5,
    marginVertical: 8,
    // height: 120,
    // backgroundColor: color.lowPrimary,
    borderRadius: 10,
    shadowColor: color.lowPrimary,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 1,
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
    position: 'relative',
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
