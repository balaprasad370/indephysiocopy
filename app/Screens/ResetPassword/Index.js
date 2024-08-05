import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthInput from '../../Components/InputFields/AuthInput';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import SocialMediaButton from '../../Components/Buttons/SocialMediaButton';

const Index = () => {
  return (
    <View style={{}}>
      <View style={{height: '10%'}}></View>
      <View>
        <AuthTitle authTitle="Reset Password" />
        <AuthLine authLine="The password should have atleast 6 character." />
      </View>
      <View style={styles.inputField}>
        <AuthInput placeholder="*********" />
        <AuthInput placeholder="Confirm Password" />
        <CommonButtonAuth buttonTitle="Reset Password" />
      </View>
    </View>
  );
};

export default Index;
const styles = StyleSheet.create({
  inputField: {
    marginTop: 20,
  },
});
