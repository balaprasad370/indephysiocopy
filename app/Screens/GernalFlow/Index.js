import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';
import color from '../../Constants/color';
import scale from '../../utils/utils';
import ProfileLevel from '../../Components/ProfileLevel/index';
import {useNavigation} from '@react-navigation/native';

const packages = [
  {
    packageName: 'Superfast',
    duration: '6 months',
    note: 'Documentation and translation can be started from the beginning',
    monthly: '₹9,999',
    oneTime: '₹1,49,999',
    translation: '€30 / page',
    licence: '20K - 40K',
    placement: '€599 after 1st month Salary',
  },
  {
    packageName: 'Express',
    duration: '12 Months',
    monthly: '₹7,500',
    note: 'Documentation and translation can be started from the beginning',
    oneTime: '₹69,999',
    translation: '€30 / page',
    licence: '20K - 40K',
    placement: '€599 after 1st month Salary',
  },
  {
    packageName: 'Professional',
    duration: '18 Months',
    monthly: '₹3,499',
    oneTime: '₹34,999',
    note: 'Documentation and translation can be started after graduation',
    translation: '€30 / page',
    licence: '20K - 40K',
    placement: '€599 after 1st month Salary',
  },
  {
    packageName: 'UG Finals',
    duration: '6 months after graduation',
    monthly: '₹1,499',
    oneTime: '₹14,999',
    note: 'Documentation and translation can be started after graduation',
    translation: '€30 / page',
    licence: '20K - 40K',
    placement: '€599 after 1st month Salary',
  },
  {
    packageName: 'UG Dreamers',
    duration: '6 months after graduation',
    monthly: '₹499',
    note: 'Documentation and translation can be started after graduation',
    oneTime: '₹2,499',
    translation: '€30 / page',
    licence: '20K - 40K',
    placement: '€599 after 1st month Salary',
  },
];

const {height} = Dimensions.get('window');

const Index = () => {
  const [selectedPackage, setSelectedPackage] = useState('Superfast');
  const navigation = useNavigation();

  const handlePress = () => {
    // Replace with your website URL
    Linking.openURL('https://portal.indephysio.com/');
  };

  const renderPackage = ({item}) => (
    <TouchableOpacity
      style={[
        styles.card,
        selectedPackage === item.packageName && styles.selectedCard,
      ]}
      onPress={() => setSelectedPackage(item.packageName)}>
      <Text style={styles.cardTitle}>{item.packageName}</Text>
      <Text style={styles.price}>Duration: {item.duration}</Text>
      <Text style={styles.detailsText}>Note: {item.note}</Text>
      <TouchableOpacity style={styles.buyButton} onPress={handlePress}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
        <Text style={styles.arrow}>➔</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        <FlatList
          data={packages}
          renderItem={renderPackage}
          keyExtractor={item => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
      <View style={styles.detailsContainer}>
        {selectedPackage === 'Express' && (
          <Text style={{color: color.black}}>
            Note: Upgrade to Superfast for quicker processing with your existing
            documents. Express is cost-effective, but Superfast delivers faster,
            premium service.
          </Text>
        )}
        {selectedPackage && (
          <View style={{height: '100%'}}>
            <ProfileLevel />
          </View>
        )}
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f4f8',
  },
  cardsContainer: {
    height: height * 0.24,
    paddingVertical: scale(10),
  },
  flatListContent: {
    paddingHorizontal: scale(6),
  },
  card: {
    width: scale(150),
    height: '100%',
    marginHorizontal: scale(8),
    borderRadius: scale(10),
    padding: scale(10),
    justifyContent: 'space-between',
    backgroundColor: '#5b9df9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedCard: {
    backgroundColor: '#3a7bd5',
  },
  iconPlaceholder: {
    width: scale(26),
    height: scale(26),
    borderRadius: scale(18),
    backgroundColor: '#ffffff66',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: scale(16),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  price: {
    color: '#FFF',
    fontSize: scale(14),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  buyButton: {
    flexDirection: 'row',
    marginTop: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(16),
  },
  buyButtonText: {
    color: '#5b9df9',
    fontWeight: 'bold',
    fontSize: scale(13),
  },
  arrow: {
    color: '#5b9df9',
    marginLeft: scale(8),
    fontSize: scale(14),
  },
  detailsContainer: {
    height: height * scale(0.63),
    padding: scale(10),
    backgroundColor: '#FFF',
    borderTopLeftRadius: scale(18),
    borderTopRightRadius: scale(18),
  },
  detailsText: {
    fontSize: scale(11),
    color: '#F1f1f1',
  },
});
