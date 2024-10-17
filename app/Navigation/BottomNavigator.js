import React, {useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dashboard, SelfLearn, Documents, LiveClasses} from '../Screens';
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
    <SafeAreaView style={style.bottomTab}>
      <LinearGradient
        colors={[color.first, color.second, color.third]} // Gradient colors
        start={{x: 0, y: 0}} // Start from the left
        end={{x: 1, y: 0}} // End at the right
        style={styles.gradientContainer}>
        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          onPress={() => handleNavigateScreen(0)}
          style={index === 0 ? [styles.activeTabButton] : {}}>
          <Ionicons
            name="view-dashboard"
            style={{marginLeft: 0}}
            size={30}
            color="white"
          />
          {index === 0 && <Text style={styles.tabLabel}>DASHBOARD</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          style={index === 1 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(1)}>
          <Ionicons
            name="monitor-dashboard"
            size={30}
            style={{marginLeft: 0}}
            color="white"
          />
          {index === 1 && <Text style={styles.tabLabel}>LIVE CLASS</Text>}
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={index === 2 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(2)}>
          <Ionicons
            name="folder-open"
            size={30}
            style={{marginLeft: 8}}
            color="white"
          />
          {index === 2 && <Text style={styles.tabLabel}>DOCUMENTS</Text>}
        </TouchableOpacity> */}

        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          style={index === 3 ? styles.activeTabButton : {}}
          onPress={() => handleNavigateScreen(3)}>
          <Ionicons
            name="book-open-blank-variant"
            style={{marginLeft: 0}}
            size={30}
            color="white"
          />
          {index === 3 && <Text style={styles.tabLabel}>SELF LEARN</Text>}
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
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
      <Tab.Screen name={ROUTES.SELF_LEARN} component={SelfLearn} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 50,
    alignItems: 'center',
    marginLeft: 6,
    marginRight: 6,
    marginBottom: 4,
    paddingTop: 6,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  activeTabButton: {
    display: 'flex',
    justifyContent: 'center',
    borderWidth: 0.8,
    borderColor: 'white',
    borderRadius: 50,
    padding: 6,
    width: '50%',
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#237FC1', // Active tab background color
  },
  tabLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginLeft: 10,
  },
});
