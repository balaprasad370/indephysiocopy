import {
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect} from 'react';
import color from '../../Constants/color';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TextIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrowIcon from 'react-native-vector-icons/Entypo';
import {AppContext} from '../../theme/AppContext';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import storage from '../../Constants/storage';
import {ROUTES} from '../../Constants/routes';
import {useNavigation} from '@react-navigation/native';
import UserIcon from 'react-native-vector-icons/FontAwesome';

const Index = () => {
  const navigation = useNavigation();

  const {isDark, setIsDark, userData, isAuthenticate, setIsAuthenticate} =
    useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

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

  useEffect(() => {
    console.log(storage.getBool('theme'), 'bool');
  }, []);

  const changeTheme = async () => {
    try {
      const currentTheme = storage.getBool('theme');
      const newTheme = currentTheme === false ? true : false;
      storage.setBool('theme', newTheme);
      setIsDark(newTheme === true);
    } catch (error) {
      console.log('Error changing theme:', error);
    }
  };

  const RenderItem = () => {
    return (
      <View style={{}}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <TouchableOpacity>
              <Image
                src={'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                style={{width: 90, height: 90}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: color.lightPrimary,
                padding: 8,
                borderRadius: 10,
                width: '45%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: isDark ? color.white : color.black,
                }}>
                Take a photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: color.lightPrimary,
                padding: 8,
                borderRadius: 10,
                width: '45%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: isDark ? color.white : color.black,
                }}>
                Choose from gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={style.commonBackground}>
          {/* <View style={style.commonTouchInput}>
            <Icon name="search1" style={style.settingIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={isDark ? color.white : color.black}
            />
          </View> */}
        </View>
        <Text style={style.upperText}>Account</Text>
        <View style={style.commonBackground}>
          <TouchableOpacity hitSlop={{x: 25, y: 15}} style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Icon name="adduser" style={style.settingIcon} />
              <View style={style.userinfo}>
                <Text style={style.commonText}>
                  {userData && userData.first_name}
                </Text>
                <Text style={style.email}>{userData && userData.username}</Text>
              </View>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
        </View>
        {/* App Setting section */}
        <Text style={style.upperText}>App Setting</Text>
        <View style={style.commonBackground}>
          {/* <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Icon name="bells" style={style.settingIcon} />
              <Text style={style.commonText}>Notification</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity hitSlop={{x: 25, y: 15}} style={style.commonTouch}>
            <View style={style.settingLeft}>
              <FontAwesome name="moon-o" style={style.settingIcon} />
              <Text style={style.commonText}>Dark Theme</Text>
            </View>
            <View>
              <Switch value={isDark} onChange={changeTheme} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Accessibility and Media Section  */}
        {/* <Text style={style.upperText}>Accessibility and Media</Text> */}
        {/* <View style={style.commonBackground}>
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Icon name="download" style={style.settingIcon} />
              <Text style={style.commonText}>Download Setting</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Feather name="users" style={style.settingIcon} />
              <Text style={style.commonText}>Accessibility</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Ionicons name="language" style={style.settingIcon} />
              <Text style={style.commonText}>Language</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
        </View> */}
        <Text style={style.upperText}>More info</Text>
        <View style={style.commonBackground}>
          <TouchableOpacity
            hitSlop={{x: 25, y: 15}}
            style={style.commonTouch}
            onPress={() => navigation.navigate(ROUTES.FAQ)}>
            <View style={style.settingLeft}>
              <Ionicons name="help-buoy-sharp" style={style.settingIcon} />
              <Text style={style.commonText}>Help</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Icon name="infocirlceo" style={style.settingIcon} />
              <Text style={style.commonText}>About</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity> */}
        </View>
        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          style={style.logoutBox}
          onPress={logoutButton}>
          <View style={style.logout}>
            <Icon name="infocirlceo" style={style.settingIcon} />
            <Text style={style.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={style.settingScreen}>
      <FlatList
        data={[{key: 'renderItem'}]}
        renderItem={RenderItem}
        keyExtractor={item => item.key}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  searchInput: {
    width: '90%',
    paddingBottom: 2,
    color: '#000',
    paddingTop: 2,
  },
});
