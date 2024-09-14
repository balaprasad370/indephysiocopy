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

export default function Example({id, img, name, description, route}) {
  const navigation = useNavigation();

  const {isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  return (
    <LinearGradient
      colors={[color.first, color.second, color.third]} // Gradient colors
      start={{x: 0, y: 0}} // Start from the left
      end={{x: 1, y: 0}} // End at the right
      style={{borderRadius: 10}}>
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        key={id}
        onPress={() => navigation.navigate(route)}>
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

              <FontAwesome
                color="#ea266d"
                name="star"
                solid={true}
                size={12}
                style={{marginBottom: 2}}
              />
            </View>

            <Text style={style.cardDates}>{description}</Text>
            <Text style={styles.cardPrice}></Text>
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
    marginBottom: 16,
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
    height: 160,
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
    padding: 12,
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
