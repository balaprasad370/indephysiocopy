import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Switch,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Cross from 'react-native-vector-icons/Entypo';
import UserIcon from 'react-native-vector-icons/FontAwesome';
import BookIcon from 'react-native-vector-icons/Foundation';
// import user from '../../Constants';
import CourseCard from '../../Components/CourseCard/Index';
import Menu from '../../Components/Menu/Index';
import Tasks from '../../Components/Tasks/Index';
import DocumentCard from '../../Components/DocumentCard/Index';
import ProfileLevel from '../../Components/ProfileLevel/index';
import {AppContext} from '../../theme/AppContext';
import scale from '../../utils/utils';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';

import styles from './dashboardCss';
import {ROUTES} from '../../Constants/routes';

import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';
import color from '../../Constants/color';
import registerImage from '../../assets/registeredIcon.png';
import axios from 'axios';
import iconImage from '../../assets/scorecard.png';
import lockImage from '../../assets/lock.png';
import liveclass from '../../assets/live.png';

import mock from '../../assets/mock.png';
import docs from '../../assets/doc.png';
import book from '../../assets/book.png';

const storage = new MMKVLoader().initialize();
const Index = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const {isDark, setIsDark, userData, documentStatus, path, setDocumentStatus} =
    useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  let locked = true;

  const courseData = [
    {
      locked: false,
      courseTitle: documentStatus === 2 ? 'Registered' : 'Not Registered',
      middleCourseCard: 'Approx D.O.R',
      plane: true,
      bottomCourseCard: '000€',
    },
    {
      locked: false,
      courseTitle: 'Referral Portal',
      middleCourseCard: 'My Euro Bank',
      refer: true,
      bottomCourseCard: '116🏚️',
    },
    {
      locked: true,
      courseTitle: 'Next Live Class',
      middleCourseCard: 'Anywhere in Germany',
      bottomCourseCard: 'Book Now',
    },
    {
      locked: true,
      courseTitle: 'Chapters',
      middleCourseCard: 'Dynamic date',
      bottomCourseCard: '33 days',
    },
  ];

  const [data, setData] = useState();

  const getChapterStatus = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const res = await axios({
        method: 'get',
        url: `${path}/chapter/v2/student/status`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.log('error', error.response);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getChapterStatus();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}) => {
    return (
      <SafeAreaView>
        <View style={style.uppDash}>
          <View style={styles.textstyle}>
            <Text style={style.textWel}>Welcome back</Text>
            <Text style={style.candName}>
              {userData
                ? `${userData.first_name} ${userData.last_name}`.length > 20
                  ? `${userData.first_name} ${userData.last_name}`.slice(
                      0,
                      20,
                    ) + '...'
                  : `${userData.first_name} ${userData.last_name}`
                : null}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image source={registerImage} />
              {/* <Icon name="crown-outline" style={style.crown} size={22} /> */}
              <Text style={style.registered}>
                {documentStatus && documentStatus === 2
                  ? 'Registered'
                  : 'Not Registered'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            hitSlop={{x: 25, y: 15}}
            onPress={() => navigation.navigate(ROUTES.PROFILE_SETTING)}
            style={{
              paddingRight: '3%',
            }}>
            <Image
              source={
                userData && userData?.profile_pic
                  ? {
                      uri: `https://d2c9u2e33z36pz.cloudfront.net/${userData?.profile_pic}`,
                    }
                  : {
                      uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                    }
              }
              style={{width: 55, height: 55, borderRadius: 27}}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            borderBottomEndRadius: 15,
            backgroundColor: color.lowPrimary,
            paddingBottom: 8,
            borderBottomEndRadius: 20,
            borderBottomStartRadius: 20,
          }}>
          <View
            style={{
              display: 'flex',
              borderTopEndRadius: 20,
              borderTopStartRadius: 20,
              borderBottomEndRadius: 20,
              borderBottomStartRadius: 20,
              backgroundColor: color.darkPrimary,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View style={{padding: 10}}>
              <Text style={{color: 'white', fontSize: 16}}>
                {(() => {
                  const text = 'Level :A2, Chapter: Hobby and Numbers';
                  return text.length > 20 ? text.slice(0, 32) + '...' : text;
                })()}
              </Text>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                Quiz Attempted: 2/15
              </Text>
            </View>
            <View
              style={{
                width: 2,
                backgroundColor: 'white',
                height: '100%',
              }}></View>
            <View style={{padding: 10}}>
              <BookIcon name="book-bookmark" size={40} color={color.white} />
            </View>
          </View>
        </TouchableOpacity>
        <FlatList
          data={courseData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <CourseCard
              locked={item.locked}
              courseTitle={item.courseTitle}
              toggleModal={toggleModal}
              middleCourseCard={item.middleCourseCard}
              plane={item.plane}
              refer={item.refer}
              bottomCourseCard={item.bottomCourseCard}
            />
          )}
          contentContainerStyle={{marginTop: 20}}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Menu
            name="Self Learn"
            iconImage={book}
            lock={lockImage}
            isLocked={false}
            ROUTE="Self learn"
            data={data}
          />
          <Menu
            name="Mock test"
            iconImage={mock}
            lock={lockImage}
            isLocked={true}
          />
          <Menu
            name="Live class"
            iconImage={liveclass}
            lock={lockImage}
            isLocked={false}
            ROUTE="Live"
          />
          <Menu
            name="Docs"
            iconImage={docs}
            lock={lockImage}
            isLocked={true}
            ROUTE="Documents"
          />
          <Menu
            name="Scorecard"
            iconImage={iconImage}
            lock={lockImage}
            isLocked={true}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}>
          <ScrollView style={style.modalDocument}>
            <View style={style.modalContent}>
              <TouchableOpacity
                hitSlop={{x: 25, y: 15}}
                onPress={toggleModal}
                style={{display: 'flex', alignItems: 'flex-end'}}>
                <Cross name="cross" style={style.cross} />
              </TouchableOpacity>
            </View>
            <View style={styles.documentContainer}>
              <View>
                <Text style={style.buttonTab}>Documentation</Text>
                <Text style={style.modalStatus}>Status: Not started</Text>
              </View>
              <ScrollView
                style={{marginTop: 30, marginBottom: 10}}
                horizontal={true}>
                <DocumentCard isDone={(isDone = true)} />
                <DocumentCard />
                <DocumentCard />
              </ScrollView>
              <View style={{marginTop: 30}}>
                <Tasks name="Payments and Dues" />
                <Tasks name="Agreements" />
                <Tasks name="Request for Attestation" />
                <Tasks name="Software and App terms and agreement" />
              </View>
            </View>
          </ScrollView>
        </Modal>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 17, color: 'black', fontWeight: 'bold'}}>
              Pathway: {userData?.package}
              {/* Pathway: Professionals */}
            </Text>
            <TouchableOpacity
              hitSlop={{x: 25, y: 15}}
              onPress={() => navigation.navigate(ROUTES.REGULAR)}
              style={{
                backgroundColor: color.darkPrimary,
                padding: scale(8),
                borderRadius: scale(8),
              }}>
              <Text style={{color: 'white', textAlign: 'center'}}>
                Check Regular Pathway
              </Text>
            </TouchableOpacity>
          </View>
          {/* {data ? (
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
                    parent_module_id: data.chapter_id,
                    title: 'Progress Chapter',
                  })
                }>
                <Text>Running Chapter</Text>
              </TouchableOpacity>
            </View>
          ) : null} */}
          <ProfileLevel />
        </View>
      </SafeAreaView>
    );
  };

  return (
    <FlatList
      data={[{key: 'renderItem'}]}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      style={style.dashBoard}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Index;
