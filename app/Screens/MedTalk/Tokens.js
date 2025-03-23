import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image
} from 'react-native';
import {AppContext} from '../../theme/AppContext';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';

const Tokens = () => {
  const {isDark} = useContext(AppContext);
  const {width} = useWindowDimensions();

  // Token pricing
  const tokenPrice = 0.5; // 1 token = 0.5 Rupees

  // Available amounts
  const amounts = [10, 20, 50, 100, 500];

  const handleAmountPress = amount => {
    console.log(`Selected amount: ${amount} Rs`);
    // Additional logic for purchase can be added here
  };

  const getTokenCount = amount => {
    return Math.floor(amount / tokenPrice);
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDark ? '#121212' : '#F5F5F5'},
      ]}>
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
            onError={() => console.warn('Failed to load background image')}
          />
        </View>
        <View className="flex-row justify-between items-center px-4">
          <PageTitle pageName="Resumes" />
        </View>
      </View>

      <View style={styles.headerContainer}>
        <Text
          style={[styles.headerTitle, {color: isDark ? '#FFFFFF' : '#000000'}]}>
          Purchase Tokens
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            {color: isDark ? '#AAAAAA' : '#666666'},
          ]}>
          1 token = 0.5 Rupees
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {amounts.map((amount, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.amountCard,
              {backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF'},
              {width: width > 600 ? width * 0.7 : width * 0.85},
            ]}
            onPress={() => handleAmountPress(amount)}>
            <View style={styles.amountInfo}>
              <Text
                style={[
                  styles.amountText,
                  {color: isDark ? '#FFFFFF' : '#000000'},
                ]}>
                ₹{amount}
              </Text>
              <Text
                style={[
                  styles.tokenCount,
                  {color: isDark ? '#CCCCCC' : '#666666'},
                ]}>
                {getTokenCount(amount)} tokens
              </Text>
            </View>

            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.buyButton}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <View style={styles.buyButtonContent}>
                <Ionicons name="flash" size={18} color="#FFFFFF" />
                <Text style={styles.buyButtonText}>Buy</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  amountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amountInfo: {
    flex: 1,
  },
  amountText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tokenCount: {
    fontSize: 16,
  },
  buyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Tokens;
