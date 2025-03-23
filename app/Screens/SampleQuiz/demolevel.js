import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {useCallback, useState, useMemo} from 'react';
import {Svg, Path} from 'react-native-svg';
import LottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');

// Make item size responsive to screen dimensions
const ITEM_SIZE = Math.min(width * 0.2, 120); // Cap at 120px for larger screens
const SPACING = Math.min(height * 0.05, 40); // Cap at 40px for larger screens

const Demolevel = () => {
  const levels = useMemo(
    () => [
      {
        id: 1,
        status: true,
        backgroundColor: '#4CD964', // Green
        label: 'A1 German',
        position: 'center',
        lottie: 'https://assets1.lottiefiles.com/packages/lf20_jhlaooji.json', // Language learning
        hereAnimation:
          'https://assets5.lottiefiles.com/packages/lf20_8wuout7s.json', // Human pointing animation
        hereLabel: 'Starting Point',
      },
      {
        id: 2,
        status: true,
        backgroundColor: '#5AC8FA', // Blue
        label: 'A2 German',
        position: 'center-left',
        lottie: 'https://assets5.lottiefiles.com/packages/lf20_bhebjzpu.json', // Book reading
        hereAnimation:
          'https://lottie.host/d56cea89-c332-4404-989f-0ec9ea5d44e9/xEl9gAjJsn.lottie', // Student animation
        hereLabel: 'We are here',
      },
      {
        id: 3,
        status: false,
        backgroundColor: '#FF9500', // Orange
        label: 'B1 German',
        position: 'center',
        lottie: 'https://assets2.lottiefiles.com/packages/lf20_ksrabfvd.json', // Graduation
        hereAnimation:
          'https://assets5.lottiefiles.com/packages/lf20_ue1f9kdo.json', // Learning animation
        hereLabel: 'Next Goal',
      },
      {
        id: 4,
        status: false,
        backgroundColor: '#FF2D55', // Red
        label: 'B2 German',
        position: 'center-right',
        lottie: 'https://assets7.lottiefiles.com/packages/lf20_qp1q7mct.json', // Certificate
        hereAnimation:
          'https://assets9.lottiefiles.com/packages/lf20_xyadlcge.json', // Achievement animation
        hereLabel: 'Advanced Level',
      },
      {
        id: 5,
        status: false,
        backgroundColor: '#007AFF', // Blue
        label: 'Application Status',
        position: 'center',
        lottie: 'https://assets3.lottiefiles.com/packages/lf20_4kx2q32n.json', // Document
        hereAnimation:
          'https://assets1.lottiefiles.com/private_files/lf30_fup2uejx.json', // Form filling animation
        hereLabel: 'Application Phase',
      },
      {
        id: 6,
        status: false,
        backgroundColor: '#5856D6', // Purple
        label: 'Contract Status',
        position: 'center-left',
        lottie: 'https://assets10.lottiefiles.com/packages/lf20_ksf0xgae.json', // Contract signing
        hereAnimation:
          'https://assets8.lottiefiles.com/packages/lf20_jcikwtux.json', // Handshake animation
        hereLabel: 'Contract Phase',
      },
      {
        id: 7,
        status: false,
        backgroundColor: '#FF3B30', // Red
        label: 'Document Status',
        position: 'center',
        lottie: 'https://assets6.lottiefiles.com/packages/lf20_ukjcyybw.json', // Document folder
        hereAnimation:
          'https://assets7.lottiefiles.com/packages/lf20_kcsr6fcp.json', // Document checking
        hereLabel: 'Document Review',
      },
      {
        id: 8,
        status: false,
        backgroundColor: '#34C759', // Green
        label: 'Evaluation Status',
        position: 'center-right',
        lottie: 'https://assets8.lottiefiles.com/packages/lf20_jqfghjkp.json', // Checklist
        hereAnimation:
          'https://assets4.lottiefiles.com/packages/lf20_bkvlqhgv.json', // Evaluation animation
        hereLabel: 'Evaluation Phase',
      },
      {
        id: 9,
        status: false,
        backgroundColor: '#AF52DE', // Purple
        label: 'Interview Status',
        position: 'center',
        lottie: 'https://assets9.lottiefiles.com/packages/lf20_kqfglbhf.json', // Interview
        hereAnimation:
          'https://assets6.lottiefiles.com/packages/lf20_yfpjwsmj.json', // Interview animation
        hereLabel: 'Interview Phase',
      },
      {
        id: 10,
        status: false,
        backgroundColor: '#FF9500', // Orange
        label: 'Recognition Status',
        position: 'center-left',
        lottie: 'https://assets1.lottiefiles.com/packages/lf20_rc5d0f61.json', // Trophy
        hereAnimation:
          'https://assets2.lottiefiles.com/packages/lf20_iplkobrl.json', // Award animation
        hereLabel: 'Recognition Phase',
      },
      {
        id: 11,
        status: false,
        backgroundColor: '#00C7BE', // Teal
        label: 'Relocation Status',
        position: 'center',
        lottie: 'https://assets2.lottiefiles.com/packages/lf20_5n8yfkac.json', // Moving
        hereAnimation:
          'https://assets3.lottiefiles.com/packages/lf20_mdbdc5j7.json', // Moving animation
        hereLabel: 'Relocation Phase',
      },
      {
        id: 12,
        status: false,
        backgroundColor: '#FF2D55', // Pink
        label: 'Translation Status',
        position: 'center-right',
        lottie: 'https://assets3.lottiefiles.com/packages/lf20_9e8yoqkm.json', // Translation
        hereAnimation:
          'https://assets5.lottiefiles.com/packages/lf20_ue1f9kdo.json', // Translation animation
        hereLabel: 'Translation Phase',
      },
      {
        id: 13,
        status: false,
        backgroundColor: '#007AFF', // Blue
        label: 'Visa Status',
        position: 'center',
        lottie: 'https://assets4.lottiefiles.com/packages/lf20_5tl1xxnz.json', // Passport
        hereAnimation:
          'https://assets9.lottiefiles.com/private_files/lf30_kqshlwng.json', // Visa animation
        hereLabel: 'Visa Process',
      },
    ],
    [],
  );

  const getItemStyle = useCallback(
    index => {
      return useAnimatedStyle(() => {
        const position = levels[index].position;
        let translateX = 0;

        if (position === 'center-left') {
          translateX = -width * 0.25;
        } else if (position === 'center-right') {
          translateX = width * 0.25;
        }

        const isActive = levels[index].status === true;

        return {
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          borderRadius: ITEM_SIZE / 2,
          backgroundColor: isActive
            ? levels[index].backgroundColor
            : 'transparent',
          borderWidth: isActive ? 0 : 2,
          borderColor: isActive ? 'transparent' : levels[index].backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [
            {
              scale: withSpring(isActive ? 1.1 : 1),
            },
            {
              translateX: withSpring(translateX),
            },
          ],
        };
      }, [
        levels[index].status,
        levels[index].position,
        levels[index].backgroundColor,
      ]);
    },
    [levels],
  );

  const getLabelStyle = useCallback(
    index => {
      return useAnimatedStyle(() => {
        const position = levels[index].position;
        let translateX = 0;

        if (position === 'center-left') {
          translateX = -width * 0.27;
        } else if (position === 'center-right') {
          translateX = width * 0.25;
        }

        return {
          marginTop: 8,
          transform: [
            {
              translateX: withSpring(translateX),
            },
          ],
        };
      }, [levels[index].position]);
    },
    [levels],
  );

  // Find the last active level
  const lastActiveLevelIndex = useMemo(() => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (levels[i].status === true) {
        return i;
      }
    }
    return -1;
  }, [levels]);

  const renderLevelItem = useCallback(
    ({level, index}) => (
      <View key={level.id} style={{marginBottom: SPACING}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Animated.View
            style={[
              getItemStyle(index),
              {
                zIndex: 1,
              },
            ]}>
            <LottieView
              source={{
                uri: level.lottie,
              }}
              autoPlay
              loop
              style={{width: ITEM_SIZE * 0.8, height: ITEM_SIZE * 0.8}}
            />
          </Animated.View>

          {/* Custom "We are here" animation only for the last active level */}
          {level.status && index === lastActiveLevelIndex && (
            <View
              style={{
                position: 'absolute',
                left:
                  level.position === 'center'
                    ? ITEM_SIZE + 20
                    : level.position === 'center-left'
                    ? width * 0.01
                    : level.position === 'center-right'
                    ? -width * 0.25
                    : ITEM_SIZE + 20,
              }}>
              <LottieView
                source={{
                  uri: level.hereAnimation,
                }}
                autoPlay
                loop
                style={{width: ITEM_SIZE * 0.9, height: ITEM_SIZE * 0.9}}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: level.backgroundColor,
                  textAlign: 'center',
                  marginTop: 5,
                }}>
                {level.hereLabel}
              </Text>
            </View>
          )}
        </View>
        <Animated.Text
          style={[
            {
              fontSize: 12,
              fontWeight: '600',
              color: level.status ? level.backgroundColor : '#666',
              textAlign: 'center',
              width: ITEM_SIZE,
            },
            getLabelStyle(index),
          ]}>
          {level.label}
        </Animated.Text>
      </View>
    ),
    [getItemStyle, getLabelStyle, lastActiveLevelIndex],
  );

  return (
    <View style={{flex: 1}}>
      {/* <View style={{position: 'absolute', width: '100%', height: '100%', zIndex: -1}}>
        <LottieView
          source={{
            uri: 'https://lottie.host/8c5b5a42-228d-40a1-be1f-88e586dd4c98/sB2gF4vRJk.json',
          }}
          autoPlay
          loop
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
          imageStyle={{opacity: 0.8}}
        />
      </View> */}

      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: height * 0.1,
          paddingBottom: height * 0.1,
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {levels.map((level, index) => renderLevelItem({level, index}))}
      </ScrollView>
    </View>
  );
};

export default Demolevel;
