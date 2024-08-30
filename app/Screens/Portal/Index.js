import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import color from '../../Constants/color';

const ReferralScreen = () => {
  const handlePress = () => {
    // Replace with your website URL
    Linking.openURL('https://portal.indephysio.com/app');
  };

  return (
    <View style={styles.container}>
      {/* Referral Design Section */}
      <View style={styles.referralSection}>
        <Icon name="users" size={80} color={color.darkPrimary} />
        <Text style={styles.referralTitle}>Referral Program</Text>
        <Text style={styles.referralDescription}>
          Refer a friend and earn rewards! Help us grow and benefit from our
          referral program.
        </Text>
      </View>

      {/* Footer Button */}
      <TouchableOpacity style={styles.footerButton} onPress={handlePress}>
        <Text style={styles.footerButtonText}>Visit our website</Text>
        <Icon
          name="arrow-right"
          size={20}
          color="#FFF"
          style={styles.arrowIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    padding: 20,
  },
  referralSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  referralTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
    textAlign: 'center',
  },
  referralDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.darkPrimary,
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  footerButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 5,
  },
});
