import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Plane from 'react-native-vector-icons/Fontisto';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import {AppContext} from '../../theme/AppContext';

const index = () => {
  const profileStatus = [
    {level: 1, completed: true, levelName: 'A1 German level'},
    {level: 2, completed: true, levelName: 'A2 German level'},
    {level: 3, completed: true, levelName: 'B1 German level'},
    {level: 4, completed: true, levelName: 'B2 German level'},
    {level: 5, completed: true, levelName: 'Interview Process'},
    {level: 6, completed: false, levelName: 'Contact Finalization'},
    {level: 7, completed: false, levelName: 'Relocation Process'},
  ];

  const lastCompletedIndex = profileStatus.reduce(
    (lastIndex, currentItem, currentIndex) => {
      return currentItem.completed ? currentIndex : lastIndex;
    },
    -1,
  );

  const appContext = useContext(AppContext);

  const {isDark, setIsDark} = appContext;

  const style = isDark ? DarkTheme : LighTheme;

  const dots = Array.from({length: 19});
  return (
    <View>
      {profileStatus.map((data, index) => (
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
                    data.completed ? style.markComplete : style.markNotComplete
                  }
                />
                <Text style={style.levelName}>{data.levelName}</Text>
              </View>
              <View style={styles.leftContainer}>
                {dots.map((_, index) => (
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
                    data.completed ? style.markComplete : style.markNotComplete
                  }
                />
              </View>
              <View style={styles.rightContainer}>
                {dots.map((_, index) => (
                  <View
                    key={index}
                    style={data.completed ? style.darkDot : style.dot}></View>
                ))}
              </View>
            </View>
          )}

          <View style={{position: 'absolute', left: '49%', top: 10}}>
            {dots.map((_, index) => (
              <View
                key={index + 20}
                style={data.completed ? style.darkDot : style.dot}></View>
            ))}
          </View>
          {index === lastCompletedIndex ? (
            <View style={{position: 'absolute', left: '45%', top: 30}}>
              <Plane name="plane" style={style.plane} />
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  dotContainer: {
    position: 'relative',
    flexDirection: 'row',
    width: '100%',
  },
  leftBox: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightBox: {
    flex: 1,
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
