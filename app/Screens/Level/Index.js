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
    title: 'Beginner',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    level: 'A2 Level',
    title: 'Medium',
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
            <Text style={styles.descriptionText}>{item.title}</Text>
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
    fontSize: 18,
    color: color.white,
    fontWeight: '600',
    marginLeft: 10,
  },
  levelIcon: {
    fontSize: 18,
    color: color.white,
  },
  middleLevel: {
    marginTop: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundLevel: {
    width: 25,
    height: 25,
    backgroundColor: color.white,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#293748',
  },
  description: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: color.white,
  },
  dot: {
    width: 12,
    height: 12,
    backgroundColor: color.white,
    borderRadius: 50,
  },
});
