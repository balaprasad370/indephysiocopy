import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SearchComponent from '../../Components/SearchComponent/Index';
import LanguageComponent from '../../Components/LanguageComponent/LanguageComponent';
import {ROUTES} from '../../Constants/routes';
import Example from './LanguageCard';
import {AppContext} from '../../theme/AppContext';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import color from '../../Constants/color';
import Loading from '../../Components/Loading/Loading';
import storage from '../../Constants/storage';
import {useNavigation} from '@react-navigation/native';

const SelfLearn = () => {
  const {langCode, isDark, loader, setLoader, path} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const [languages, setLanguages] = useState([]);

  const getLanguages = async () => {
    const token = await storage.getStringAsync('token');
    try {
      setLoader(true);
      const response = await axios.get(`${path}/student/languages`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('laguages', response.data);
      setLanguages(response.data.data);
    } catch (error) {
      console.log('Langg', error);
    } finally {
      setLoader(false);
    }
  };
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getLanguages);
    return unsubscribe;
  }, []);
  if (loader) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={style.selfLearn}>
      <ScrollView>
        <View style={style.example}>
          <View style={{width: '90%', alignSelf: 'center'}}>
            <Text style={style.exampleScreen}>Subjects</Text>
          </View>
        </View>
        {languages && languages.length > 0 ? (
          languages.map((item, index) => {
            return (
              <View key={index} style={{marginVertical: 8}}>
                <Example
                  route={ROUTES.LEVEL}
                  lang_id={item.lang_id}
                  id={index}
                  img={`https://d2c9u2e33z36pz.cloudfront.net/${item.lang_img}`}
                  name={item.language_name}
                  description={item.language_description}
                  status={item.status}
                />
              </View>
            );
          })
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: '900'}}>
              You don't have access of this premium content
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelfLearn;

const styles = StyleSheet.create({});
