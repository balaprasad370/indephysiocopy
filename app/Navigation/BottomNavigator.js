import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Dashboard, SelfLearn, Documents, LiveClasses} from '../Screens';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ROUTES} from '../Constants/routes';
import {AppContext} from '../theme/AppContext';
import LighTheme from '../theme/LighTheme';
import DarkTheme from '../theme/Darktheme';
import color from '../Constants/color';
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

  const {isDark, setIsDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  return (
    <View style={style.bottomTab}>
      <View
        style={{
          backgroundColor: color.darkPrimary,
          borderRadius: 50,
          alignItems: 'center',
          marginLeft: 6,
          marginRight: 6,
          marginBottom: 8,
          paddingTop: 6,
          paddingBottom: 6,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          onPress={() => handleNavigateScreen(0)}
          style={index === 0 ? styles.activeTabButton : {}}>
          <Ionicons
            name="view-dashboard"
            style={{marginLeft: 8}}
            size={30}
            color="white"
          />
          {index === 0 && (
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '600',
                marginLeft: 10,
              }}>
              DASHBOARD
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={index === 1 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(1)}>
          <Ionicons
            name="monitor-dashboard"
            size={30}
            style={{marginLeft: 8}}
            color="white"
          />
          {index === 1 && (
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '600',
                marginLeft: 10,
              }}>
              LIVE CLASS
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={index === 2 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(2)}>
          <Ionicons
            name="folder-open"
            size={30}
            style={{marginLeft: 8}}
            color="white"
          />
          {index === 2 && (
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '600',
                marginLeft: 10,
              }}>
              DOCUMENTS
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={index === 3 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(3)}>
          <Ionicons
            name="book-open-blank-variant"
            style={{marginLeft: 8}}
            size={30}
            color="white"
          />
          {index === 3 && (
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: '600',
                marginLeft: 10,
              }}>
              SELF LEARN
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
    padding: 6,
    width: '50%',
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
