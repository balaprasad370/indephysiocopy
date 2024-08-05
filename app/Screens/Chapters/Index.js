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

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    chapter: 'Greetings',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    chapter: 'Chapter2',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    chapter: 'Chapter 3',
    title: 'Third Item',
  },
  {
    id: '52694a0f-3da1-471f-bd96-145571e29d72',
    chapter: 'Chapter 4',
    title: 'Fourth Item',
  },
];

const Index = () => {
  const navigation = useNavigation();
  const renderItem = ({item}) => {
    return (
      <View style={styles.chapters}>
        <TouchableOpacity
          style={styles.chapterBox}
          onPress={() => navigation.navigate(ROUTES.SELF_LEARN_SCREEN)}>
          {/* Left card */}
          <View style={styles.chapterCard}>
            {/* Icon */}
            <View style={styles.icon}>
              <Icon name="book" style={styles.chapterIcon} />
            </View>
            {/* Text */}
            <View style={styles.chapterMiddle}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.chapterName}>{item.chapter}</Text>
            </View>
          </View>
          {/* Continue */}
          <View>
            <TouchableOpacity style={styles.continue}>
              <Text style={styles.continuteBtn}>Continue</Text>
            </TouchableOpacity>
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
    paddingTop: 20,
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
    alignItems: 'center',
  },
  chapterBox: {
    width: '90%',
    display: 'flex',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#293748',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,

    borderBottomWidth: 10,
    borderColor: '#AAA',
  },
  continue: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 12,
  },
  continuteBtn: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  chapterIcon: {
    fontSize: 28,
    color: '#293748',
    fontWeight: '700',
  },
  chapterMiddle: {
    marginLeft: 10,
  },
  icon: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: '300',
  },
  chapterName: {
    fontSize: 22,
    color: 'white',
    fontWeight: '600',
  },
});
