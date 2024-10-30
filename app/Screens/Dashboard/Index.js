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
import LastComponent from './LastComponent';
import CurrentStatusComponent from './CurrentStatusComponent';
import Notfications from '../Notifications/Index';

import Information from '../../Components/Information/Index';
import Optional from '../../Components/Information/Optional';

const storage = new MMKVLoader().initialize();
const Index = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [informationData, setInformationData] = useState();

  const [optionalData, setOptionalData] = useState();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const getInformation = async () => {
    const token = await storage.getStringAsync('token');

    if (token) {
      try {
        const response = await axios.get(`${path}/admin/v1/information`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const informationData = response.data.data;

        const optionalData = informationData.filter(
          item => item.type === 'optional',
        );
        const strictData = informationData.filter(
          item => item.type === 'strict',
        );

        // Set the filtered data to state
        setOptionalData(optionalData);
        setInformationData(strictData);
      } catch (error) {
        console.log('error occurred from getInformation:', error);
      }
    }
  };

  const getWebinar = async () => {
    const token = await storage.getStringAsync('token');

    if (token) {
      try {
        const response = await axios.get(`${path}/admin/v1/webinar`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('helo', response.data);
        const webinarData = response.data.data;
        setWebinar(webinarData);
        if (webinarData.modal_status === 1) {
          setAdVisible(true);
        }
      } catch (error) {
        setWebinar('');
        console.log('error occurred from getInformation:', error);
      }
    }
  };

  const {
    isDark,
    setIsDark,
    userData,
    documentStatus,
    path,
    setDocumentStatus,
    packageId,
    clientId,
    levelId,
  } = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;
  // const [optionalToggle, setOptional] = useState(true);

  let locked = true;

  const [isAdVisible, setAdVisible] = useState(false);

  const toggleAd = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.post(
        `${path}/admin/v1/update-modal-status`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Webinar status is updated', response.data);
      setAdVisible(!isAdVisible);
    } catch (error) {
      console.log('Error updating the status of the webinar', error);
    }
  };

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
  const [webinar, setWebinar] = useState('');

  const getChapterStatus = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const res = await axios({
        method: 'get',
        url: `${path}/chapter/v5/student/status`,
        params: {
          level_id: levelId,
          client_id: clientId,
          package_id: packageId,
        },
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
      getInformation();
      getWebinar();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}) => {
    return (
      <SafeAreaView>
        <View style={style.uppDash}>
          <View style={styles.textstyle}>
            <Text style={style.textWel}>Welcome back</Text>
            <Text style={[style.candName, {textTransform: 'capitalize'}]}>
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
            onPress={() => navigation.openDrawer()}
            // onPress={() => navigation.navigate(ROUTES.PROFILE_SETTING)}
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
        {/* <Notfications /> */}
        {webinar && (
          <Information webinar={webinar} setAdVisible={setAdVisible} />
        )}
        <Optional optionalData={optionalData} />
        {data && data.chapter_id !== null && (
          <CurrentStatusComponent data={data} />
        )}
        {/* <LastComponent /> */}
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
            <Text
              style={{fontSize: scale(14), color: 'black', fontWeight: 'bold'}}>
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
              <Text
                style={{
                  fontSize: scale(11),
                  color: 'white',
                  textAlign: 'center',
                }}>
                Check Regular Pathway
              </Text>
            </TouchableOpacity>
          </View>

          <ProfileLevel />
        </View>
        {webinar && isAdVisible ? (
          <Modal
            transparent={true}
            visible={isAdVisible}
            animationType="fade"
            onRequestClose={toggleAd}>
            <View style={styled.adOverlay}>
              <TouchableOpacity style={styled.closeButton} onPress={toggleAd}>
                <Text style={styled.closeButtonText}>X</Text>
              </TouchableOpacity>
              <View style={styled.adContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Meeting', {
                      room: webinar.webinar_url,
                      // room: 'ic2wYAPi7sqlUZKi',
                    });
                    setAdVisible(false);
                  }}>
                  <Image
                    source={{uri: webinar.webinar_image_url}} // Use webinar_image_url dynamically
                    style={styled.adImage}
                  />
                </TouchableOpacity>
                {/* <Text style={styled.closeButtonText}>{webinar.title}</Text> */}
                {/* <Text>{webinar.description}</Text> */}
              </View>
            </View>
          </Modal>
        ) : null}
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

const styled = StyleSheet.create({
  adOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContainer: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden', // Ensures rounded corners
  },
  adImage: {
    width: '100%',
    // width: 200,
    // height: 200,
    height: '100%',
    // resizeMode: 'cover',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Index;
