import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import {AppContext} from '../../theme/AppContext';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import plan from '../../assets/plan.png';
import referral from '../../assets/referral.png';
import scale from '../../utils/utils';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';

const index = ({
  locked,
  courseTitle,
  toggleModal,
  middleCourseCard,
  bottomCourseCard,
  plane,
  refer,
}) => {
  const {isDark, setIsDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const navigation = useNavigation();

  const handleScreen = () => {
    if (courseTitle === 'Referral Portal') {
      navigation.navigate(ROUTES.PORTAL);
    }
  };

  return (
    <TouchableOpacity style={style.courseCard} onPress={handleScreen}>
      <View style={locked ? style.courseLockCard : style.courseUnlockCard}>
        {locked ? (
          <View
            style={{
              position: 'absolute',
              left: scale(36),
              top: scale(50),
              zIndex: 9999,
            }}>
            <Icon name="lock" style={{fontSize: 50, color: 'white'}} />
          </View>
        ) : null}
        <Text style={style.registeredText}>{courseTitle}</Text>
        <Text
          style={
            !locked ? style.courseBottomText : style.courselockedBottomText
          }>
          {middleCourseCard}
        </Text>
        {plane && <Image source={plan} style={{width: scale(65)}} />}
        {refer && (
          <Image
            source={referral}
            style={{width: scale(30), height: scale(30)}}
          />
        )}
        <TouchableOpacity>
          <Text style={style.courseBottomBtn}>{bottomCourseCard}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default index;

const styles = StyleSheet.create({});
