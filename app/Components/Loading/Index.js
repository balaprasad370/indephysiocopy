import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import color from '../../Constants/color';
// import LoaderKit from 'react-native-loader-kit';

const Index = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}>
      {/* <LoaderKit
        style={{
          width: 50,
          height: 50,
        }}
        name={'LineScalePulseOutRapid'}
        color={color.lowPrimary}
      /> */}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
