// import {
//   FlatList,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useContext, useEffect, useState} from 'react';
// import Icon from 'react-native-vector-icons/AntDesign';
// import color from '../../Constants/color';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import {ROUTES} from '../../Constants/routes';
// import axios from 'axios';
// import storage from '../../Constants/storage';
// import {AppContext} from '../../theme/AppContext';

// const Index = ({navigation}) => {
//   const route = useRoute();
//   const {lang_level_id} = route.params;

//   const {path} = useContext(AppContext);
//   const [chapter, setChapter] = useState([]);

//   const [chapterId, setChapterId] = useState();

//   const chapterData = async () => {
//     try {
//       const response = await axios.get(`http://${path}:4000/chapters`, {
//         params: {
//           lang_level_id: lang_level_id,
//           package_id: lang_level_id === '6' ? '1' : '0',
//         },
//       });

//       setChapterId(response?.data[0].id);
//       setChapter(response.data);
//     } catch (error) {
//       console.log('error', error);
//     }
//   };

//   // !important
//   // const getModules = async () => {
//   //   try {
//   //     const response = await axios.get(
//   //       `http://192.168.1.5:4000/chapters/${chapterId}/modules`,
//   //     );

//   //     console.log('Thsi is data', response.data);
//   //   } catch (err) {
//   //     console.error('Error fetching modules:', err);
//   //   }
//   // };

//   // const navigation = useNavigation();

//   useEffect(() => {
//     chapterData();
//   }, []);

//   const renderItem = ({item}) => {
//     return (
//       <View style={styles.chapters}>
//         <TouchableOpacity
//           style={styles.chapterBox}
//           onPress={() =>
//             navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
//               chapterId: item.id,
//             })
//           }>
//           {/* Left card */}
//           <View style={styles.chapterCard}>
//             {/* Icon */}
//             <View style={styles.icon}>
//               <Icon name="book" style={styles.chapterIcon} />
//             </View>
//             {/* Text */}
//             <View style={styles.chapterMiddle}>
//               <Text style={styles.chapterName}>{item.name}</Text>
//               <Text style={styles.title}>{item.description}</Text>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={chapter}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//       />
//     </SafeAreaView>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   chapters: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   chapterCard: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   chapterBox: {
//     width: '95%',
//     display: 'flex',
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#293748',
//     borderRadius: 10,
//     marginTop: 8,
//     marginBottom: 8,
//     borderBottomWidth: 10,
//     borderColor: color.lowPrimary,
//   },
//   continue: {
//     borderWidth: 1,
//     borderColor: 'white',
//     padding: 5,
//     borderRadius: 12,
//     backgroundColor: 'blue',
//   },
//   continuteBtn: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: 'white',
//   },
//   chapterIcon: {
//     fontSize: 24,
//     color: '#293748',
//     fontWeight: '700',
//   },
//   chapterMiddle: {
//     marginLeft: 10,
//     // width: '65%',
//   },
//   icon: {
//     borderWidth: 2,
//     borderColor: 'white',
//     backgroundColor: 'white',
//     padding: 5,
//     borderRadius: 50,
//   },
//   title: {
//     fontSize: 14,
//     color: 'white',

//     fontWeight: '300',
//   },
//   chapterName: {
//     fontSize: 18,
//     color: 'white',
//     fontWeight: '600',
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
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import color from '../../Constants/color';

const Index = ({navigation}) => {
  const route = useRoute();
  const {lang_level_id} = route.params;
  const {path} = useContext(AppContext);
  const [chapter, setChapter] = useState([]);

  const chapterData = async () => {
    try {
      const response = await axios.get(`http://${path}:4000/chapters`, {
        params: {
          lang_level_id: lang_level_id,
          package_id: lang_level_id === '6' ? '1' : '0',
        },
      });

      setChapter(response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    chapterData();
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.chapterBox}
      onPress={() =>
        navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
          chapterId: item.id,
        })
      }>
      <View style={styles.chapterCard}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Icon name="book" style={styles.chapterIcon} />
        </View>
        {/* Text */}
        <View style={styles.chapterMiddle}>
          <Text style={styles.chapterName}>{item.name}</Text>
          <Text style={styles.title}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chapter}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  chapterBox: {
    width: '100%',
    backgroundColor: color.lowPrimary,
    borderRadius: 15,
    marginVertical: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},

    transform: [{scale: 1}],
    transition: 'transform 0.2s',
  },
  chapterBoxActive: {
    transform: [{scale: 1.05}],
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#FFF',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chapterIcon: {
    fontSize: 28,
    color: color.black,
    fontWeight: 'bold',
  },
  chapterMiddle: {
    flex: 1,
    justifyContent: 'center',
  },
  chapterName: {
    fontSize: 18,
    color: color.black,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: color.black,
  },
});
