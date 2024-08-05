import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SearchComponent from '../../Components/SearchComponent/Index';
import LanguageComponent from '../../Components/LanguageComponent/LanguageComponent';
import {ROUTES} from '../../Constants/routes';

const SelfLearn = () => {
  return (
    <View style={styles.selfLearn}>
      <SearchComponent />
      <LanguageComponent route={ROUTES.LEVEL} />
    </View>
  );
};

export default SelfLearn;

const styles = StyleSheet.create({
  selfLearn: {
    backgroundColor: 'white',
    flex: 1,
    padding: '3%',
  },
});
