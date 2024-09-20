import React, {useRef, useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../assets/logo.png';
import color from '../../Constants/color';

const Certificate = ({route}) => {
  const viewShotRef = useRef();
  const {module_id} = route.params;

  console.log(module_id);
  const {path, isDark, userData} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const [marks, setMarks] = useState(null);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState();

  useEffect(() => {
    const fetchMarks = async () => {
      const token = await storage.getStringAsync('token');
      try {
        const response = await axios.get(`${path}/student/score`, {
          params: {
            module_id,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setMarks(response.data?.result?.marks);
        setDate(response.data?.result?.modified_date);
        setTotal(response.data?.result?.total);
      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    };

    fetchMarks();
  }, [module_id]);

  const captureAndShareScreenshot = () => {
    Alert.alert('');
    viewShotRef.current.capture().then(uri => {});
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View style={style.marksContainer}>
        <ViewShot ref={viewShotRef} options={{format: 'png', quality: 0.9}}>
          {/* <View style={styles.certificateCard}> */}
          <LinearGradient
            colors={['#2A89C6', '#3397CB', '#0C5CB4']}
            start={{x: 0, y: 0}} // Start from the left
            end={{x: 1, y: 0}}
            style={styles.certificateCard}>
            {/* Certificate Border */}
            <View style={styles.border}>
              {/* Logo at the top */}
              <Image source={logo} style={styles.logo} />

              {/* Certificate Title */}
              <Text style={styles.certificateTitle}>
                Certificate of Achievement
              </Text>

              {/* Decorative Line */}
              <View style={styles.decorativeLine} />

              {/* Student Name */}
              <Text style={styles.studentName}>
                {userData?.first_name} {userData?.last_name}
              </Text>
              <Text style={styles.descriptionText}>
                has successfully completed
              </Text>

              {/* Exam Title */}
              <Text style={styles.examTitle}>Mathematics End-of-Term Exam</Text>

              {/* Score Section */}
              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>Score:</Text>
                <Text style={styles.score}>
                  {marks !== null ? `${marks} / ${total}` : 'Loading...'}
                </Text>
              </View>

              {/* Date and Issuer */}
              <Text style={styles.date}>
                Date: {new Date(date).toLocaleDateString()}
              </Text>

              <Text style={styles.issuer}>
                Issued by: ABC Certification Board
              </Text>

              {/* Signature */}
              <View style={styles.signatureSection}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Authorized Signature</Text>
              </View>
            </View>
            {/* </View> */}
          </LinearGradient>
        </ViewShot>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          hitSlop={{x: 25, y: 15}}
          onPress={captureAndShareScreenshot}>
          <Text style={styles.shareText}>Share Certificate</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Certificate;

const styles = StyleSheet.create({
  certificateCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    width: '100%',
    maxWidth: 400,
  },
  border: {
    borderColor: '#d4af37', // Gold-like border color
    borderWidth: 4,
    padding: 20,
    borderRadius: 10,
    position: 'relative',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  certificateTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    textTransform: 'uppercase',
    marginBottom: 10,
    fontFamily: 'serif', // Elegant serif font
  },
  decorativeLine: {
    height: 2,
    backgroundColor: '#d4af37',
    width: '50%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'serif',
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
    fontFamily: 'sans-serif',
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0056b3',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'sans-serif-medium',
  },
  scoreSection: {
    backgroundColor: '#f0f5ff',
    padding: 15,
    borderRadius: 10,
    borderColor: '#cce0ff',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    fontFamily: 'sans-serif',
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0056b3',
    fontFamily: 'serif',
  },
  date: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  issuer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'sans-serif-medium',
  },
  signatureSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  signatureLine: {
    width: 150,
    height: 1,
    backgroundColor: '#000',
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 14,
    color: '#555',
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: '#0056b3',
    padding: 15,
    borderRadius: 30,
    width: '100%',
    maxWidth: 250,
    alignItems: 'center',
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
