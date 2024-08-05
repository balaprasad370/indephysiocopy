import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import color from '../../Constants/color';
import {ROUTES} from '../../Constants/routes';
import {useNavigation} from '@react-navigation/native';

const LanguageComponent = ({route}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.languageCard}
      onPress={() => navigation.navigate(route)}>
      <View style={styles.upperLanguage}>
        <Text style={styles.upperText}>German</Text>
        <Text style={styles.flag}>🇩🇪</Text>
      </View>
      <View style={styles.bottomLanaguage}>
        <Text style={styles.bottomText}>Learn German</Text>
        <Text style={styles.level}>Level: A1 A2 B1 B2</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LanguageComponent;

const styles = StyleSheet.create({
  languageCard: {
    width: '50%',
    borderRadius: 12,
    backgroundColor: color.lowPrimary,
    marginTop: 20,
  },
  upperLanguage: {
    backgroundColor: 'black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
  upperText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
  },
  flag: {
    fontSize: 24,
  },
  bottomLanaguage: {
    paddingLeft: 10,
    paddingRight: 5,
    marginTop: 10,
  },
  bottomText: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: 5,
  },
  level: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 20,
  },
});
