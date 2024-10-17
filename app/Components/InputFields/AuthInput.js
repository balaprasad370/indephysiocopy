import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';
import scale from '../../utils/utils';

const AuthInput = ({
  value,
  onChangeText,
  placeholder,
  wrong,
  secureTextEntry,
  errorMessage,
  isSmall,
}) => {
  return (
    <View style={styles.inputContainer}>
      <View
        style={
          !isSmall
            ? wrong
              ? styles.authInputAlert
              : styles.authInput
            : wrong
            ? styles.authsmallInputAlert
            : styles.authSmallInput
        }>
        <TextInput
          placeholderTextColor={color.grey}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.authInputField}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default AuthInput;
const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10,
  },
  authInput: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.inputColor,
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: color.inputColor,
  },
  authSmallInput: {
    width: scale(160),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.inputColor,
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: color.inputColor,
  },
  authsmallInputAlert: {
    width: scale(160),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.inputColor,
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: color.inputColor,
  },
  authInputAlert: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.danger,
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: color.inputColor,
  },
  authInputField: {
    fontSize: 18,
    padding: 4,
    width: '100%',
  },
  errorText: {
    color: color.danger,
    fontSize: 14,
    marginTop: 5,
  },
});
