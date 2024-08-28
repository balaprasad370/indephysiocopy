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
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Cross from 'react-native-vector-icons/Entypo';
// import user from '../../Constants';
import CourseCard from '../../Components/CourseCard/Index';
import Menu from '../../Components/Menu/Index';
import Tasks from '../../Components/Tasks/Index';
import DocumentCard from '../../Components/DocumentCard/Index';
import ProfileLevel from '../../Components/ProfileLevel/index';
import {AppContext} from '../../theme/AppContext';

import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';

import styles from './dashboardCss';
import {ROUTES} from '../../Constants/routes';

import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';

const storage = new MMKVLoader().initialize();
const Index = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const {isDark, setIsDark, userData} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  let locked = true;

  const courseData = [
    {
      locked: false,
      courseTitle: 'Registered',
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

  const renderItem = ({item}) => {
    return (
      <>
        <View style={style.uppDash}>
          <View style={styles.textstyle}>
            <Text style={style.textWel}>Welcome back</Text>
            <Text style={style.candName}>
              {userData
                ? `${userData?.first_name} ${userData?.last_name} `
                : null}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon name="crown-outline" style={style.crown} size={22} />
              <Text style={style.registered}>Registered</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.PROFILE_SETTING)}
            style={{paddingRight: '3%'}}>
            <Image
              source={require('../../Constants/person.jpg')}
              style={{width: 55, height: 55, borderRadius: 50}}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={courseData}
          horizontal
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
            iconName="book-open-blank-variant"
            isLocked={true}
            ROUTE="Self learn"
          />
          <Menu
            name="Mock test"
            iconName="check-circle-outline"
            isLocked={false}
          />
          <Menu
            name="Live class"
            iconName="monitor-screenshot"
            isLocked={true}
            ROUTE="Live"
          />
          <Menu name="Docs" iconName="folder-open" isLocked={false} />
          <Menu name="Scorecard" iconName="scoreboard" isLocked={false} />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={toggleModal}>
          <ScrollView style={style.modalDocument}>
            <View style={style.modalContent}>
              <TouchableOpacity
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
        <View style={{marginBottom: '20%'}}>
          <ProfileLevel />
        </View>
      </>
    );
  };

  return (
    <FlatList
      data={[{key: 'renderItem'}]}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      style={style.dashBoard}
    />
  );
};

export default Index;
