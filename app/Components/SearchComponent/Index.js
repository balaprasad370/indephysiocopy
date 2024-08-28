import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import MenuIcon from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import {styles} from './SearchComponent';
const Index = () => {
  const {isDark, setIsDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;
  return (
    <View style={styles.searchBox}>
      <View style={styles.searchInnerBox}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor="grey"
          style={styles.searchInput}
        />
        <Icon name="search1" style={styles.searchIcon} />
      </View>
      <TouchableOpacity style={style.menuBtn}>
        <MenuIcon name="options-outline" style={style.menuIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default Index;
