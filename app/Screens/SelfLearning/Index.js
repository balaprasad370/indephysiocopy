import {
  Modal,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import SearchComponent from '../../Components/SearchComponent/Index';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import color from '../../Constants/color';
import QuizCard from '../../Components/QuizCard/Index';
import {ROUTES} from '../../Constants/routes';
import axios from 'axios';
import storage from '../../Constants/storage';

const Index = ({route, navigation}) => {
  const {parent_module_id} = route.params;
  const {isDark, path} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const [content, setContent] = useState([]);

  const {title} = route.params;

  useEffect(() => {
    navigation.setOptions({title});
  }, [title]);

  const getAllChapterContent = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const res = await axios({
        method: 'get',
        url: `${path}/chapter/v1/admin/${parent_module_id}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setContent(res.data);
    } catch (error) {
      console.log('error', error.response);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllChapterContent();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = useMemo(
    () =>
      ({item}) =>
        (
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
                : 'Quiz'
            }
            unique_id={item.read_id || item.flash_id || item.id}
            status={item.status}
            room_name={item.room_name}
            video_url={item.live_class_recording_url}
            order_id={item.order_id}
            time_spent={item.time_spent}
            locked={item.locked}
          />
        ),
    [parent_module_id],
  );

  return (
    <>
      {content.length > 0 ? (
        <View style={style.selfLearnChapter}>
          {/* <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate(ROUTES.FILTER_RECORDING)}>
            <Text style={styles.filterButtonText}>Filter Recording</Text>
          </TouchableOpacity> */}
          <FlatList
            data={content}
            renderItem={renderItem}
            keyExtractor={item => Math.random().toString()} // Ensure unique keys
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true} // Unmount components that are not visible
            getItemLayout={
              (data, index) => ({
                length: 100,
                offset: 100 * index,
                index,
              }) // Assuming fixed height of 100
            }
          />
        </View>
      ) : (
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>There is no content</Text>
        </View>
      )}
    </>
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

export default Index;
