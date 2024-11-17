import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  Image,
  Linking,
} from 'react-native';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import storage from '../../Constants/storage';

const AppUpdate = () => {
  const [appVersion, setAppVersion] = useState();
  const [deviceVersion, setDeviceVersion] = useState(DeviceInfo.getVersion());
  const [iosDeviceVersion, setIosDeviceVersion] = useState(
    DeviceInfo.getVersion(),
  );
  const [iosAppVersion, setIosAppVersion] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  // Function to check app version
  const checkAppVersion = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.get(
        'https://mobile.indephysio.com/v1/appversion',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAppVersion(response.data.result.app_version);
      setIosAppVersion(response.data.result.ios_version);
      console.log('deviceVersion', deviceVersion);
      if (
        response.data.result.app_version !== deviceVersion &&
        Platform.OS === 'android'
      ) {
        setIsModalVisible(true); // Show modal if versions don't match
      } else if (
        response.data.result.ios_version !== iosDeviceVersion &&
        Platform.OS === 'ios'
      ) {
        setIsModalVisible(true); // Show modal if versions don't match
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  // Open the Play Store or App Store for updating the app
  const openStore = () => {
    if (Platform.OS === 'android') {
      const playStoreUrl =
        'https://play.google.com/store/apps/details?id=com.inde.physio'; // Replace with your app's package name
      Linking.openURL(playStoreUrl); // Open Play Store
    } else {
      const appStoreUrl =
        'https://apps.apple.com/us/app/meduniverse/id6736482857'; // Replace with your app's package name
      Linking.openURL(appStoreUrl); // Open App Store
    }
  };

  useEffect(() => {
    checkAppVersion();
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)} // Handle Android back press
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {Platform.OS === 'android' && (
              <View style={styles.logoContainer}>
                <Image
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_-UqBmHyaSPrTUxgjpbYBEez1fvLliPSBhGQPKaI6c85n_1vPKj78n54QNvgVYVURi1-MAnWQXU0EPQUBy3zv7-D-Ru2gFVRpOzrJ5UIfn4aH1CHRXlywdP7xnivhdmENnOOvPveSQzY/s1600/play_logo_16_9+%25285%2529.png"
                  style={styles.logo}
                />
              </View>
            )}
            {Platform.OS === 'ios' && (
              <View style={styles.appstoreContainer}>
                <Image
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmA-_LfIzAJkSmTBF_Qr0V3qM5eEn94havBQ&s"
                  style={styles.appstore}
                />
              </View>
            )}
            <Text style={styles.modalTitle}>Update Available</Text>
            <Text style={styles.modalMessage}>
              A new version of the app is available. Please update your app to
              continue using it.
            </Text>
            <TouchableOpacity style={styles.updateButton} onPress={openStore}>
              <Text style={styles.updateButtonText}>Update Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)} // Close modal
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Modal at the bottom of the screen
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoContainer: {
    width: 100,
    height: 50,
    marginBottom: 15,
  },
  logo: {
    width: '100%',
    height: '100%',
    marginBottom: 15,
  },
  appstoreContainer: {
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  appstore: {
    width: '100%',
    height: '100%',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  updateButton: {
    backgroundColor: '#007BFF', // Play Store blue color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default AppUpdate;
