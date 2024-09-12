import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import color from '../../Constants/color';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';

const Index = () => {
  const {path, langId, clientId} = useContext(AppContext);
  const [levels, setLevels] = useState([]);
  const navigation = useNavigation();
  const levelLangId = 1;

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const token = await storage.getStringAsync('token');
        if (token) {
          const response = await axios.get(
            `http://${path}:4000/levels/${langId}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.data.status) {
            setLevels(response.data.data);
          } else {
            console.error('No levels found for this language ID');
          }
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Error fetching levels: ', error);
      }
    };

    fetchLevels();
  }, []);

  // const renderItem = ({item}) => (
  //   <TouchableOpacity
  //     style={[styles.level, item.completed && styles.completedLevel]}
  //     onPress={
  //       item.completed
  //         ? null
  //         : () =>
  //             navigation.navigate(ROUTES.CHAPTERS, {level_id: item.level_id})
  //     }>
  //     <View style={styles.levelCard}>
  //       {item.completed && (
  //         <View style={styles.lockOverlay}>
  //           <Icon name="lock" style={styles.lockIcon} />
  //         </View>
  //       )}
  //       <View style={styles.levelContent}>
  //         <View style={styles.upperLevel}>
  //           <Icon name="flag" style={styles.levelIcon} />
  //           <Text style={styles.levelText}>{item.level_name}</Text>
  //         </View>
  //         <View style={styles.middleLevel}>
  //           {[1, 2, 3, 4, 5].map((num, index) => (
  //             <React.Fragment key={index}>
  //               <View style={styles.roundLevel}>
  //                 <Text style={styles.levelNumber}>{num}</Text>
  //               </View>
  //               {index < 4 && <View style={styles.dot}></View>}
  //             </React.Fragment>
  //           ))}
  //         </View>

  //         <View style={styles.description}>
  //           <Text style={styles.descriptionText}>{item.level_description}</Text>
  //         </View>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

  const progressArray = [true, true, false, false, false];
  const completedCount = progressArray.filter(Boolean).length;
  const total = progressArray.length;
  const progressPercentage = Math.round((completedCount / total) * 100);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.level}
      onPress={
        item.completed
          ? null
          : () =>
              navigation.navigate(ROUTES.CHAPTERS, {level_id: item.level_id})
      }>
      <View style={styles.levelCard}>
        {/* Left Side: Image */}
        <Image
          source={{
            uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.level_img}`,
          }}
          style={styles.levelImage}
          resizeMode="cover"
        />

        {/* Right Side: Level Info */}
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>{item.level_name}</Text>
          <Text style={styles.levelDescription}>{item.level_description}</Text>

          {/* Dynamic Level Progress */}
          <View style={styles.progressWrapper}>
            <Text style={styles.progressText}>{progressPercentage}%</Text>
            {progressArray.map((num, index) => (
              <React.Fragment key={index}>
                <View
                  style={[styles.progressDot, num && styles.progressDotFilled]}
                />
                {index < progressArray.length - 1 && (
                  <View
                    style={[
                      styles.progressLine,
                      num && styles.progressLineFilled,
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
            <Text style={{marginLeft: 5, fontSize: 12, color: color.black}}>
              100%
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // const renderItem = ({item}) => (
  //   <TouchableOpacity
  //     style={styles.level}
  //     onPress={
  //       item.completed
  //         ? null
  //         : () =>
  //             navigation.navigate(ROUTES.CHAPTERS, {level_id: item.level_id})
  //     }>
  //     <View style={styles.levelCard}>
  //       {/* Left Side: Image */}
  //       <Image
  //         source={{
  //           uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.level_img}`,
  //         }} // assuming the item contains an image URL
  //         style={styles.levelImage}
  //         resizeMode="cover"
  //       />

  //       {/* Right Side: Level Info */}
  //       <View style={styles.levelInfo}>
  //         <Text style={styles.levelText}>{item.level_name}</Text>
  //         <Text style={styles.levelDescription}>{item.level_description}</Text>

  //         <Text>Progress:</Text>
  //         {/* Dynamic Level Progress */}
  //         <View style={styles.progressWrapper}>
  //           {[1, 2, 3, 4, 5].map((num, index) => (
  //             <React.Fragment key={index}>
  //               <View
  //                 style={[
  //                   styles.progressDot,
  //                   item.completed >= num && styles.progressDotFilled,
  //                 ]}
  //               />
  //               {index < 4 && <View style={styles.progressLine}></View>}
  //             </React.Fragment>
  //           ))}
  //         </View>
  //       </View>

  //       {/* Right Side: Arrow */}
  //       <View style={styles.arrowContainer}>
  //         <Icon name="chevron-right" style={styles.arrowIcon} />
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={levels}
        renderItem={renderItem}
        keyExtractor={item => item.level_id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 10,
//     backgroundColor: 'white',
//   },
//   level: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//     transform: [{scale: 1}],
//     transition: 'transform 0.3s',
//   },
//   completedLevel: {
//     opacity: 0.6,
//   },
//   levelCard: {
//     position: 'relative',
//     width: '93%',
//     borderRadius: 15,
//     backgroundColor: color.lightPrimary,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 3},
//   },
//   lockOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   lockIcon: {
//     zIndex: 99999,
//     fontSize: 40,
//     color: color.black,
//   },
//   levelContent: {
//     padding: 20,
//   },
//   levelImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   upperLevel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   levelText: {
//     fontSize: 22,
//     color: color.black,
//     fontWeight: '700',
//     marginLeft: 15,
//   },
//   levelIcon: {
//     fontSize: 24,
//     color: color.black,
//   },
//   middleLevel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 15,
//   },
//   roundLevel: {
//     width: 30,
//     height: 30,
//     backgroundColor: '#FFF',
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   levelNumber: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: color.black,
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     backgroundColor: color.black,
//     borderRadius: 5,
//   },
//   description: {
//     marginTop: 15,
//   },
//   descriptionText: {
//     fontSize: 16,
//     fontWeight: '400',
//     color: color.black,
//     textAlign: 'center',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: color.lowPrimary,
    borderRadius: 10,
    shadowColor: color.lowPrimary,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  levelImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  levelInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  levelText: {
    fontSize: 18,
    fontWeight: '700',
    color: color.black,
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginBottom: 10,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressText: {
    fontSize: 12,
    color: color.black,
    marginRight: 5,
  },
  progressDot: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  progressDotFilled: {
    backgroundColor: 'green',
  },
  progressLine: {
    width: 15,
    height: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
  },
  progressLineFilled: {
    width: 15,
    height: 2,
    backgroundColor: 'green',
    marginHorizontal: 5,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: 'white',
//   },
//   level: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     padding: 20,
//     backgroundColor: '#FFF',
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 5},
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 5,
//     borderLeftWidth: 5, // Bold left border for a dynamic look
//     borderLeftColor: '#3898FF',
//   },
//   levelCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//   },
//   levelImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 10,
//     marginRight: 15,
//     borderWidth: 2, // Border around image for more visual impact
//     borderColor: '#9AC9FF',
//   },
//   levelInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   levelText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#3898FF', // Use primary color for the title
//     marginBottom: 8,
//   },
//   levelDescription: {
//     fontSize: 14,
//     color: '#6FA7DB', // Use secondary color for description
//     marginBottom: 10,
//   },
//   progressWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   progressDot: {
//     width: 12,
//     height: 12,
//     backgroundColor: '#E0EFFF',
//     borderRadius: 6,
//   },
//   progressDotFilled: {
//     backgroundColor: '#3898FF',
//   },
//   progressLine: {
//     width: 20,
//     height: 2,
//     backgroundColor: '#9AC9FF',
//     marginHorizontal: 5,
//   },
//   arrowContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingLeft: 10,
//   },
//   arrowIcon: {
//     fontSize: 24,
//     color: '#3898FF',
//   },
// });
