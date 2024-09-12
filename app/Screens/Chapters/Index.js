import {
  FlatList,
  Image,
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
import storage from '../../Constants/storage';

const Index = ({navigation}) => {
  const route = useRoute();
  const {level_id} = route.params;
  const {path, clientId, packageId, packageName} = useContext(AppContext);
  const [chapter, setChapter] = useState([]);
  let newPackageId = packageId;

  const packageData = [
    {
      client_id: 7,
      lang_id: 1,
      level_id: 6,
      package_color: '#44834b',
      package_created_date: '2024-08-05T13:36:09.000Z',
      package_description: 'Description about the data hj',
      package_id: 1,
      package_img: 'uploads/17247025791724586619referral.webp',
      package_modified_date: '2024-08-26T15:21:35.000Z',
      package_name: 'Superfast',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 6,
      package_color: '#a23939',
      package_created_date: '2024-08-06T03:26:28.000Z',
      package_description: 'Super Fast',
      package_id: 3,
      package_img: 'uploads/1723907085appicon.png',
      package_modified_date: '2024-08-26T10:05:38.000Z',
      package_name: 'Superfast',
    },
    {
      client_id: 7,
      lang_id: 1,
      level_id: 6,
      package_color: '#ed73d2',
      package_created_date: '2024-08-10T06:12:43.000Z',
      package_description: 'Nomejdn',
      package_id: 6,
      package_img: 'uploads/1725382249de.jpg',
      package_modified_date: '2024-09-03T17:02:26.000Z',
      package_name: 'deluxe package',
    },
    {
      client_id: 10,
      lang_id: 1,
      level_id: 6,
      package_color: '#e65a37',
      package_created_date: '2024-08-15T10:34:51.000Z',
      package_description: 'Premium package',
      package_id: 7,
      package_img: 'uploads/1723731120ICON TRY 2.png',
      package_modified_date: '2024-08-15T10:35:13.000Z',
      package_name: 'Superfast',
    },
    {
      client_id: 10,
      lang_id: 1,
      level_id: 6,
      package_color: '#6e97d8',
      package_created_date: '2024-08-15T10:35:47.000Z',
      package_description: 'Regular package',
      package_id: 8,
      package_img: 'uploads/1723731120indephysio App Icon draft 2.png',
      package_modified_date: '2024-08-15T10:36:00.000Z',
      package_name: 'Express',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 6,
      package_color: '#cf72c3',
      package_created_date: '2024-08-23T04:06:21.000Z',
      package_description: 'Express',
      package_id: 10,
      package_img: '',
      package_modified_date: '2024-08-26T10:20:08.000Z',
      package_name: 'Express',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 7,
      package_color: '#ae6f6f',
      package_created_date: '2024-08-26T03:11:34.000Z',
      package_description: 'Super Fast',
      package_id: 11,
      package_img: '',
      package_modified_date: '2024-08-26T03:12:41.000Z',
      package_name: 'Superfast',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 7,
      package_color: '#c37999',
      package_created_date: '2024-08-26T03:13:00.000Z',
      package_description: 'Express',
      package_id: 12,
      package_img: '',
      package_modified_date: '2024-08-26T03:13:30.000Z',
      package_name: 'Express',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 12,
      package_color: '#5e87d9',
      package_created_date: '2024-08-30T05:46:54.000Z',
      package_description: 'Super Fast',
      package_id: 13,
      package_img: '',
      package_modified_date: '2024-08-30T05:47:28.000Z',
      package_name: 'Superfast',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 13,
      package_color: '#0f3331',
      package_created_date: '2024-08-31T07:53:21.000Z',
      package_description: 'A2',
      package_id: 14,
      package_img: 'uploads/1725074415plat1.jpg',
      package_modified_date: '2024-08-31T08:43:46.000Z',
      package_name: 'Superfast',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 13,
      package_color: '#5d1445',
      package_created_date: '2024-08-31T07:55:24.000Z',
      package_description: 'B1',
      package_id: 15,
      package_img: 'uploads/1725074415emb1.jpg',
      package_modified_date: '2024-08-31T07:56:30.000Z',
      package_name: 'Superfast',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 14,
      package_color: '#ea99d1',
      package_created_date: '2024-09-01T01:56:49.000Z',
      package_description: 'Super Fast',
      package_id: 16,
      package_img: '',
      package_modified_date: '2024-09-01T01:56:58.000Z',
      package_name: 'Superfast',
    },
    {
      client_id: 8,
      lang_id: 1,
      level_id: 15,
      package_color: '',
      package_created_date: '2024-09-02T02:58:10.000Z',
      package_description: '',
      package_id: 17,
      package_img: '',
      package_modified_date: '2024-09-02T02:58:10.000Z',
      package_name: 'Ram',
    },
  ];

  useEffect(() => {
    if (packageName === 'Superfast' || packageName === 'Express') {
      const matchingPackage = packageData.find(
        pkg =>
          pkg.level_id === level_id &&
          pkg.package_name === packageName &&
          pkg.client_id === clientId,
      );

      if (matchingPackage) {
        newPackageId = matchingPackage.package_id;
      } else {
        newPackageId = 0;
      }
    }
  }, [level_id, packageName]);

  const chapterData = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(`${path}/chapters`, {
          params: {
            package_id: newPackageId,
            level_id: level_id,
            client_id: clientId,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setChapter(response.data);
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  useEffect(() => {
    chapterData();
  }, []);

  const fetchPackageData = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(`${path}/packages`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        // console.log(response.data);
        // setChapter(response.data);
      } catch (error) {
        console.log('Error fetching package data:', error);
      }
    }
  };

  // useEffect(() => {
  //   fetchPackageData();
  // }, []);

  // const renderItem = ({item}) => (
  //   <TouchableOpacity
  //     style={styles.chapterBox}
  //     onPress={() =>
  //       navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
  //         parent_module_id: item.id,
  //       })
  //     }>
  //     <View style={styles.chapterCard}>
  //       {/* Icon */}
  //       <View style={styles.iconContainer}>
  //         <Icon name="book" style={styles.chapterIcon} />
  //       </View>
  //       {/* Text */}
  //       <View style={styles.chapterMiddle}>
  //         <Text style={styles.chapterName}>{item.name}</Text>
  //         <Text style={styles.title}>{item.description}</Text>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

  // return (
  // <SafeAreaView style={styles.container}>
  //   <FlatList
  //     data={chapter}
  //     renderItem={renderItem}
  //     keyExtractor={item => item.id.toString()}
  //     showsHorizontalScrollIndicator={false}
  //     showsVerticalScrollIndicator={false}
  //   />
  // </SafeAreaView>
  // );
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.chapterBox}
      onPress={() =>
        navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
          parent_module_id: item.id,
        })
      }>
      <View style={styles.chapterCard}>
        {/* Left Side: Chapter Image */}
        {item.image && (
          <Image
            source={{
              uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.image}`,
            }}
            style={styles.chapterImage}
            resizeMode="cover"
          />
        )}

        {/* Right Side: Chapter Info */}
        <View style={styles.chapterInfo}>
          <Text style={styles.chapterName}>{item.name}</Text>
          <Text style={styles.chapterDescription}>{item.description}</Text>
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
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingHorizontal: 16,
//   },
//   chapterBox: {
//     width: '100%',
//     backgroundColor: color.lowPrimary,
//     borderRadius: 15,
//     marginVertical: 8,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},

//     transform: [{scale: 1}],
//     transition: 'transform 0.2s',
//   },
//   chapterBoxActive: {
//     transform: [{scale: 1.05}],
//   },
//   chapterCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     padding: 10,
//     borderRadius: 30,
//     backgroundColor: '#FFF',
//     marginRight: 15,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   chapterIcon: {
//     fontSize: 28,
//     color: color.black,
//     fontWeight: 'bold',
//   },
//   chapterMiddle: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   chapterName: {
//     fontSize: 18,
//     color: color.black,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   title: {
//     fontSize: 14,
//     color: color.black,
//   },
// });

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
    marginVertical: 10,
    padding: 15,
    shadowColor: color.lowPrimary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row', // Horizontal layout
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chapterInfo: {
    justifyContent: 'center',
  },
  chapterName: {
    fontSize: 18,
    color: '#333', // Darker text color for emphasis
    fontWeight: 'bold',
    marginBottom: 6,
  },
  chapterDescription: {
    fontSize: 14,
    color: '#666', // Lighter text for description
    lineHeight: 20,
  },
});
