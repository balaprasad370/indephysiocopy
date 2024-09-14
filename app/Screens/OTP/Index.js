import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthInput from '../../Components/InputFields/AuthInput';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import LineAfterBtn from '../../Components/CommonLines/LineAfterBtn';
import OTPInput from '../../Components/InputFields/OTPInput';

const Index = () => {
  return (
    <View style={{}}>
      <View style={{height: '10%'}}></View>
      <View>
        <AuthTitle authTitle="OTP Authentication" />
        <AuthLine authLine="An authentication code has been sent to example@gmail.com" />
      </View>
      <View style={styles.inputField}>
        <OTPInput />
      </View>
      <View style={styles.OTPBottom}>
        <LineAfterBtn
          lineBefore="Didn't recieve the code?"
          secondBtn="Resend"
        />
        <CommonButtonAuth buttonTitle="Continue" />
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  OTPBottom: {
    marginTop: 20,
  },
});
