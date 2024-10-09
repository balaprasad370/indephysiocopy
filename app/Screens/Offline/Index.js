import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import NetInfo from '@react-native-community/netinfo';
const OfflineScreen = ({onRetry}) => {
  const navigation = useNavigation();

  // Function to check internet and redirect if connected
  const handleRetry = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        // If the internet is available, navigate to Dashboard
        navigation.navigate(ROUTES.DASHBOARD); // Change 'Dashboard' to your actual route name
      } else {
        // If no internet, show an alert
        Alert.alert(
          'No Connection',
          'Please check your connection and try again.',
        );
      }
    });
  };
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaDWy2_0GU1-bjNU0LncGCMA1sf_gWwRnRvw&s',
        }} // Add a "no-internet" image in the assets folder
        style={styles.image}
      />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Please check your internet connection and try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OfflineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  retryText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
