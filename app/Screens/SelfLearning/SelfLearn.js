import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import SearchComponent from '../../Components/SearchComponent/Index';
import LanguageComponent from '../../Components/LanguageComponent/LanguageComponent';
import {ROUTES} from '../../Constants/routes';
import Example from './LanguageCard';

const SelfLearn = () => {
  return (
    <View style={styles.selfLearn}>
      <Example
        route={ROUTES.LEVEL}
        id="2"
        // img="https://d2c9u2e33z36pz.cloudfront.net/uploads/1722684549ndephysio App Icon draft 3 (1).png"
        img="https://app.indephysio.com/assets/de-DW6ic9wV.jpg"
        name="German Language"
        description="Committed individuals seeking to attain fluency and proficiency in the German language."
      />
    </View>
  );
};

export default SelfLearn;

const styles = StyleSheet.create({
  selfLearn: {
    paddingTop: 5,
    backgroundColor: 'white',
    flex: 1,
    paddingLeft: '3%',
    paddingRight: '3%',
  },
});
