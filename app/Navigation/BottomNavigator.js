import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Dashboard, SelfLearn, Documents, LiveClasses} from '../Screens';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ROUTES} from '../Constants/routes';
import {AppContext} from '../theme/AppContext';
import LighTheme from '../theme/LighTheme';
import DarkTheme from '../theme/Darktheme';
const Tab = createBottomTabNavigator();

const CustomTabBar = ({state, descriptors, navigation}) => {
  const [index, setIndex] = React.useState(state.index);

  const onTabPress = ({routeName}) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeName,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };
  const handleNavigateScreen = index => {
    setIndex(index);
    if (index === 0) {
      navigation.navigate('Home');
    } else if (index === 1) {
      navigation.navigate('Live Classes');
    } else if (index === 2) {
      navigation.navigate('Documents');
    } else if (index === 3) {
      navigation.navigate('Self Learn');
    }
  };
  const appContext = useContext(AppContext);

  const {isDark, setIsDark} = appContext;

  const style = isDark ? DarkTheme : LighTheme;

  return (
    <View style={style.bottomTab}>
      <View
        style={{
          backgroundColor: '#4daffc',
          borderRadius: 50,
          alignItems: 'center',
          marginLeft: 10,
          marginBottom: 8,
          paddingTop: 6,
          paddingBottom: 6,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          onPress={() => handleNavigateScreen(0)}
          style={index === 0 ? styles.activeTabButton : {}}>
          <Ionicons name="view-dashboard" size={40} color="white" />
          {index === 0 && (
            <Text
              style={{
                fontSize: 22,
                color: 'white',
                marginLeft: 10,
              }}>
              Dashboard
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={index === 1 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(1)}>
          <Ionicons name="monitor-dashboard" size={40} color="white" />
          {index === 1 && (
            <Text style={{fontSize: 22, color: 'white', marginLeft: 10}}>
              Live Class
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={index === 2 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(2)}>
          <Ionicons name="folder-open" size={40} color="white" />
          {index === 2 && (
            <Text style={{fontSize: 22, color: 'white', marginLeft: 10}}>
              Documents
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={index === 3 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(3)}>
          <Ionicons name="book-open-blank-variant" size={40} color="white" />
          {index === 3 && (
            <Text style={{fontSize: 22, color: 'white', marginLeft: 10}}>
              Self Learn
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name={ROUTES.HOME} component={Dashboard} />
      <Tab.Screen name={ROUTES.LIVE_CLASS} component={LiveClasses} />
      <Tab.Screen name={ROUTES.DOCUMENTS} component={Documents} />
      <Tab.Screen name={ROUTES.SELF_LEARN} component={SelfLearn} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  activeTabButton: {
    display: 'flex',
    borderWidth: 0.8,
    borderColor: 'white',
    borderRadius: 50,
    // paddingLeft: 8,
    padding: 6,
    // paddingBottom: 5,
    width: '55%',
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
