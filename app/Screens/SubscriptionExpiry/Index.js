import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';

const Index = () => {
  const [isModalVisible, setModalVisible] = useState(true);

  const handleSubscribe = () => {
    // Replace this with the actual subscription link or website URL
    const subscriptionUrl = 'https://portal.indephysio.com/subscriptions';
    Linking.openURL(subscriptionUrl);
  };

  return (
    <View style={styles.background}>
      {/* <Modal transparent={true} animationType="fade" visible={isModalVisible}> */}
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Subscription is expired!</Text>
          <Text style={styles.modalSubText}>
              Your subscription has ended. Please renew to continue using the service.
          </Text>
          <TouchableOpacity onPress={handleSubscribe} style={styles.button}>
            <Text style={styles.buttonText}>Renew Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </Modal> */}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 2,
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
