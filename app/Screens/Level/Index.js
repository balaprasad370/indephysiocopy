import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Level} from '..';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import color from '../../Constants/color';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    level: 'A1 Level',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    level: 'A2 Level',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    level: 'B1 Level',
    title: 'Third Item',
  },
  {
    id: '52694a0f-3da1-471fd-bd96-145571e29d72',
    level: 'B2 Level',
    title: 'Fourth Item',
  },
  {
    id: '58694a0f-3da1-471sf-bd96-145571e29d72',
    level: 'C1 Level',
    title: 'Third Item',
  },
  {
    id: '52694a0f-3da1-471f-bd96-145571e29d72',
    level: 'C2 Level',
    title: 'Fourth Item',
  },
];
const Index = () => {
  const navigation = useNavigation();
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.level}
        onPress={() => navigation.navigate(ROUTES.CHAPTERS)}>
        <View style={styles.levelCard}>
          {/* Top card */}
          <View style={styles.upperLevel}>
            <Icon name="flag" style={styles.levelIcon} />
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
          {/* Middle number */}
          <View style={styles.middleLevel}>
            <View style={styles.roundLevel}>
              <Text style={styles.levelNumber}>1</Text>
            </View>
            <View style={styles.dot}></View>
            <View style={styles.roundLevel}>
              <Text style={styles.levelNumber}>2</Text>
            </View>
            <View style={styles.dot}></View>
            <View style={styles.roundLevel}>
              <Text style={styles.levelNumber}>3</Text>
            </View>
            <View style={styles.dot}></View>
            <View style={styles.roundLevel}>
              <Text style={styles.levelNumber}>4</Text>
            </View>
            <View style={styles.dot}></View>
            <View style={styles.roundLevel}>
              <Text style={styles.levelNumber}>5</Text>
            </View>
          </View>
          {/* Description */}
          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's
            </Text>
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
    backgroundColor: 'white',
  },
  level: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',

    alignItems: 'center',
  },
  levelCard: {
    width: '93%',
    borderWidth: 4,
    borderColor: color.black,
    backgroundColor: '#293748',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  upperLevel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    marginLeft: 10,
  },
  levelIcon: {
    fontSize: 22,
    color: 'white',
  },
  middleLevel: {
    marginTop: 8,
    display: 'flex',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundLevel: {
    width: 40,
    height: 40,
    backgroundColor: '#CAD0DD',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#586678',
  },
  description: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#CAD0DD',
  },
  dot: {
    width: 15,
    height: 15,
    backgroundColor: '#CAD0DD',
    borderRadius: 50,
  },
});
