import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import dashboardCss from './dashboardCss';
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

  const appContext = useContext(AppContext);

  const {isDark, setIsDark} = appContext;

  const style = isDark ? DarkTheme : LighTheme;

  let locked = true;

  return (
    <ScrollView style={style.dashBoard}>
      <View style={style.uppDash}>
        <View style={dashboardCss.textstyle}>
          <Text style={style.textWel}>Welcome back</Text>
          <Text style={style.candName}>Candidate Name</Text>
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
            style={{width: 60, height: 60, borderRadius: 50}}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal={true}
        style={{
          marginTop: 20,
        }}>
        <CourseCard
          locked={(locked = false)}
          toggleModal={toggleModal}
          middleCourseCard="Approx D.O.R"
          bottomCourseCard="000€"
        />
        <CourseCard
          locked={(locked = false)}
          middleCourseCard="My Euro Bank"
          bottomCourseCard="116🏚️"
        />
        <CourseCard
          locked={(locked = true)}
          middleCourseCard="Anywhere in Germany"
          bottomCourseCard="Book Now"
        />
        <CourseCard
          locked={(locked = false)}
          middleCourseCard="Dynamic date"
          bottomCourseCard="33 days"
        />
      </ScrollView>
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
        />
        <Menu
          name="Mock test"
          iconName="check-circle-outline"
          isLocked={false}
        />
        <Menu
          name="Live class"
          iconName="monitor-screenshot"
          isLocked={false}
        />
        <Menu name="Docs" iconName="folder-open" isLocked={true} />
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
      <View>
        <ProfileLevel />
      </View>
    </ScrollView>
  );
};

export default Index;
