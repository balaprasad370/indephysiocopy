import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {AppContext} from '../../theme/AppContext';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const index = ({locked, toggleModal, middleCourseCard, bottomCourseCard}) => {
  const appContext = useContext(AppContext);

  const {isDark, setIsDark} = appContext;

  const style = isDark ? DarkTheme : LighTheme;
  return (
    <TouchableOpacity onPress={toggleModal} style={style.courseCard}>
      <View style={locked ? style.courseLockCard : style.courseUnlockCard}>
        {locked ? (
          <View style={{position: 'absolute', left: 40, top: 50}}>
            <Icon name="lock" style={{fontSize: 50, color: 'white'}} />
          </View>
        ) : null}
        <Text style={style.registeredText}>Registered</Text>
        <Text
          style={
            !locked ? style.courseBottomText : style.courselockedBottomText
          }>
          {middleCourseCard}
        </Text>
        <TouchableOpacity>
          <Text style={style.courseBottomBtn}>{bottomCourseCard}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default index;

const styles = StyleSheet.create({});
