import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import color from '../../Constants/color';
import {useNavigation} from '@react-navigation/native';

const RememberField = ({route}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.forgot}>
      <Text style={styles.remember}>Remember me</Text>
      <TouchableOpacity onPress={() => navigation.navigate(route)}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RememberField;

const styles = StyleSheet.create({
  remember: {
    fontSize: 18,
  },
  forgotPassword: {
    fontSize: 18,
    color: color.darkPrimary,
  },
  forgot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
