import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Plane from 'react-native-vector-icons/Fontisto';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import {AppContext} from '../../theme/AppContext';
import axios from 'axios';

const index = () => {
  const [profileStatus, setProfileStatus] = useState([]);

  const getProfileStatus = async () => {
    try {
      const response = await axios.post(
        'http://192.168.1.5:4000/profile/status',
        {
          student_id: '2',
        },
      );

      setProfileStatus(response.data);
    } catch (error) {
      console.log(error?.response?.status);
    }
  };

  const profileStatusData = [
    {
      label: 'A1 Status',
      key: 'candidate_a1_status',
    },
    {
      label: 'A2 Status',
      key: 'candidate_a2_status',
    },

    {
      label: 'B1 Status',
      key: 'candidate_b1_status',
    },
    {
      label: 'B2 Status',
      key: 'candidate_b2_status',
    },
    {
      label: 'Application Status',
      key: 'candidate_application_status',
    },
    {
      label: 'Contract Status',
      key: 'candidate_contract_status',
    },
    {
      label: 'Document Status',
      key: 'candidate_document_status',
    },
    {
      label: 'Evaluation Status',
      key: 'candidate_evaluation_status',
    },
    {
      label: 'Interview Status',
      key: 'candidate_interview_status',
    },
    {
      label: 'Recognition Status',
      key: 'candidate_recognition_status',
    },
    {
      label: 'Relocation Status',
      key: 'candidate_relocation_status',
    },
    {
      label: 'Translation Status',
      key: 'candidate_translation_status',
    },
    {
      label: 'Visa Status',
      key: 'candidate_visa_status',
    },
  ];

  // Assume response.data is stored in profileStatus
  // const profile = profileStatus[0];

  const lastCompletedIndex =
    profileStatusData.findIndex(item => profileStatus[item.key] === 0) - 1;

  useEffect(() => {
    getProfileStatus();
  }, []);

  const appContext = useContext(AppContext);

  const {isDark, setIsDark} = appContext;

  const style = isDark ? DarkTheme : LighTheme;

  const dots = Array.from({length: 19});

  const deviceWidth = Dimensions.get('window').width;
  const dotSize = 4; // Adjust this size as needed
  const dotSpacing = 7; // Adjust this spacing as needed
  const dotsCount = Math.floor((deviceWidth * 0.5) / (dotSize + dotSpacing)); // 50% of device width

  const ProfileComponent = ({item}) => {
    return (
      <>
        {/* {profileStatus.map((data, index) => (
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
                      data.completed
                        ? style.markComplete
                        : style.markNotComplete
                    }
                  />
                  <Text style={style.levelName}>{data.levelName}</Text>
                </View>
                <View style={styles.leftContainer}>
                  {Array.from({length: dotsCount}).map((_, index) => (
                    <View
                      key={index}
                      style={data.completed ? style.darkDot : style.dot}></View>
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
                  <Text style={style.levelName}>{data.levelName}</Text>
                  <Icon
                    name="location-pin"
                    style={
                      data.completed
                        ? style.markComplete
                        : style.markNotComplete
                    }
                  />
                </View>
                <View style={styles.rightContainer}>
                  {Array.from({length: dotsCount}).map((_, index) => (
                    <View
                      key={index}
                      style={data.completed ? style.darkDot : style.dot}></View>
                  ))}
                </View>
              </View>
            )}

            <View
              style={{
                position: 'absolute',
                left: '49%',
                top: 12,
              }}>
              {Array.from({length: dotsCount}).map((_, index) => (
                <View
                  key={index}
                  style={data.completed ? style.darkDot : style.dot}></View>
              ))}
            </View>
            {index === lastCompletedIndex ? (
              <View style={{position: 'absolute', left: '45%', top: 55}}>
                <Plane name="plane" style={style.plane} />
              </View>
            ) : null}
          </View>
        ))} */}
        {profileStatusData.map((status, index) => {
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
                  top: 12,
                }}>
                {Array.from({length: dotsCount}).map((_, index) => (
                  <View
                    key={index}
                    style={isCompleted ? style.darkDot : style.dot}></View>
                ))}
              </View>

              {index === lastCompletedIndex ? (
                <View style={{position: 'absolute', left: '45%', top: 55}}>
                  <Plane name="plane" style={style.plane} />
                </View>
              ) : null}
            </View>
          );
        })}
      </>
    );
  };

  return (
    // <View>
    <FlatList
      data={[{key: 'renderItem'}]}
      renderItem={ProfileComponent}
      keyExtractor={item => item.key}
    />
    // </View>
  );
};

export default index;

const styles = StyleSheet.create({
  dotContainer: {
    position: 'relative',
    flexDirection: 'row',
    // paddingBottom: 30,
    width: '100%',
  },
  leftBox: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 20,
    justifyContent: 'flex-start',
    width: '100%',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightBox: {
    flex: 1,
    paddingTop: 20,
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
