import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import color from '../../Constants/color';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import LinearGradient from 'react-native-linear-gradient';
import Loading from '../../Components/Loading/Loading';

const Index = ({navigation}) => {
  const route = useRoute();
  const {level_id} = route.params;
  const {path, clientId, packageId, packageName, isDark, loader, setLoader} =
    useContext(AppContext);
  const [chapter, setChapter] = useState([]);
  let newPackageId = packageId;

  const style = isDark ? DarkTheme : LighTheme;

  const chapterData = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      setLoader(true);
      try {
        const response = await axios.get(`${path}/chapters`, {
          params: {
            level_id: level_id,
            client_id: clientId,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setChapter(response.data);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    chapterData();
  }, []);

  if (loader) {
    return <Loading />;
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      hitSlop={{x: 25, y: 15}}
      onPress={() =>
        navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
          parent_module_id: item.id,
          title: item.name,
        })
      }
      style={{marginVertical: 6}}>
      <LinearGradient
        style={styles.chapterBox}
        colors={
          isDark
            ? ['#2A89C6', '#3397CB', '#0C5CB4']
            : [color.lightPrimary, color.lightPrimary, color.lightPrimary]
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <View style={styles.chapterCard}>
          {item.image ? (
            <Image
              source={{
                uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.image}`,
              }}
              style={styles.chapterImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                backgroundColor: 'white',
                width: 70,
                height: 70,
                borderRadius: 10,
                marginRight: 15,
              }}></View>
          )}

          {/* Right Side: Chapter Info */}
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterName}>{item.name}</Text>
            <Text style={styles.chapterDescription}>{item.description}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={style.chapterContainer}>
      {chapter.length > 0 ? (
        <FlatList
          data={chapter}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
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
  chapterBox: {
    width: '100%',
    backgroundColor: color.lowPrimary,
    borderRadius: 15,
    padding: 5,
    shadowColor: color.lowPrimary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chapterInfo: {
    justifyContent: 'center',
  },
  chapterName: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  chapterDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
