import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import color from '../../Constants/color';
import scale from '../../utils/utils';

const InstallmentCard = ({item}) => {
  const handlePress = () => {
    // Replace with your website URL
    Linking.openURL('https://portal.indephysio.com');
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']} // Gradient colors
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}>
      <Text style={styles.packageName}>{item.packageName}</Text>
      <Text style={styles.installmentTitle}>Installments</Text>
      <View style={styles.installmentsContainer}>
        {item.installments.map((installment, index) => (
          <View key={index} style={styles.installmentRow}>
            <Text style={styles.installmentLabel}>{installment.label}:</Text>
            <Text style={styles.installmentValue}>{installment.value}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.buyNowButton} onPress={handlePress}>
        <Text style={styles.buyNowText}>Buy Now</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const Index = () => {
  const packages = [
    {
      packageName: 'Superfast',
      installments: [
        {label: 'Duration (of job placement)', value: '6 Months'},
        {label: 'Consultancy Fee', value: '₹1,49,999/-'},
        // {label: 'Monthly', value: '₹9,999/-'},
        {label: '1st Installment', value: '₹59,999/-'},
        {label: '2nd Installment (45 days)', value: '₹59,999/-'},
        {label: '3rd Installment (90 days)', value: '₹43,999/-'},
      ],
    },
    {
      packageName: 'Express',
      installments: [
        {label: 'Duration (of job placement)', value: '1 year'},
        {label: 'Consultancy Fee', value: '₹69,999/-'},
        // {label: 'Monthly', value: '₹7,499/-'},
        {label: '1st Installment', value: '₹39,999/-'},
        {label: '2nd Installment (45 days)', value: '₹38,999/-'},
      ],
    },
    {
      packageName: 'Professional',
      installments: [
        {label: 'Duration (of job placement)', value: '18 months'},
        {label: 'Consultancy Fee', value: '₹34,999/-'},
        // {label: 'Monthly', value: '₹3,499/-'},
        {label: '1st Installment', value: '₹19,999/-'},
        {label: '2nd Installment (45 days)', value: '₹19,999/-'},
      ],
    },
    {
      packageName: 'UG Finals',
      installments: [
        {
          label: 'Duration (of job placement)',
          value: '6 months after graduation',
        },
        {label: 'Consultancy Fee', value: '₹14,999/-'},
        // {label: 'Monthly', value: '₹1,499/-'},
        {label: '1st Installment', value: '₹9,999/-'},
        {label: '2nd Installment (45 days)', value: '₹6,999/-'},
      ],
    },
    {
      packageName: 'UG Dreamers',
      installments: [
        {
          label: 'Duration (of job placement)',
          value: '6 months after graduation',
        },
        {label: 'Consultancy Fee', value: '₹2,499/-'},
        // {label: 'Monthly', value: '₹499/-'},
        {label: '1st Installment', value: '₹2,499/-'},
      ],
    },
  ];

  return (
    <FlatList
      data={packages}
      renderItem={({item}) => <InstallmentCard item={item} />}
      keyExtractor={item => item.packageName}
      contentContainerStyle={styles.container}
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: scale(18),
  },
  card: {
    borderRadius: 12,
    padding: scale(18),
    marginBottom: scale(18),
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  packageName: {
    fontSize: scale(22),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: color.white,
    marginBottom: scale(14),
  },
  installmentTitle: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: color.white,
    marginBottom: scale(10),
  },
  installmentsContainer: {
    marginBottom: scale(18),
  },
  installmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  installmentLabel: {
    fontSize: scale(13),
    width: '50%',
    color: color.white,
  },
  installmentValue: {
    fontSize: scale(13),
    color: color.white,
    fontWeight: 'bold',
  },
  buyNowButton: {
    backgroundColor: color.lightPrimary,
    paddingVertical: scale(10),
    borderRadius: scale(7),
    alignItems: 'center',
  },
  buyNowText: {
    color: color.black,
    fontSize: scale(14),
    fontWeight: 'bold',
  },
});
