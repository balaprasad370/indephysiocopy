import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import color from '../../Constants/color';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';

const PricingCard = ({item}) => {
  const handlePress = () => {
    // Replace with your website URL
    Linking.openURL('https://portal.indephysio.com');
  };

  return (
    <TouchableOpacity style={styles.card}>
      <LinearGradient
        colors={['#2A89C6', '#3397CB', '#0C5CB4']}
        start={{x: 0, y: 0}} // Start from the left
        end={{x: 1, y: 0}}
        style={styles.gradientBackground}>
        <Text style={styles.packageName}>{item.packageName}</Text>
        <Text style={styles.oneTimePrice}>Duration: {item.duration}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.monthlyPrice}>One-time Fee: {item.oneTime}</Text>
          <Text style={styles.monthlyPrice}>
            Monthly Subscription: {item.monthly} / month
          </Text>
        </View>
        <Text style={styles.translation}>Translation: {item.translation}</Text>
        <Text style={styles.licence}>Licence: {item.licence}</Text>
        <Text style={styles.placement}>Placement: {item.placement}</Text>

        {/* Buy Now Button */}
        <TouchableOpacity style={styles.buyNowButton} onPress={handlePress}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const Index = () => {
  const packages = [
    {
      packageName: 'Superfast',
      duration: '6 months',
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
      translation: '€30 / page',
      licence: '20K - 40K',
      placement: '€599 after 1st month Salary',
    },
    {
      packageName: 'UG Finals',
      duration: '6 months after graduation',
      monthly: '₹1,499',
      oneTime: '₹14,999',
      translation: '€30 / page',
      licence: '20K - 40K',
      placement: '€599 after 1st month Salary',
    },
    {
      packageName: 'UG Dreamers',
      duration: '6 months after graduation',
      monthly: '₹499',
      oneTime: '₹2,499',
      translation: '€30 / page',
      licence: '20K - 40K',
      placement: '€599 after 1st month Salary',
    },
  ];

  const {isDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;
  return (
    <FlatList
      data={packages}
      renderItem={({item}) => <PricingCard item={item} />}
      keyExtractor={item => item.packageName}
      contentContainerStyle={style.packageContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  packageContainer: {
    backgroundColor: '#000',
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 0, // No padding here; applied to inner content for gradient effect
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden', // Ensure content is clipped by rounded corners
  },
  gradientBackground: {
    borderRadius: 12,
    padding: 20,
  },
  packageName: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: color.white,
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 12,
  },
  oneTimePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.white,
  },
  monthlyPrice: {
    fontSize: 16,
    color: color.white,
    marginTop: 4,
  },
  translation: {
    fontSize: 14,
    color: color.white,
    marginBottom: 4,
  },
  licence: {
    fontSize: 14,
    color: color.white,
    marginBottom: 4,
  },
  placement: {
    fontSize: 14,
    color: color.white,
  },
  buyNowButton: {
    marginTop: 20,
    backgroundColor: color.lightPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyNowText: {
    color: color.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
