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
import React, {useContext, useEffect, useState} from 'react';
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';

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
      console.log('Error during logout:', error);
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

  // Image upload content
  const [image, setImage] = useState(null); // Store the image in a hook

  // Function to handle camera image capture
  const takePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1, // Capture the highest quality photo
      saveToPhotos: true,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('Error: ', result.errorMessage);
      Alert.alert('Error', result.errorMessage);
    } else if (result.assets) {
      // Compress the image after capture
      compressImage(result.assets[0].uri);
    }
  };

  // Function to handle image selection from gallery
  const chooseFromGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1, // Choose the highest quality image
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('Error: ', result.errorMessage);
      Alert.alert('Error', result.errorMessage);
    } else if (result.assets) {
      // Compress the image after selection
      compressImage(result.assets[0].uri);
    }
  };

  // Function to compress the image before storing it
  const compressImage = async uri => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        800, // Resize to width 800px
        800, // Resize to height 800px
        'JPEG',
        80, // 80% quality
      );
      setImage(resizedImage.uri); // Store the compressed image URI in state
      console.log('Image compressed and set:', resizedImage.uri);
    } catch (error) {
      console.log('Error resizing image:', error);
      Alert.alert('Error', 'Failed to compress image');
    }
  };

  const uploadFileToServer = async fileUri => {
    const token = await storage.getStringAsync('token');

    const fileName = fileUri.split('/').pop();
    const payload = {
      file: {
        uri: fileUri,
        name: fileName,
        type: 'image/jpeg',
      },
    };

    try {
      const response = await axios.post(
        'https://server.indephysio.com/upload/image',
        fileName,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data.filepath);
      // return response.data.filepath;
    } catch (error) {
      console.log('Error uploading file:', error.response);
      // throw error;
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
                source={
                  image
                    ? {uri: image}
                    : {
                        uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                      }
                }
                style={{width: 90, height: 90, borderRadius: 45}}
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
              onPress={takePhoto}
              style={{
                backgroundColor: color.white,
                padding: 8,
                borderRadius: 10,
                width: '45%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: isDark ? color.black : color.black,
                }}>
                Take a photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={chooseFromGallery}
              style={{
                backgroundColor: color.white,
                padding: 8,
                borderRadius: 10,
                width: '45%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: isDark ? color.black : color.black,
                }}>
                Choose from gallery
              </Text>
            </TouchableOpacity>
          </View>
          {image && (
            <TouchableOpacity
              onPress={() => uploadFileToServer(image)} // Choose an image from gallery
              style={{
                backgroundColor: color.darkPrimary,
                padding: 8,
                borderRadius: 10,
                alignSelf: 'center',
                width: '45%',
                marginTop: 20,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: isDark ? color.white : color.black,
                }}>
                Upload
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={style.commonBackground}></View>
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
