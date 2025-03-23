import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  SafeAreaView,
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
import scale from '../../utils/utils';
import {PermissionsAndroid, Platform} from 'react-native';
import trackEvent, {mixPanel} from '../../Components/MixPanel/index';

const Index = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const {isDark, setIsDark, userData, isAuthenticate, setIsAuthenticate, path} =
    useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  const logoutButton = async () => {
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
              navigation.replace(ROUTES.LOGIN);
            } catch (error) {
              console.log('Error during logout:', error);
            }
          },
          style: 'destructive', // Optional: Set style to indicate danger (for destructive actions like logout)
        },
      ],
      {cancelable: true},
    );
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
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
      });
      if (result.didCancel) {
        Alert.alert('Cancelled', 'No image selected');
      } else if (result.errorMessage) {
        Alert.alert('Error', result.errorMessage);
      } else {
        setImage(result.assets[0]);
      }
    } else {
      Alert.alert('Error', 'Camera permission is required');
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
      setImage(result.assets[0]);
    }
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera access to take pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const deleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Redirect to the website for account deletion
            const websiteURL = 'https://indephysio.com/index/accountdelete';
            Linking.openURL(websiteURL).catch(err =>
              console.log("Couldn't load page", err),
            );
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const uploadFileToServer = async file => {
    const token = await storage.getStringAsync('token');
    let name = file.fileName;
    file.name = name;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const response = await axios.post(
        'https://server.indephysio.com/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Get the uploaded file path from the response
      const filePath = response.data.filepath;
      console.log('Uploaded file path:', filePath);

      // Now update the student's profile photo in the database
      const updateResponse = await axios.post(
        `${path}/student/updateProfilePhoto`,
        {
          filePath, // The file path received from the server
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(updateResponse.data.message);
      setImage(null);
      setLoading(false);
      // return response.data.filepath;
    } catch (error) {
      console.log('Error uploading file:', error);
    }
  };

  const RenderItem = () => {
    return (
      <SafeAreaView style={{}}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: scale(10),
          }}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <TouchableOpacity style={{width: 90, height: 90, borderRadius: 45}}>
              {loading ? (
                <ActivityIndicator size="large" color={color.darkPrimary} />
              ) : (
                <Image
                  source={
                    image
                      ? {uri: image.uri}
                      : userData && userData.profile_pic
                      ? {
                          uri: `https://d2c9u2e33z36pz.cloudfront.net/${userData?.profile_pic}`,
                        }
                      : {
                          uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                        }
                  }
                  style={{width: 90, height: 90, borderRadius: 45}}
                />
              )}
              {/* <Image
                source={
                  userData && userData.profile_pic
                    ? {
                        uri: `https://d2c9u2e33z36pz.cloudfront.net/${userData?.profile_pic}`,
                      }
                    : {
                        uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                      }
                }
                style={{width: 90, height: 90, borderRadius: 45}}
              /> */}
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
                backgroundColor: isDark ? 'rgba(256,256,256,0.1)' : color.white,
                padding: 8,
                justifyContent: 'center', // Centers vertically
                alignItems: 'center',
                borderRadius: 10,
                width: '45%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: scale(14),
                  color: isDark ? color.white : color.black,
                }}>
                Take a photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={chooseFromGallery}
              style={{
                backgroundColor: isDark ? 'rgba(256,256,256,0.1)' : color.white,
                padding: 8,
                borderRadius: 10,
                width: '45%',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: scale(14),
                  color: isDark ? color.white : color.black,
                }}>
                Choose from gallery
              </Text>
            </TouchableOpacity>
          </View>
          {image && (
            <TouchableOpacity
              disabled={loading}
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
                  fontSize: scale(14),
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
        </View>
        {/* <View style={[style.commonBackground, {marginTop: scale(5)}]}>
          <TouchableOpacity
            hitSlop={{x: 25, y: 15}}
            style={style.commonTouch}
            onPress={() => deleteAccount()}>
            <View style={style.settingLeft}>
              <Ionicons name="trash-bin" style={style.settingIcon} />
              <Text style={style.commonText}>Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View> */}
        <TouchableOpacity
          hitSlop={{x: 25, y: 15}}
          style={style.logoutBox}
          onPress={logoutButton}>
          <View style={style.logout}>
            <Icon name="infocirlceo" style={style.settingIcon} />
            <Text style={style.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
        {/* <Text style={{textAlign: 'center', fontSize: scale(14), marginTop: 20}}>
          To delete your account, please contact our support team at
          info@indephysio.com or call us at +91-9894604603. Our team will assist
          you with the account deletion process.
        </Text> */}
      </SafeAreaView>
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
