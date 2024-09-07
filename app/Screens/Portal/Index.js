// import React from 'react';
// import {StyleSheet, Text, View, TouchableOpacity, Linking} from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import color from '../../Constants/color';

// const ReferralScreen = () => {
//   const handlePress = () => {
//     // Replace with your website URL
//     Linking.openURL('https://portal.indephysio.com/app');
//   };

//   return (
//     <View style={styles.container}>
//       {/* Referral Design Section */}
//       <View style={styles.referralSection}>
//         <Icon name="users" size={80} color={color.darkPrimary} />
//         <Text style={styles.referralTitle}>Referral Program</Text>
//         <Text style={styles.referralDescription}>
//           Refer a friend and earn rewards! Help us grow and benefit from our
//           referral program.
//         </Text>
//       </View>

//       {/* Footer Button */}
//       <TouchableOpacity style={styles.footerButton} onPress={handlePress}>
//         <Text style={styles.footerButtonText}>Visit our website</Text>
//         <Icon
//           name="arrow-right"
//           size={20}
//           color="#FFF"
//           style={styles.arrowIcon}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default ReferralScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   referralSection: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   referralTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//     marginVertical: 15,
//     textAlign: 'center',
//   },
//   referralDescription: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   footerButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: color.darkPrimary,
//     paddingVertical: 15,
//     borderRadius: 8,
//     marginHorizontal: 20,
//   },
//   footerButtonText: {
//     color: '#FFF',
//     fontSize: 16,
//     textAlign: 'center',
//     marginRight: 10,
//   },
//   arrowIcon: {
//     marginLeft: 5,
//   },
// });
import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  FlatList,
  Clipboard,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import {AppContext} from '../../theme/AppContext';

const ReferralScreen = () => {
  const {userData} = useContext(AppContext);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    // Generate referral code based on the user's name and student ID
    const generateReferralCode = () => {
      return `${userData?.first_name?.toUpperCase().slice(0, 3)}${
        userData?.student_id
      }`;
    };

    if (userData) {
      setReferralCode(generateReferralCode());
    }
  }, [userData]);

  const handleShare = async () => {
    const shareOptions = {
      title: 'Join Indephysio and Earn Rewards!',
      message: `Use my referral code ${referralCode} to sign up and start earning rewards today!`,
      url: 'https://portal.indephysio.com/app',
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing referral code:', error);
    }
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://portal.indephysio.com/app');
  };

  const handleCopyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard.');
  };

  const data = [
    {
      id: '1',
      icon: 'gift-outline',
      text: 'Earn exclusive rewards for every friend who signs up.',
    },
    {
      id: '2',
      icon: 'account-multiple-outline',
      text: 'Help your friends access premium features and services.',
    },
    {
      id: '3',
      icon: 'star-outline',
      text: 'Increase your points and unlock special bonuses.',
    },
  ];

  const renderItem = ({item}) => (
    <View style={styles.benefitItem}>
      <Icon name={item.icon} size={30} color="#0066cc" />
      <Text style={styles.benefitText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header Section */}
            <View style={styles.header}>
              <LinearGradient
                colors={['#0066cc', '#004080']}
                style={styles.gradient}>
                <Text style={styles.headerTitle}>Refer & Earn</Text>
                <Text style={styles.headerSubtitle}>
                  Invite friends and get rewarded!
                </Text>
              </LinearGradient>
            </View>

            {/* Referral Code Section */}
            <View style={styles.cardContainer}>
              <View style={styles.scratchCard}>
                <Text style={styles.referralCodeTitle}>Your Referral Code</Text>
                <Text style={styles.referralCode}>{referralCode}</Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyCode}>
                <Icon name="content-copy" size={20} color="#FFF" />
                <Text style={styles.copyButtonText}>Copy Code</Text>
              </TouchableOpacity>
            </View>

            {/* Share Section */}
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Icon name="share-variant" size={24} color="#FFF" />
              <Text style={styles.shareButtonText}>Share Code</Text>
            </TouchableOpacity>

            {/* Benefits Title */}
            <Text style={styles.benefitsTitle}>Why Refer?</Text>
          </>
        }
        renderItem={renderItem}
        ListFooterComponent={
          <>
            {/* Footer Section */}
            <TouchableOpacity
              style={styles.visitButton}
              onPress={handleVisitWebsite}>
              <Text style={styles.visitButtonText}>Visit Our Website</Text>
              <Icon name="web" size={24} color="#FFF" />
            </TouchableOpacity>
          </>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 10,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  scratchCard: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  referralCodeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  referralCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginTop: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#004080',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 18,
    marginLeft: 10,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  benefitText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
    flex: 1,
  },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  visitButtonText: {
    color: '#FFF',
    fontSize: 18,
    marginRight: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});
