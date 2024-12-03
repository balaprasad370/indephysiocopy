// import React, {useCallback, useContext, useState} from 'react';
// import {
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   View,
//   Image,
//   Text,
//   ActivityIndicator,
// } from 'react-native';
// import FontAwesome from 'react-native-vector-icons/FontAwesome5';
// import FeatherIcon from 'react-native-vector-icons/Feather';
// import IonIcon from 'react-native-vector-icons/Ionicons';
// import {useNavigation} from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import {AppContext} from '../../theme/AppContext';
// import DarkTheme from '../../theme/Darktheme';
// import LighTheme from '../../theme/LighTheme';
// import color from '../../Constants/color';

// export default function Example({id, lang_id, img, name, description, route}) {
//   const navigation = useNavigation();

//   const {isDark} = useContext(AppContext);
//   const style = isDark ? DarkTheme : LighTheme;

//   return (
//     <LinearGradient
//     key={lang_id}
//       colors={[color.lightPrimary, color.lowPrimary]}
//       start={{x: 0, y: 0}} // Start from the left
//       end={{x: 1, y: 0}} // End at the right
//       style={{
//         borderRadius: 10,
//         width: '90%',
//         alignSelf: 'center',
//       }}>
//       <TouchableOpacity
//         hitSlop={{x: 25, y: 15}}
//         key={id}
//         onPress={() => navigation.navigate(route, {lang_id: lang_id})}>
//         <View style={styles.card}>
//           <View style={styles.cardLikeWrapper}>
//             <TouchableOpacity
//               hitSlop={{x: 25, y: 15}}
//               onPress={() => handleSave(id)}></TouchableOpacity>
//           </View>
//           <View style={styles.cardTop}>
//             {img ? (
//               <Image
//                 alt=""
//                 resizeMode="cover"
//                 style={styles.cardImg}
//                 source={{uri: img}}
//               />
//             ) : (
//               <View style={styles.dummycardImg}>
//                 <ActivityIndicator
//                   size="large"
//                   color="#0000ff"
//                   style={styles.loader}
//                 />
//               </View>
//             )}
//           </View>

//           <View style={styles.cardBody}>
//             <View style={styles.cardHeader}>
//               <Text style={style.selfcardTitle}>{name}</Text>
//             </View>
//             <Text style={style.cardDates}>{description}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity
//         hitSlop={{x: 25, y: 15}}
//         key={id}
//         style={{position: 'relative'}}
//         // onPress={() => navigation.navigate(route, {lang_id: lang_id})}
//       >
//         <View
//           style={{
//             position: 'absolute',
//             left: '60%',
//             top: '40%',
//             transform: [{translateX: -50}],
//           }}>
//           <IonIcon
//             name="lock-closed-sharp"
//             style={{
//               fontSize: 26,
//               color: color.black,
//               zIndex: 999,
//             }}
//           />
//         </View>
//         <View style={[styles.card, {opacity: 0.2}]}>
//           <View style={styles.cardLikeWrapper}>
//             <TouchableOpacity
//               hitSlop={{x: 25, y: 15}}
//               onPress={() => handleSave(id)}></TouchableOpacity>
//           </View>
//           <View style={styles.cardTop}>
//             {img ? (
//               <Image
//                 alt=""
//                 resizeMode="cover"
//                 style={styles.cardImg}
//                 source={{uri: img}}
//               />
//             ) : (
//               <View style={styles.dummycardImg}>
//                 <ActivityIndicator
//                   size="large"
//                   color="#0000ff"
//                   style={styles.loader}
//                 />
//               </View>
//             )}
//           </View>

//           <View style={styles.cardBody}>
//             <View style={styles.cardHeader}>
//               <Text style={style.selfcardTitle}>{name}</Text>
//             </View>

//             <Text style={style.cardDates}>{description}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     paddingTop: 8,
//     paddingHorizontal: 16,
//   },
//   /** Header */
//   header: {
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   headerTop: {
//     marginHorizontal: -6,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerAction: {
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#1d1d1d',
//   },
//   /** Card */
//   card: {
//     position: 'relative',
//     borderRadius: 8,
//     // backgroundColor: '#f1f1f8',
//     paddingBottom: 6,
//     shadowColor: 'rgba(0, 0, 0, 0.5)',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//   },
//   cardLikeWrapper: {
//     position: 'absolute',
//     zIndex: 1,
//     top: 12,
//     right: 12,
//   },
//   cardLike: {
//     width: 40,
//     height: 40,
//     borderRadius: 9999,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardTop: {
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//     height: 160,
//   },
//   cardImg: {
//     width: '100%',
//     height: '100%',
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   dummycardImg: {
//     width: '100%',
//     backgroundColor: color.lighGrey,
//     height: 160,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   cardBody: {
//     paddingHorizontal: 10,
//     paddingVertical: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   cardStars: {
//     marginLeft: 2,
//     marginRight: 4,
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#232425',
//   },
//   cardPrice: {
//     marginTop: 6,
//     fontSize: 16,
//     color: '#232425',
//   },
//   loader: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginLeft: -25,
//     marginTop: -25,
//   },
// });

import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import color from '../../Constants/color';

export default function Example({
  id,
  lang_id,
  img,
  name,
  description,
  route,
  status,
}) {
  const navigation = useNavigation();
  const {isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const handleSave = id => {
    console.log(`Saved item with id: ${id}`);
  };

  return (
    <LinearGradient
      key={lang_id}
      colors={[color.lightPrimary, color.lowPrimary]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={{
        borderRadius: 10,
        width: '95%',
        alignSelf: 'center',
        marginBottom: 0,
      }}>
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        onPress={() => {
          if (status === 'unlocked') {
            navigation.navigate(route, {lang_id: lang_id});
          }
        }}>
        <View style={[styles.card, status === 'locked' && {opacity: 0.5}]}>
          <View style={styles.cardTop}>
            {img ? (
              <Image
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
            <Text style={style.selfcardTitle}>{name}</Text>
            <Text style={style.cardDates}>{description}</Text>
          </View>
        </View>
        {status === 'locked' && (
          <View style={styles.lockIconWrapper}>
            <IonIcon name="lock-closed-sharp" style={styles.lockIcon} />
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    borderRadius: 10,
  },
  cardTop: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 160,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  dummycardImg: {
    width: '100%',
    backgroundColor: color.lightGrey,
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 10,
  },
  lockIconWrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{translateX: -12}, {translateY: -12}],
    zIndex: 10,
  },
  lockIcon: {
    fontSize: 26,
    color: color.black,
  },
});
