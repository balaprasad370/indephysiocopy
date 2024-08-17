// import {
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useContext} from 'react';
// import color from '../../Constants/color';
// import Icon from 'react-native-vector-icons/AntDesign';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import TextIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import ArrowIcon from 'react-native-vector-icons/Entypo';
// import {AppContext} from '../../theme/AppContext';
// import DarkTheme from '../../theme/Darktheme';
// import LighTheme from '../../theme/LighTheme';
// import storage from '../../Constants/storage';
// import {ROUTES} from '../../Constants/routes';
// import {useNavigation} from '@react-navigation/native';

// const Index = () => {
//   const navigation = useNavigation();
//   const appContext = useContext(AppContext);

//   const {isDark, setIsDark, setLoading, userData} = appContext;

//   const style = isDark ? DarkTheme : LighTheme;
//   const logoutButton = async () => {
//     try {
//       await storage.setBoolAsync('isLoggedIn', false);
//       await storage.removeItem('token');
//       setLoading(false);
//       // await storage.removeItem('token');
//       navigation.navigate(ROUTES.LOGIN);
//     } catch (error) {
//       console.error('Error during logout:', error);
//     }
//   };

//   const RenderItem = ({item}) => {
//     return (
//       <>
//         <View style={style.commonBackground}>
//           <View style={style.commonTouchInput}>
//             <Icon name="search1" style={style.settingIcon} />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search"
//               placeholderTextColor={color.black}
//             />
//           </View>
//         </View>
//         <Text style={style.upperText}>Account</Text>
//         <View style={style.commonBackground}>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <Icon name="adduser" style={style.settingIcon} />
//               <View style={style.userinfo}>
//                 <Text style={style.commonText}>
//                   {userData && userData.first_name}
//                 </Text>
//                 <Text style={style.email}>
//                   {' '}
//                   {userData && userData.username}
//                 </Text>
//               </View>
//             </View>
//             <View>
//               <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
//             </View>
//           </TouchableOpacity>
//         </View>
//         {/* App Setting section */}
//         <Text style={style.upperText}>App Setting</Text>
//         <View style={style.commonBackground}>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <Icon name="bells" style={style.settingIcon} />
//               <Text style={style.commonText}>Notification</Text>
//             </View>
//             <View>
//               <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
//             </View>
//           </TouchableOpacity>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <TextIcon name="format-text" style={style.settingIcon} />
//               <Text style={style.commonText}>Text Size</Text>
//             </View>
//             <View>
//               <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
//             </View>
//           </TouchableOpacity>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <FontAwesome name="moon-o" style={style.settingIcon} />
//               <Text style={style.commonText}>Dark Theme</Text>
//             </View>
//             <View>
//               <Switch
//                 value={isDark}
//                 onChange={() => setIsDark(prev => !prev)}
//               />
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Accessibility and Media Section  */}
//         <Text style={style.upperText}>Accessibility and Media</Text>
//         <View style={style.commonBackground}>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <Icon name="download" style={style.settingIcon} />
//               <Text style={style.commonText}>Download Setting</Text>
//             </View>
//             <View>
//               <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
//             </View>
//           </TouchableOpacity>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <Feather name="users" style={style.settingIcon} />
//               <Text style={style.commonText}>Accessibility</Text>
//             </View>
//             <View>
//               <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
//             </View>
//           </TouchableOpacity>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <Ionicons name="language" style={style.settingIcon} />
//               <Text style={style.commonText}>Language</Text>
//             </View>
//             <View>
//               <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
//             </View>
//           </TouchableOpacity>
//         </View>
//         <Text style={style.upperText}>More info</Text>
//         <View style={style.commonBackground}>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <Ionicons name="help-buoy-sharp" style={style.settingIcon} />
//               <Text style={style.commonText}>Help</Text>
//             </View>
//             <View>
//               <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
//             </View>
//           </TouchableOpacity>
//           <TouchableOpacity style={style.commonTouch}>
//             <View style={style.settingLeft}>
//               <Icon name="infocirlceo" style={style.settingIcon} />
//               <Text style={style.commonText}>About</Text>
//             </View>
//             <View>
//               <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
//             </View>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity style={style.logoutBox} onPress={logoutButton}>
//           <View style={style.logout}>
//             <Icon name="infocirlceo" style={style.settingIcon} />
//             <Text style={style.logoutText}>Logout</Text>
//           </View>
//         </TouchableOpacity>
//       </>
//     );
//   };

//   return <FlatList renderItem={<RenderItem />} />;
// };

// export default Index;

// const styles = StyleSheet.create({
//   searchInput: {
//     width: '90%',
//     paddingBottom: 2,
//     color: '#000',
//     paddingTop: 2,
//   },
// });
import {
  FlatList,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
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

const Index = () => {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);

  const {isDark, setIsDark, setLoading, userData} = appContext;

  const style = isDark ? DarkTheme : LighTheme;

  const logoutButton = async () => {
    try {
      await storage.setBoolAsync('isLoggedIn', false);
      await storage.removeItem('token');
      setLoading(false);
      navigation.navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const RenderItem = () => {
    return (
      <View style={style.settingScreen}>
        <View style={style.commonBackground}>
          <View style={style.commonTouchInput}>
            <Icon name="search1" style={style.settingIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor={color.black}
            />
          </View>
        </View>
        <Text style={style.upperText}>Account</Text>
        <View style={style.commonBackground}>
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Icon name="adduser" style={style.settingIcon} />
              <View style={style.userinfo}>
                <Text style={style.commonText}>
                  {userData && userData.first_name}
                </Text>
                <Text style={style.email}>
                  {' '}
                  {userData && userData.username}
                </Text>
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
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Icon name="bells" style={style.settingIcon} />
              <Text style={style.commonText}>Notification</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <TextIcon name="format-text" style={style.settingIcon} />
              <Text style={style.commonText}>Text Size</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <FontAwesome name="moon-o" style={style.settingIcon} />
              <Text style={style.commonText}>Dark Theme</Text>
            </View>
            <View>
              <Switch
                value={isDark}
                onChange={() => setIsDark(prev => !prev)}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Accessibility and Media Section  */}
        <Text style={style.upperText}>Accessibility and Media</Text>
        <View style={style.commonBackground}>
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
        </View>
        <Text style={style.upperText}>More info</Text>
        <View style={style.commonBackground}>
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Ionicons name="help-buoy-sharp" style={style.settingIcon} />
              <Text style={style.commonText}>Help</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={style.commonTouch}>
            <View style={style.settingLeft}>
              <Icon name="infocirlceo" style={style.settingIcon} />
              <Text style={style.commonText}>About</Text>
            </View>
            <View>
              <ArrowIcon name="chevron-thin-right" style={style.settingIcon} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={style.logoutBox} onPress={logoutButton}>
          <View style={style.logout}>
            <Icon name="infocirlceo" style={style.settingIcon} />
            <Text style={style.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={[{key: 'renderItem'}]} // Single dummy item to trigger RenderItem
      renderItem={RenderItem}
      keyExtractor={item => item.key}
    />
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
