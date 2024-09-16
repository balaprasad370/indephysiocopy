import React, {useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {ROUTES} from '../Constants/routes';
import COLOR from '../Constants/color';
import user from '../Constants/person.jpg';
import {AppContext} from '../theme/AppContext';
import storage from '../Constants/storage';
import {Icon} from 'react-native-vector-icons/Icon';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

const DrawerContent = props => {
  const {userData, setIsAuthenticate} = useContext(AppContext);

  const navigation = useNavigation();

  const logoutButton = async () => {
    try {
      storage.setBoolAsync('isLoggedIn', false);
      storage.removeItem('token');
      storage.removeItem('show');
      storage.removeItem('email');
      setIsAuthenticate(false);
      navigation.navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={{x: 25, y: 15}}
            onPress={() => navigation.navigate(ROUTES.PROFILE_SETTING)}
            style={{
              paddingRight: '3%',
            }}>
            <Image
              src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
              style={{width: 55, height: 55}}
            />
          </TouchableOpacity>
          <Text style={styles.username}>
            {userData?.first_name} {userData?.last_name}
          </Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        style={styles.logoutButton}
        onPress={logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white, // Replace with your preferred color
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLOR.primary,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: COLOR.black,
    textAlign: 'center',
  },
  logoutButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLOR.gray,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: COLOR.primary,
  },
});

export default DrawerContent;
