import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import color from '../../Constants/color';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import axios from 'axios';

const DATA = [
  {description: 'Vorstellen', id: 14, level: 6, name: 'Lesson 1 '},
  {description: 'Hobbys und Beruf', id: 15, level: 6, name: 'Lesson 2'},
  {description: 'Die Stadt', id: 22, level: 6, name: 'Lesson 3'},
  {description: 'Essen', id: 25, level: 6, name: 'Lesson 4'},
  {description: 'Tag für Tag', id: 26, level: 6, name: 'Lesson 5'},
  {description: 'Freunde und ich', id: 27, level: 6, name: 'Lesson 6'},
  {description: 'Kontakte', id: 28, level: 6, name: 'Lesson 7'},
  {description: 'Wohnen und leben', id: 29, level: 6, name: 'Lesson 8'},
  {description: 'grammar', id: 31, level: 5, name: 'Chapter1 '},
  {description: 'dvsdfv', id: 32, level: 5, name: 'CHatpter 1-sub'},
  {description: 'please', id: 33, level: 5, name: 'Chater sub 2'},
  {description: 'sentences', id: 34, level: 5, name: 'Chapter 2'},
  {description: '', id: 35, level: 5, name: 'Test module'},
  {description: '', id: 36, level: 5, name: 'OET Reading Entrance test'},
  {description: 'Arbeitswelt', id: 37, level: 6, name: 'Lesson 9'},
  {description: 'Mode', id: 38, level: 6, name: 'Lesson 10'},
  {description: 'Gesundheit', id: 39, level: 6, name: 'Lesson 11'},
  {description: 'Urlaub', id: 40, level: 6, name: 'Lesson 12'},
  {description: 'Tenses', id: 42, level: 5, name: 'Chapter 3'},
  {description: 'vsdgb', id: 43, level: 6, name: 'chapter 1'},
  {description: 'Nouns', id: 44, level: 6, name: 'Chapter1 '},
  {description: 'bgfsdgnb', id: 46, level: 6, name: 'professional '},
  {description: 'h', id: 50, level: 6, name: 'Chapter 2'},
  {description: '', id: 52, level: 6, name: 'Chapter 1'},
];

const Index = () => {
  const chapterData = async () => {
    const token = await storage.getStringAsync('token');

    try {
      const response = await axios.get('http://192.168.1.5:4000/chapters');

      console.log('response', response.data);
    } catch (error) {
      console.log('error', error);
    }
  };

  const navigation = useNavigation();
  const renderItem = ({item}) => {
    return (
      <View style={styles.chapters}>
        <TouchableOpacity
          style={styles.chapterBox}
          onPress={() =>
            navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
              chapter: item.name,
            })
          }>
          {/* Left card */}
          <View style={styles.chapterCard}>
            {/* Icon */}
            <View style={styles.icon}>
              <Icon name="book" style={styles.chapterIcon} />
            </View>
            {/* Text */}
            <View style={styles.chapterMiddle}>
              <Text style={styles.chapterName}>{item.name}</Text>
              <Text style={styles.title}>{item.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'white',
  },
  chapters: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  chapterCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chapterBox: {
    width: '95%',
    display: 'flex',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#293748',
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
    borderBottomWidth: 10,
    borderColor: color.lowPrimary,
  },
  continue: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 5,
    borderRadius: 12,
    backgroundColor: 'blue',
  },
  continuteBtn: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  chapterIcon: {
    fontSize: 24,
    color: '#293748',
    fontWeight: '700',
  },
  chapterMiddle: {
    marginLeft: 10,
    // width: '65%',
  },
  icon: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 50,
  },
  title: {
    fontSize: 14,
    color: 'white',

    fontWeight: '300',
  },
  chapterName: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
});
