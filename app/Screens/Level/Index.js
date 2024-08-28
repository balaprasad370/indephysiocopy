// import {
//   BackHandler,
//   FlatList,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableHighlight,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect} from 'react';
// import {Level} from '..';
// import Icon from 'react-native-vector-icons/FontAwesome6';
// import {useNavigation} from '@react-navigation/native';
// import {ROUTES} from '../../Constants/routes';
// import color from '../../Constants/color';

// const DATA = [
//   {
//     id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//     level: 'A1 Level',
//     title: 'Beginner',
//     completed: false,
//     levelId: '6',
//   },
//   {
//     id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//     level: 'A2 Level',
//     title: 'Medium',
//     completed: true,
//     levelId: '5',
//   },
//   {
//     id: '3ac68afc-c605-48d3-s4f8-fbd91aa97f63',
//     level: 'B1 Level',
//     title: 'Hard',
//     completed: true,
//     levelId: '3',
//   },
//   {
//     id: '1ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//     level: 'B2 Level',
//     title: 'Medium',
//     completed: true,
//     levelId: '5',
//   },
// ];

// const Index = () => {
//   const navigation = useNavigation();
//   const renderItem = ({item}) => {
//     return (
//       <TouchableOpacity
//         style={styles.level}
//         onPress={
//           item.completed
//             ? null
//             : () =>
//                 navigation.navigate(ROUTES.CHAPTERS, {
//                   lang_level_id: item.levelId,
//                 })
//         }>
//         <View style={styles.levelCard}>
//           <View style={item.completed ? styles.lock : null}>
//             {item.completed ? (
//               <Icon name={`${'lock'}`} style={{fontSize: 34, color: '#FFF'}} />
//             ) : null}
//           </View>
//           {/* Top card */}
//           <View style={{padding: 15}}>
//             <View style={styles.upperLevel}>
//               <Icon name="flag" style={styles.levelIcon} />
//               <Text style={styles.levelText}>{item.level}</Text>
//             </View>
//             {/* Middle number */}
//             <View style={styles.middleLevel}>
//               <View style={styles.roundLevel}>
//                 <Text style={styles.levelNumber}>1</Text>
//               </View>
//               <View style={styles.dot}></View>
//               <View style={styles.roundLevel}>
//                 <Text style={styles.levelNumber}>2</Text>
//               </View>
//               <View style={styles.dot}></View>
//               <View style={styles.roundLevel}>
//                 <Text style={styles.levelNumber}>3</Text>
//               </View>
//               <View style={styles.dot}></View>
//               <View style={styles.roundLevel}>
//                 <Text style={styles.levelNumber}>4</Text>
//               </View>
//               <View style={styles.dot}></View>
//               <View style={styles.roundLevel}>
//                 <Text style={styles.levelNumber}>5</Text>
//               </View>
//             </View>
//             {/* Description */}
//             <View style={styles.description}>
//               <Text style={styles.descriptionText}>{item.title}</Text>
//             </View>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={DATA}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//       />
//     </SafeAreaView>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 10,
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   level: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   lock: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     padding: 15,
//     zIndex: 99999,
//     borderRadius: 12,
//     marginBottom: 10,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(128, 128, 128, 0.4)',
//     backdropFilter: 'blur(5px)',
//   },

//   levelCard: {
//     position: 'relative',
//     width: '93%',
//     backgroundColor: '#f1f4f8',
//     shadowColor: 'rgba(0, 0, 0, 0.8)',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//     // backgroundColor: '#293748',
//     borderRadius: 12,
//     // padding: 15,
//     marginBottom: 10,
//   },
//   upperLevel: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   levelText: {
//     fontSize: 18,
//     color: color.darkPrimary,
//     fontWeight: '600',
//     marginLeft: 10,
//   },
//   levelIcon: {
//     fontSize: 18,
//     color: color.darkPrimary,
//   },
//   middleLevel: {
//     marginTop: 5,
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   roundLevel: {
//     width: 25,
//     height: 25,
//     backgroundColor: color.darkPrimary,
//     borderRadius: 50,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   levelNumber: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: color.white,
//     // color: '#293748',
//   },
//   description: {
//     marginTop: 8,
//   },
//   descriptionText: {
//     fontSize: 14,
//     fontWeight: '400',
//     color: color.darkPrimary,
//   },
//   dot: {
//     width: 12,
//     height: 12,
//     backgroundColor: color.darkPrimary,
//     borderRadius: 50,
//   },
// });
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import color from '../../Constants/color';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    level: 'A1 Level',
    title: 'Beginner',
    completed: false,
    levelId: '6',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    level: 'A2 Level',
    title: 'Medium',
    completed: true,
    levelId: '5',
  },
  {
    id: '3ac68afc-c605-48d3-s4f8-fbd91aa97f63',
    level: 'B1 Level',
    title: 'Hard',
    completed: true,
    levelId: '3',
  },
  {
    id: '1ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    level: 'B2 Level',
    title: 'Medium',
    completed: true,
    levelId: '5',
  },
];

const Index = () => {
  const navigation = useNavigation();

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={[styles.level, item.completed && styles.completedLevel]}
        onPress={
          item.completed
            ? null
            : () =>
                navigation.navigate(ROUTES.CHAPTERS, {
                  lang_level_id: item.levelId,
                })
        }>
        <View style={styles.levelCard}>
          {item.completed && (
            <View style={styles.lockOverlay}>
              <Icon name="lock" style={styles.lockIcon} />
            </View>
          )}
          {/* Level Content */}
          <View style={styles.levelContent}>
            {/* Level Title */}
            <View style={styles.upperLevel}>
              <Icon name="flag" style={styles.levelIcon} />
              <Text style={styles.levelText}>{item.level}</Text>
            </View>

            {/* Middle Number */}
            <View style={styles.middleLevel}>
              {[1, 2, 3, 4, 5].map((num, index) => (
                <React.Fragment key={index}>
                  <View style={styles.roundLevel}>
                    <Text style={styles.levelNumber}>{num}</Text>
                  </View>
                  {index < 4 && <View style={styles.dot}></View>}
                </React.Fragment>
              ))}
            </View>

            {/* Description */}
            <View style={styles.description}>
              <Text style={styles.descriptionText}>{item.title}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  level: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    transform: [{scale: 1}],
    transition: 'transform 0.3s',
  },
  completedLevel: {
    opacity: 0.6,
  },
  levelCard: {
    position: 'relative',
    width: '93%',
    borderRadius: 15,
    backgroundColor: color.lightPrimary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
    justifyContent: 'center',

    alignItems: 'center',
  },
  lockIcon: {
    zIndex: 99999,
    fontSize: 40,

    color: color.black,
  },
  levelContent: {
    padding: 20,
  },
  upperLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelText: {
    fontSize: 22,
    color: color.black,
    fontWeight: '700',
    marginLeft: 15,
  },
  levelIcon: {
    fontSize: 24,
    color: color.black,
  },
  middleLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  roundLevel: {
    width: 30,
    height: 30,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: color.black,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: color.black,
    borderRadius: 5,
  },
  description: {
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: color.black,
    textAlign: 'center',
  },
});
