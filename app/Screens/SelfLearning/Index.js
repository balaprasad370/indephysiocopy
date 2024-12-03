// import {
//   Modal,
//   FlatList,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useContext, useEffect, useMemo, useState} from 'react';
// import SearchComponent from '../../Components/SearchComponent/Index';
// import {AppContext} from '../../theme/AppContext';
// import DarkTheme from '../../theme/Darktheme';
// import LighTheme from '../../theme/LighTheme';
// import color from '../../Constants/color';
// import QuizCard from '../../Components/QuizCard/Index';
// import {ROUTES} from '../../Constants/routes';
// import axios from 'axios';
// import storage from '../../Constants/storage';
// import Loading from '../../Components/Loading/Loading';

// const Index = ({route, navigation}) => {
//   const {parent_module_id, title, level_id} = route.params;
//   const {isDark, path, loader, setLoader, packageId} = useContext(AppContext);

//   const style = isDark ? DarkTheme : LighTheme;

//   const [content, setContent] = useState([]);

//   useEffect(() => {
//     navigation.setOptions({title});
//   }, [title]);

// const getAllChapterContent = async () => {
//   setLoader(true);
//   const token = await storage.getStringAsync('token');
//   try {
//     const res = await axios({
//       method: 'get',
//       url: `${path}/student/v4/${parent_module_id}`,
//       params: {
//         package_id: packageId,
//       },
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     setContent(res.data);
//     setLoader(false);
//   } catch (error) {
//     console.log('error', error.response);
//   } finally {
//     setLoader(false);
//   }
// };

// useEffect(() => {
//   const unsubscribe = navigation.addListener('focus', () => {
//     getAllChapterContent();
//   });
//   return unsubscribe;
// }, [navigation]);

//   const renderItem = useMemo(
//     () =>
//       ({item}) =>
//         (
//           <QuizCard
//             Title={
//               item.flashcard_name || item.title || item.name || item.title_live
//             }
//             secondOption={
//               item.flashcard_description ||
//               item.description ||
//               item.description_live
//             }
//             parent_module_id={parent_module_id}
//             optionClick={
//               item.read_id
//                 ? 'Reading Material'
//                 : item.flash_id
//                 ? 'Flash Card'
//                 : item.schedule_live_class_id
//                 ? 'Live class'
//                 : item.type === 'assessments'
//                 ? 'Assessments'
//                 : 'Quiz'
//             }
//             unique_id={item.read_id || item.flash_id || item.id}
//             status={item.status}
//             room_name={item.room_name}
//             video_url={item.live_class_recording_url}
//             order_id={item.order_id}
//             time_spent={item.time_spent}
//             locked={item.locked}
//             live_class_end_date={item.live_class_end_date}
//             level_id={level_id}
//           />
//         ),
//     [parent_module_id],
//   );

//   if (loader) {
//     return <Loading />;
//   }

//   return (
//     <>
//       {!content || content.length === 0 ? (
//         <View style={styles.emptyContent}>
//           <Text style={styles.emptyText}>There is no content</Text>
//         </View>
//       ) : (
// <View style={style.selfLearnChapter}>
//   <FlatList
//     data={content}
//     renderItem={renderItem}
//     keyExtractor={item => Math.random().toString()} // Ensure unique keys
//     showsVerticalScrollIndicator={false}
//     removeClippedSubviews={true} // Unmount components that are not visible
//     getItemLayout={(data, index) => ({
//       length: 100,
//       offset: 100 * index,
//       index,
//     })}
//   />
// </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   filterButton: {
//     backgroundColor: color.lightPrimary,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     alignSelf: 'flex-end',
//     marginBottom: 10,
//     marginHorizontal: 10,
//   },
//   filterButtonText: {
//     color: '#000',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   emptyContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '900',
//   },
// });

// export default Index;

// Container Component (Index.js)

import React, {memo, useCallback, useContext, useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet} from 'react-native';
import {AppContext} from '../../theme/AppContext';
import QuizCard from '../../Components/QuizCard/Index';
import axios from 'axios';
import storage from '../../Constants/storage';
import Loading from '../../Components/Loading/Loading';
import color from '../../Constants/color';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';

const ChapterContent = ({route, navigation}) => {
  const {parent_module_id, title, level_id} = route.params;
  const {path, loader, setLoader, packageId, isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const [content, setContent] = useState([]);

  // Memoized API call
  const fetchContent = useCallback(async () => {
    if (loader) return;
    setLoader(true);
    try {
      const token = await storage.getStringAsync('token');
      const response = await axios({
        method: 'get',
        url: `${path}/student/v5/${parent_module_id}`,
        params: {package_id: packageId},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setContent(response.data);
    } catch (error) {
      console.log('Error fetching content:');
    } finally {
      setLoader(false);
    }
  }, [parent_module_id, packageId, path, loader]);

  useEffect(() => {
    navigation.setOptions({title});
    const unsubscribe = navigation.addListener('focus', fetchContent);
    return unsubscribe;
  }, [navigation]);

  const keyExtractor = useCallback(
    item => `${item.id || item.read_id || item.flash_id}_${Math.random()}`,
    [],
  );

  const renderItem = useCallback(
    ({item}) => (
      <QuizCard
        Title={
          item.flashcard_name || item.title || item.name || item.title_live
        }
        secondOption={
          item.flashcard_description ||
          item.description ||
          item.description_live
        }
        parent_module_id={parent_module_id}
        optionClick={
          item.read_id
            ? 'Reading Material'
            : item.flash_id
            ? 'Flash Card'
            : item.schedule_live_class_id
            ? 'Live class'
            : item.type === 'assessments'
            ? 'Assessments'
            : 'Quiz'
        }
        unique_id={item.read_id || item.flash_id || item.id}
        status={item.status}
        room_name={item.room_name}
        video_url={item.live_class_recording_url}
        order_id={item.order_id}
        time_spent={item.time_spent}
        locked={item.locked}
        live_class_end_date={item.live_class_end_date}
        level_id={level_id}
      />
    ),
    [parent_module_id, level_id],
  );

  if (loader) return <Loading />;

  return (
    <View style={styles.container}>
      {!content?.length ? (
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>No content available</Text>
        </View>
      ) : (
        <View style={style.selfLearnChapter}>
          <FlatList
            data={content}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialNumToRender={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: color.lightPrimary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginHorizontal: 10,
  },
  filterButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '900',
  },
});

export default memo(ChapterContent);
