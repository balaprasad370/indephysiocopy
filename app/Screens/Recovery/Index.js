import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import AuthInput from '../../Components/InputFields/AuthInput';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthTitle from '../../Components/CommonLines/AuthTitle';

const Index = () => {
  return (
    <View style={{}}>
      <View style={{height: '10%'}}></View>
      <View>
        <AuthTitle authTitle="Recovery Password" />
        <AuthLine authLine="The enter your email below to recieve your password reset instructions." />
      </View>
      <View style={styles.inputField}>
        <AuthInput placeholder="Email" />
        <CommonButtonAuth buttonTitle="Recovery Password" />
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
