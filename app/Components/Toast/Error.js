import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';

const ErrorToast = ({visible, onClose}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.toastContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <Text style={styles.smiley}>😞</Text>
            </View>
          </View>
          <Text style={styles.title}>oh snap</Text>
          <Text style={styles.message}>Something went terribly wrong.</Text>
          <TouchableOpacity hitSlop={{x: 25, y: 15}} onPress={onClose}>
            <Text style={styles.buttonText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
  },
  toastContainer: {
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  icon: {
    backgroundColor: '#F44336',
    borderRadius: 50,
    padding: 10,
  },
  smiley: {
    fontSize: 24,
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorToast;
