import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MenuIcon from 'react-native-vector-icons/Ionicons';
import GlssIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Chapter from '../../Components/Chapter/Index';
import IconFam from 'react-native-vector-icons/MaterialIcons';
import SearchComponent from '../../Components/SearchComponent/Index';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import CalendarComponent from '../../Components/Calender/Index';
import color from '../../Constants/color';

const Index = () => {
  const {isDark, setIsDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDark ? color.black : color.white}}>
      <CalendarComponent />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({});
