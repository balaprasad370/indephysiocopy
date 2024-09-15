import React, {useCallback, useContext, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import color from '../../Constants/color';

export default function Example({id, lang_id, img, name, description, route}) {
  const navigation = useNavigation();

  const {isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  return (
    <LinearGradient
      colors={[color.lightPrimary, color.lowPrimary]} // Gradient colors
      start={{x: 0, y: 0}} // Start from the left
      end={{x: 1, y: 0}} // End at the right
      style={{borderRadius: 10, width: '90%', alignSelf: 'center'}}>
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        key={id}
        onPress={() => navigation.navigate(route, {lang_id: lang_id})}>
        <View style={styles.card}>
          <View style={styles.cardLikeWrapper}>
            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              onPress={() => handleSave(id)}></TouchableOpacity>
          </View>

          <View style={styles.cardTop}>
            {img ? (
              <Image
                alt=""
                resizeMode="cover"
                style={styles.cardImg}
                source={{uri: img}}
              />
            ) : (
              <View style={styles.dummycardImg}>
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={styles.loader}
                />
              </View>
            )}
          </View>

          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={style.selfcardTitle}>{name}</Text>
            </View>

            <Text style={style.cardDates}>{description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  /** Header */
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTop: {
    marginHorizontal: -6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
  },
  /** Card */
  card: {
    position: 'relative',
    borderRadius: 8,
    // backgroundColor: '#f1f1f8',
    paddingBottom: 6,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  cardLikeWrapper: {
    position: 'absolute',
    zIndex: 1,
    top: 12,
    right: 12,
  },
  cardLike: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardImg: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  dummycardImg: {
    width: '100%',
    backgroundColor: color.lighGrey,
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardBody: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardStars: {
    marginLeft: 2,
    marginRight: 4,
    fontSize: 15,
    fontWeight: '500',
    color: '#232425',
  },
  cardPrice: {
    marginTop: 6,
    fontSize: 16,
    color: '#232425',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
});

const data = [
  {
    created_date: '2024-09-09T15:49:05.000Z',
    id: 1,
    marks: 0,
    modified_date: '2024-09-15T11:16:49.000Z',
    module_id: 53,
    student_id: 9,
    total: 10,
  },
  {
    created_date: '2024-09-11T09:42:46.000Z',
    id: 17,
    marks: 4,
    modified_date: '2024-09-15T11:17:11.000Z',
    module_id: 55,
    student_id: 9,
    total: 15,
  },
  {
    created_date: '2024-09-11T09:51:12.000Z',
    id: 18,
    marks: 4,
    modified_date: '2024-09-14T04:50:12.000Z',
    module_id: 50,
    student_id: 9,
    total: 15,
  },
  {
    created_date: '2024-09-11T17:52:39.000Z',
    id: 19,
    marks: 3,
    modified_date: '2024-09-11T17:52:39.000Z',
    module_id: 52,
    student_id: 9,
    total: 10,
  },
  {
    created_date: '2024-09-11T17:52:57.000Z',
    id: 20,
    marks: 1,
    modified_date: '2024-09-13T18:38:09.000Z',
    module_id: 54,
    student_id: 9,
    total: 5,
  },
  {
    created_date: '2024-09-12T10:55:44.000Z',
    id: 21,
    marks: 10,
    modified_date: '2024-09-12T15:14:29.000Z',
    module_id: 205,
    student_id: 9,
    total: 11,
  },
  {
    created_date: '2024-09-12T15:16:24.000Z',
    id: 22,
    marks: 3,
    modified_date: '2024-09-12T15:16:24.000Z',
    module_id: 49,
    student_id: 9,
    total: 5,
  },
  {
    created_date: '2024-09-13T05:41:12.000Z',
    id: 23,
    marks: 0,
    modified_date: '2024-09-13T05:41:12.000Z',
    module_id: 248,
    student_id: 9,
    total: 5,
  },
  {
    created_date: '2024-09-13T05:41:17.000Z',
    id: 24,
    marks: 0,
    modified_date: '2024-09-13T05:41:17.000Z',
    module_id: 247,
    student_id: 9,
    total: 17,
  },
  {
    created_date: '2024-09-13T05:59:38.000Z',
    id: 25,
    marks: 0,
    modified_date: '2024-09-13T05:59:38.000Z',
    module_id: 419,
    student_id: 9,
    total: 0,
  },
  {
    created_date: '2024-09-13T06:50:43.000Z',
    id: 26,
    marks: 0,
    modified_date: '2024-09-13T13:05:03.000Z',
    module_id: 411,
    student_id: 9,
    total: 13,
  },
  {
    created_date: '2024-09-13T06:50:48.000Z',
    id: 27,
    marks: 0,
    modified_date: '2024-09-13T13:05:16.000Z',
    module_id: 409,
    student_id: 9,
    total: 30,
  },
  {
    created_date: '2024-09-13T06:51:15.000Z',
    id: 28,
    marks: 0,
    modified_date: '2024-09-13T06:51:15.000Z',
    module_id: 414,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T06:51:21.000Z',
    id: 29,
    marks: 0,
    modified_date: '2024-09-13T13:05:11.000Z',
    module_id: 412,
    student_id: 9,
    total: 30,
  },
  {
    created_date: '2024-09-13T06:51:31.000Z',
    id: 30,
    marks: 0,
    modified_date: '2024-09-13T13:04:32.000Z',
    module_id: 413,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T06:58:49.000Z',
    id: 31,
    marks: 0,
    modified_date: '2024-09-13T13:03:47.000Z',
    module_id: 387,
    student_id: 9,
    total: 2,
  },
  {
    created_date: '2024-09-13T06:59:03.000Z',
    id: 32,
    marks: 0,
    modified_date: '2024-09-13T06:59:03.000Z',
    module_id: 393,
    student_id: 9,
    total: 20,
  },
  {
    created_date: '2024-09-13T06:59:09.000Z',
    id: 33,
    marks: 0,
    modified_date: '2024-09-13T13:03:58.000Z',
    module_id: 394,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T06:59:15.000Z',
    id: 34,
    marks: 0,
    modified_date: '2024-09-13T06:59:15.000Z',
    module_id: 391,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T13:02:51.000Z',
    id: 35,
    marks: 0,
    modified_date: '2024-09-13T13:06:46.000Z',
    module_id: 184,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:02:55.000Z',
    id: 36,
    marks: 0,
    modified_date: '2024-09-13T13:02:55.000Z',
    module_id: 182,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:02:57.000Z',
    id: 37,
    marks: 0,
    modified_date: '2024-09-13T13:02:57.000Z',
    module_id: 94,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T13:03:01.000Z',
    id: 38,
    marks: 0,
    modified_date: '2024-09-13T13:03:01.000Z',
    module_id: 88,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T13:03:26.000Z',
    id: 39,
    marks: 0,
    modified_date: '2024-09-13T13:03:26.000Z',
    module_id: 181,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:03:35.000Z',
    id: 40,
    marks: 0,
    modified_date: '2024-09-13T13:03:35.000Z',
    module_id: 183,
    student_id: 9,
    total: 13,
  },
  {
    created_date: '2024-09-13T13:03:56.000Z',
    id: 41,
    marks: 0,
    modified_date: '2024-09-13T13:03:56.000Z',
    module_id: 423,
    student_id: 9,
    total: 0,
  },
  {
    created_date: '2024-09-13T13:04:02.000Z',
    id: 42,
    marks: 0,
    modified_date: '2024-09-13T13:04:02.000Z',
    module_id: 395,
    student_id: 9,
    total: 0,
  },
  {
    created_date: '2024-09-13T13:04:12.000Z',
    id: 43,
    marks: 0,
    modified_date: '2024-09-13T13:04:12.000Z',
    module_id: 396,
    student_id: 9,
    total: 20,
  },
  {
    created_date: '2024-09-13T13:04:23.000Z',
    id: 44,
    marks: 0,
    modified_date: '2024-09-13T13:04:23.000Z',
    module_id: 76,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T13:04:28.000Z',
    id: 45,
    marks: 0,
    modified_date: '2024-09-13T13:04:28.000Z',
    module_id: 75,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T13:04:31.000Z',
    id: 46,
    marks: 0,
    modified_date: '2024-09-13T13:04:31.000Z',
    module_id: 246,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:04:38.000Z',
    id: 47,
    marks: 0,
    modified_date: '2024-09-13T13:04:38.000Z',
    module_id: 415,
    student_id: 9,
    total: 30,
  },
  {
    created_date: '2024-09-13T13:04:45.000Z',
    id: 48,
    marks: 0,
    modified_date: '2024-09-13T13:04:45.000Z',
    module_id: 326,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T13:04:56.000Z',
    id: 49,
    marks: 0,
    modified_date: '2024-09-13T13:04:56.000Z',
    module_id: 250,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:05:24.000Z',
    id: 50,
    marks: 0,
    modified_date: '2024-09-13T13:05:24.000Z',
    module_id: 398,
    student_id: 9,
    total: 20,
  },
  {
    created_date: '2024-09-13T13:05:24.000Z',
    id: 51,
    marks: 0,
    modified_date: '2024-09-13T13:05:24.000Z',
    module_id: 64,
    student_id: 9,
    total: 5,
  },
  {
    created_date: '2024-09-13T13:05:29.000Z',
    id: 52,
    marks: 0,
    modified_date: '2024-09-13T13:05:29.000Z',
    module_id: 399,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:05:31.000Z',
    id: 53,
    marks: 0,
    modified_date: '2024-09-13T13:05:31.000Z',
    module_id: 251,
    student_id: 9,
    total: 24,
  },
  {
    created_date: '2024-09-13T13:05:31.000Z',
    id: 54,
    marks: 0,
    modified_date: '2024-09-13T13:05:31.000Z',
    module_id: 66,
    student_id: 9,
    total: 10,
  },
  {
    created_date: '2024-09-13T13:05:36.000Z',
    id: 55,
    marks: 0,
    modified_date: '2024-09-13T13:05:36.000Z',
    module_id: 65,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:05:37.000Z',
    id: 56,
    marks: 0,
    modified_date: '2024-09-13T13:05:37.000Z',
    module_id: 400,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T13:05:46.000Z',
    id: 57,
    marks: 0,
    modified_date: '2024-09-13T13:05:46.000Z',
    module_id: 67,
    student_id: 9,
    total: 10,
  },
  {
    created_date: '2024-09-13T13:05:47.000Z',
    id: 58,
    marks: 0,
    modified_date: '2024-09-13T13:05:47.000Z',
    module_id: 402,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:05:50.000Z',
    id: 59,
    marks: 0,
    modified_date: '2024-09-13T13:05:50.000Z',
    module_id: 97,
    student_id: 9,
    total: 5,
  },
  {
    created_date: '2024-09-13T13:05:58.000Z',
    id: 60,
    marks: 0,
    modified_date: '2024-09-13T13:06:03.000Z',
    module_id: 254,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:06:00.000Z',
    id: 61,
    marks: 0,
    modified_date: '2024-09-13T13:06:00.000Z',
    module_id: 98,
    student_id: 9,
    total: 10,
  },
  {
    created_date: '2024-09-13T13:06:11.000Z',
    id: 62,
    marks: 0,
    modified_date: '2024-09-13T13:06:11.000Z',
    module_id: 349,
    student_id: 9,
    total: 2,
  },
  {
    created_date: '2024-09-13T13:06:20.000Z',
    id: 63,
    marks: 0,
    modified_date: '2024-09-13T13:06:21.000Z',
    module_id: 109,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-13T13:06:32.000Z',
    id: 64,
    marks: 0,
    modified_date: '2024-09-13T13:06:32.000Z',
    module_id: 313,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:07:00.000Z',
    id: 65,
    marks: 0,
    modified_date: '2024-09-13T13:07:00.000Z',
    module_id: 143,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:07:04.000Z',
    id: 66,
    marks: 0,
    modified_date: '2024-09-13T13:07:04.000Z',
    module_id: 140,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T13:07:11.000Z',
    id: 67,
    marks: 0,
    modified_date: '2024-09-13T13:07:11.000Z',
    module_id: 139,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-13T14:08:13.000Z',
    id: 68,
    marks: 4,
    modified_date: '2024-09-13T14:08:17.000Z',
    module_id: 388,
    student_id: 9,
    total: 14,
  },
  {
    created_date: '2024-09-13T14:59:14.000Z',
    id: 69,
    marks: 1,
    modified_date: '2024-09-13T14:59:14.000Z',
    module_id: 174,
    student_id: 9,
    total: 10,
  },
  {
    created_date: '2024-09-13T14:59:59.000Z',
    id: 70,
    marks: 0,
    modified_date: '2024-09-13T14:59:59.000Z',
    module_id: 175,
    student_id: 9,
    total: 15,
  },
  {
    created_date: '2024-09-13T15:00:29.000Z',
    id: 71,
    marks: 0,
    modified_date: '2024-09-13T15:00:29.000Z',
    module_id: 176,
    student_id: 9,
    total: 15,
  },
  {
    created_date: '2024-09-13T15:01:09.000Z',
    id: 72,
    marks: 0,
    modified_date: '2024-09-13T15:01:09.000Z',
    module_id: 154,
    student_id: 9,
    total: 10,
  },
  {
    created_date: '2024-09-13T18:39:08.000Z',
    id: 73,
    marks: 0,
    modified_date: '2024-09-13T18:39:08.000Z',
    module_id: 406,
    student_id: 9,
    total: 1,
  },
  {
    created_date: '2024-09-14T12:49:55.000Z',
    id: 74,
    marks: 0,
    modified_date: '2024-09-14T12:49:55.000Z',
    module_id: 220,
    student_id: 9,
    total: 12,
  },
  {
    created_date: '2024-09-15T08:04:08.000Z',
    id: 75,
    marks: 6,
    modified_date: '2024-09-15T08:05:34.000Z',
    module_id: 51,
    student_id: 9,
    total: 20,
  },
];
