import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import GlssIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppContext} from '../../theme/AppContext';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';

const Index = ({name, title, isLocked}) => {
  const appContext = useContext(AppContext);

  const {isDark, setIsDark} = appContext;

  const style = isDark ? DarkTheme : LighTheme;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
      }}>
      <View style={style.chapterBox}>
        <View
          style={
            isLocked ? style.chapterContainer : style.chapterLockContainer
          }>
          <Image
            source={require('../../Constants/gls.png')}
            style={{
              width: 100,
              height: 100,
              marginBottom: 10,
              opacity: isLocked ? 0.3 : 1,
              backgroundColor: 'transparent',
            }}
          />
          {isLocked ? (
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{translateX: -50}, {translateY: -20}],
              }}>
              <GlssIcon name="lock" style={{fontSize: 26}} />
              <Text style={style.lockText}>Take quiz to unlock</Text>
            </View>
          ) : null}
          <Text style={style.chapterName}>{name}</Text>
        </View>
      </View>

      <Text style={style.chapterTitle}>{title}</Text>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
