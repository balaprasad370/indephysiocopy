import {
  Image,
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
    <View style={{flex: 1, backgroundColor: color.white}}>
      <CalendarComponent />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});

{
  /* <ScrollView style={style.livClass}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          // marginTop: 10,
        }}>
        <View style={style.liveClassChapter}>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              position: 'absolute',
              top: '50%',
              height: 110,
              left: '45%',
              transform: [{translateX: -65}, {translateY: -60}],
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 20,
              padding: 10,
            }}>
            <GlssIcon name="lock" style={{fontSize: 30, color: 'white'}} />
            <Text style={style.chapterText}>Apply to reattend</Text>
            <GlssIcon name="lock" style={{fontSize: 20, marginTop: 10}} />
          </View>

          <Image
            source={require('../../Constants/family.jpg')}
            style={{
              width: 100,
              height: 80,
              opacity: 0.2,
              borderRadius: 10,
              backgroundColor: 'transparent',
            }}
          />
        </View>
        <View style={style.chapterUnlock}>
          <Image
            source={require('../../Constants/family.jpg')}
            style={{
              width: 100,
              height: 100,
              marginTop: 12,
              backgroundColor: 'transparent',
              borderRadius: 10,
            }}
          />
          <Text style={style.chaptersList}>Chapter 2</Text>
          <Text style={{fontSize: 15, fontWeight: '600', color: 'white'}}>
            Frueande kollegen..
          </Text>
        </View>
      </View>
      <View style={{marginTop: 20, marginBottom: 20}}>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 22,
            color: 'grey',
            marginRight: '16%',
          }}>
          Sort by
        </Text>
        <Text style={style.chapterHeader}>Chapter 2: Topic of the chapter</Text>
        <View
          style={{
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Chapter
            name="Das bier"
            title="Der, Die, Das"
            isLocked={(isLocked = false)}
          />
          <Chapter title="Der, Die, Das" isLocked={(isLocked = true)} />
          <Chapter title="Der, Die, Das" isLocked={(isLocked = true)} />
          <Chapter title="Der, Die, Das" isLocked={(isLocked = true)} />
          <Chapter title="Der, Die, Das" isLocked={(isLocked = true)} />
          <Chapter title="Der, Die, Das" isLocked={(isLocked = true)} />
        </View>
      </View>
    </ScrollView> */
}
