import React, {useContext} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import SearchComponent from '../../Components/SearchComponent/Index';
import LanguageComponent from '../../Components/LanguageComponent/LanguageComponent';
import {ROUTES} from '../../Constants/routes';
import Example from './LanguageCard';
import {AppContext} from '../../theme/AppContext';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import LinearGradient from 'react-native-linear-gradient';

const SelfLearn = () => {
  const {langCode, isDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  return (
    <View style={style.selfLearn}>
      <Example
        route={ROUTES.LEVEL}
        langCode={langCode}
        id="2"
        img="https://app.indephysio.com/assets/de-DW6ic9wV.jpg"
        name="German Language"
        description="Committed individuals seeking to attain fluency and proficiency in the German language."
      />
    </View>
  );
};

export default SelfLearn;

const styles = StyleSheet.create({});
