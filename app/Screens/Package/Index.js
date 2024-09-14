import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import color from '../../Constants/color';
import {ROUTES} from '../../Constants/routes';

const DATA = [
  {
    id: '1',
    package: 'Superfast',
    duration: '6 months',
    locked: true,
  },
  {
    id: '2',
    package: 'Express',
    duration: '1 year',
    locked: false,
  },
  {
    id: '3',
    package: 'Professional',
    duration: '18 Months',
    locked: true,
  },
  {
    id: '4',
    package: 'UG Finals',
    duration: '30 months',
    locked: true,
  },
  {
    id: '5',
    package: 'UG Dreamers',
    duration: '6 months after graduation',
    locked: true,
  },
];

const Index = () => {
  const navigation = useNavigation();

  const renderItem = ({item}) => (
    <TouchableOpacity
      key={item.id}
      hitSlop={{x: 25, y: 15}}
      style={styles.packageCard}
      onPress={() => navigation.navigate(ROUTES.CHAPTERS)}>
      <View style={styles.packageName}>
        <Text style={styles.packageText}>{item.package}</Text>
        {item && item.locked ? (
          <Icon name="lock-closed" style={styles.lockIcon} />
        ) : (
          <Icon name="lock-open" style={styles.lockIcon} />
        )}
      </View>

      <View style={styles.duration}>
        <Icon name="time-outline" style={styles.durationIcon} />
        <Text style={styles.durationText}>{item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.package}
      data={DATA}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  package: {
    flex: 1,
    padding: '3%',
    backgroundColor: 'white',
  },
  packageCard: {
    marginBottom: 8,
    backgroundColor: '#293748',
    // padding: 10,
    borderRadius: 10,
  },
  lockIcon: {
    fontSize: 22,
    color: 'white',
  },
  packageName: {
    backgroundColor: color.lowPrimary,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  packageText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  duration: {
    display: 'flex',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  durationIcon: {
    fontSize: 22,
    color: 'white',
    fontWeight: '300',
  },
  durationText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '300',
    color: 'white',
  },
});
