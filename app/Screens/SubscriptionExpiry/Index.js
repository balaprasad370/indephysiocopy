import React, {useEffect, useState, useLayoutEffect, useContext} from 'react';
import {Text, View, TouchableOpacity, Alert} from 'react-native';
import {ROUTES} from './../../Constants/routes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import storage from './../../Constants/storage';
import trackEvent, {mixPanel} from './../../Components/MixPanel/index';
import {AppContext} from '../../theme/AppContext';

const OpenSubscriptionExpiry = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const {isAuthenticate, setIsAuthenticate} = useContext(AppContext);

  useLayoutEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const _isAdmin = await storage.getStringAsync('isAdmin');
    setIsAdmin(_isAdmin == 'true');
  };

  const handleSubscribe = () => {
    navigation.navigate(ROUTES.SUBSCRIPTIONS);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await storage.setBoolAsync('isLoggedIn', false);
              await storage.removeItem('token');
              await storage.removeItem('studentName');
              await storage.removeItem('studentId');
              await storage.removeItem('email');
              await storage.removeItem('isAdmin');

              trackEvent('Log out');
              mixPanel.reset();

              setIsAuthenticate(false);
              navigation.navigate(ROUTES.LOGIN);
            } catch (error) {
              console.log('Error during logout:', error);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const handleSwitchAccount = async () => {
    // Add switch account logic here
    navigation.navigate(ROUTES.STUDENT_ACCESS);
  };

  return (
    <>
      {isModalVisible && (
        <View
          className="absolute inset-0 bg-black/40 bg-opacity-10 h-full w-full"
          style={{zIndex: 9999999}}>
          <View className="flex-1 justify-center items-center">
            <View className="w-4/5 bg-white p-5 rounded-lg items-center shadow-lg">
              <Icon name="warning" size={40} color="#FFA500" className="mb-2" />
              <Text className="text-xl font-bold mb-2.5">
                Subscription is expired!
              </Text>
              <Text className="text-base mb-5 text-center">
                Your subscription has ended. Please renew to continue using the
                service.
              </Text>
              <TouchableOpacity
                onPress={handleSubscribe}
                className="bg-p1 py-2.5 px-8 rounded mb-2.5 w-full items-center flex-row justify-center">
                <Icon name="refresh" size={20} color="white" />
                <Text className="text-white text-base pl-2">
                  Renew Subscription
                </Text>
              </TouchableOpacity>
            </View>

            <View className="w-4/5 mt-8 flex-row justify-between space-x-4 p-4 bg-white rounded-lg">
              {isAdmin && (
                <TouchableOpacity
                  onPress={handleSwitchAccount}
                  className="bg-green-500 py-2.5 px-4 rounded flex-1 flex-row justify-center items-center">
                  <Icon
                    name="swap-horiz"
                    size={20}
                    color="white"
                    className="mr-2"
                  />
                  <Text className="text-white text-base text-center">
                    Switch Account
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 py-2.5 px-4 rounded flex-1 flex-row justify-center items-center">
                <Icon name="logout" size={20} color="white" className="mr-2" />
                <Text className="text-white text-base text-center">Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default OpenSubscriptionExpiry;
