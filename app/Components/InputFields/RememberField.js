import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import color from '../../Constants/color';
import {useNavigation} from '@react-navigation/native';
import {Checkbox} from 'react-native-paper';
import scale from '../../utils/utils';

const RememberField = ({route}) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.forgot}>
      {/* <View style={styles.checkBox}>
        <Checkbox
          status={isChecked ? 'checked' : 'unchecked'}
          onPress={() => setIsChecked(!isChecked)}
        />
        <Text style={styles.remember}>Remember me</Text>
      </View> */}
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        onPress={() => navigation.navigate(route)}>
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
  checkBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: 18,
    color: color.darkPrimary,
  },
  forgot: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
});
