import React, {useRef, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import color from '../../Constants/color';

const OTPInput = ({length = 4}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    if (text.length === 1) {
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < length - 1) {
        inputs.current[index + 1].focus();
      }
    } else if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={otp[index]}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          ref={input => (inputs.current[index] = input)}
          maxLength={1}
          keyboardType="number-pad"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    padding: 10,
    backgroundColor: color.inputColor,
    borderRadius: 8,

    borderColor: '#000',
    textAlign: 'center',
    fontSize: 18,
    height: 55,
    width: '17%',
  },
});

export default OTPInput;
