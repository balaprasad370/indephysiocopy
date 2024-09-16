import React, {useContext, useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
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

const SelfLearn = () => {
  const {langCode, isDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const [languages, setLanguages] = useState([]);

  const getLanguages = async () => {
    try {
      const response = await axios.get(
        'https://server.indephysio.com/languages',
      );
      console.log(response.data);
      setLanguages(response.data);
    } catch (error) {
      console.log('Langg', error);
    }
  };

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <View style={style.selfLearn}>
      <View style={style.example}>
        <View style={{width: '90%', alignSelf: 'center'}}>
          <Text style={style.exampleScreen}>Subjects</Text>
        </View>
      </View>

      {languages && languages.length > 0 ? (
        <View>
          <FlatList
            data={languages}
            renderItem={({item, index}) => {
              return (
                <View key={index} style={{marginVertical: 8}}>
                  <Example
                    route={ROUTES.LEVEL}
                    lang_id={item.lang_id}
                    id={index}
                    img={`https://d2c9u2e33z36pz.cloudfront.net/${item.lang_img}`}
                    name={item.language_name}
                    description={item.language_description}
                  />
                </View>
              );
            }}
          />
        </View>
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
    </View>
  );
};

export default SelfLearn;

const styles = StyleSheet.create({});
