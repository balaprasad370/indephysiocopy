import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import axiosInstance from './../axiosInstance';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Index = () => {
  const [progressNotification, setProgressNotification] = useState(null);
  const [status, setStatus] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getProgressNotification();
  }, []);

  const getProgressNotification = async () => {
    try {
      console.log('getProgressNotification');

      const response = await axiosInstance.get('/student/progress');

      if (response.data.status) {
        setStatus(true);
        setProgressNotification(response.data.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getModuleIcon = (moduleType) => {
    switch(moduleType) {
      case 'quiz': return 'quiz';
      case 'reading': return 'menu-book';
      case 'flashcard': return 'flip';
      case 'chapters': return 'library-books';
      default: return 'notifications';
    }
  };

  const getModuleColor = (moduleType) => {
    switch(moduleType) {
      case 'quiz': return '#FF6B6B';
      case 'reading': return '#4ECDC4';
      case 'flashcard': return '#FFD166';
      case 'chapters': return '#613BFF';
      default: return '#613BFF';
    }
  };

  const handlePress = () => {
    if (progressNotification && progressNotification.route) {
      navigation.navigate(progressNotification.route, progressNotification.params);
    }
  };

  return (
    <View>
      {status && progressNotification && progressNotification.show && (
        <TouchableOpacity 
          style={[
            styles.banner, 
            {borderLeftColor: getModuleColor(progressNotification.module_type)}
          ]} 
          onPress={handlePress}
        >
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={[styles.continueText, {color: getModuleColor(progressNotification.module_type)}]}>
                Continue Learning
              </Text>
              <Text style={styles.titleText}>{progressNotification.title}</Text>
              {progressNotification.description && (
                <Text style={styles.descriptionText} numberOfLines={1}>
                  {progressNotification.description}
                </Text>
              )}
            </View>
            <View style={[
              styles.iconContainer, 
              {backgroundColor: `${getModuleColor(progressNotification.module_type)}20`}
            ]}>
              <Icon 
                name={getModuleIcon(progressNotification.module_type)} 
                size={24} 
                color={getModuleColor(progressNotification.module_type)} 
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  continueText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
  },
  iconContainer: {
    borderRadius: 50,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default Index;
