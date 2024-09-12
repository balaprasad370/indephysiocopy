import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Plane from 'react-native-vector-icons/Fontisto';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import {AppContext} from '../../theme/AppContext';
import axios from 'axios';
import storage from '../../Constants/storage';
import scale from '../../utils/utils';
import color from '../../Constants/color';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import planeImage from '../../assets/plane.png';
import planeImage2 from '../../assets/planewhite.png';

const Index = () => {
  const {path, isDark, userData, profileStatus, setProfileStatus} =
    useContext(AppContext);

  const navigation = useNavigation();

  // Example Profile Status Data
  const profileStatusData = [
    {label: 'A1 German level', key: 'candidate_a1_status'},
    {label: 'A2 German level', key: 'candidate_a2_status'},
    {label: 'B1 German level', key: 'candidate_b1_status'},
    {label: 'B2 German level', key: 'candidate_b2_status'},
    {label: 'Application Status', key: 'candidate_application_status'},
    {label: 'Contract Status', key: 'candidate_contract_status'},
    {label: 'Document Status', key: 'candidate_document_status'},
    {label: 'Evaluation Status', key: 'candidate_evaluation_status'},
    {label: 'Interview Status', key: 'candidate_interview_status'},
    {label: 'Recognition Status', key: 'candidate_recognition_status'},
    {label: 'Relocation Status', key: 'candidate_relocation_status'},
    {label: 'Translation Status', key: 'candidate_translation_status'},
    {label: 'Visa Status', key: 'candidate_visa_status'},
  ];

  // Sorting the profileStatusData based on completion status
  const sortedProfileStatusData = [...profileStatusData].sort((a, b) => {
    const statusA = profileStatus[a.key];
    const statusB = profileStatus[b.key];

    // If both are complete, maintain order
    if (statusA === 1 && statusB === 1) return 0;

    // Completed first, then incomplete
    if (statusA === 1) return -1;
    if (statusB === 1) return 1;

    // Both are incomplete, maintain order
    return 0;
  });

  const lastCompletedIndex =
    sortedProfileStatusData.findIndex(item => profileStatus[item.key] === 0) -
    1;

  const style = isDark ? DarkTheme : LighTheme;

  const dots = Array.from({length: 19});
  const deviceWidth = Dimensions.get('window').width;
  const dotSize = 4;
  const dotSpacing = 7;
  const dotsCount = Math.floor((deviceWidth * 0.5) / (dotSize + dotSpacing));

  useEffect(() => {
    const fetchProfileStatus = async () => {
      const token = await storage.getStringAsync('token');

      if (token) {
        try {
          const response = await axios.post(
            `${path}/profile/status`,
            {
              student_id: userData?.student_id,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
              },
            },
          );
          setProfileStatus(response.data);
        } catch (error) {
          console.log(error?.response?.status);
        }
      }
    };

    // Fetch data initially
    fetchProfileStatus();

    // Set up polling interval
    const intervalId = setInterval(fetchProfileStatus, 5000); // Poll every 5 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [userData]); // Re-run if userData changes

  const ProfileComponent = ({item}) => {
    return (
      <>
        {sortedProfileStatusData.map((status, index) => {
          const isCompleted = profileStatus[status.key] === 1;
          return (
            <View style={styles.dotContainer} key={index}>
              {index % 2 === 0 ? (
                <View style={styles.leftBox}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <Icon
                      name="location-pin"
                      style={
                        isCompleted ? style.markComplete : style.markNotComplete
                      }
                    />
                    <Text style={style.levelName}>{status.label}</Text>
                  </View>
                  <View style={styles.leftContainer}>
                    {Array.from({length: dotsCount}).map((_, index) => (
                      <View
                        key={index}
                        style={isCompleted ? style.darkDot : style.dot}></View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.rightBox}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-end',
                    }}>
                    <Text style={style.levelName}>{status.label}</Text>
                    <Icon
                      name="location-pin"
                      style={
                        isCompleted ? style.markComplete : style.markNotComplete
                      }
                    />
                  </View>
                  <View style={styles.rightContainer}>
                    {Array.from({length: dotsCount}).map((_, index) => (
                      <View
                        key={index}
                        style={isCompleted ? style.darkDot : style.dot}></View>
                    ))}
                  </View>
                </View>
              )}

              <View
                style={{
                  position: 'absolute',
                  left: '49%',
                  top: scale(12),
                }}>
                {Array.from({length: dotsCount}).map((_, index) => (
                  <View
                    key={index}
                    style={isCompleted ? style.darkDot : style.dot}></View>
                ))}
              </View>

              {index === 0 && lastCompletedIndex === -1 ? (
                <View
                  style={{
                    position: 'absolute',
                    // left: scale(142),
                    left: '43.5%',
                    top: scale(10),
                  }}>
                  {/* <Plane name="plane" style={style.plane} /> */}

                  {isDark ? (
                    <Image source={planeImage2} style={style.planeDark} />
                  ) : (
                    <Image source={planeImage} style={style.plane} />
                  )}
                </View>
              ) : index === lastCompletedIndex ? (
                <View
                  style={{
                    position: 'absolute',
                    // left: scale(142),
                    left: '43.5%',
                    top: scale(40),
                  }}>
                  {/* <Plane name="plane" style={style.plane} /> */}
                  {isDark ? (
                    <Image source={planeImage2} style={style.planeDark} />
                  ) : (
                    <Image source={planeImage} style={style.plane} />
                  )}
                </View>
              ) : null}
            </View>
          );
        })}
      </>
    );
  };
  // Looks good, try adding colours to the location icons and for each name like A1 German level etc
  return (
    <FlatList
      data={[{key: 'renderItem'}]}
      renderItem={ProfileComponent}
      keyExtractor={item => item.key}
      style={{padding: scale(4)}}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  dotContainer: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 20,
  },
  leftBox: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: scale(18),
    justifyContent: 'flex-start',
    width: '100%',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightBox: {
    flex: 1,
    paddingTop: scale(18),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
