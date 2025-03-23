import React, {memo, useCallback, useContext} from 'react';
import {TouchableOpacity, View, Text, Linking, Pressable} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import trackEvent from './../MixPanel/index';

const CARD_STYLES = {
  Quiz: {
    bgColor: 'bg-p1',
    borderColor: 'border-p1',
    icon: 'brain',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#2563EB',
    cta: 'Take Quiz',
  },
  'Reading Material': {
    bgColor: 'bg-purple-500',
    borderColor: 'border-purple-600',
    icon: 'book-reader',
    iconType: 'FontAwesome5',
    iconColor: '#7C3AED',
    cta: 'Start Reading',
  },
  'Flash Card': {
    bgColor: 'bg-indigo-500',
    borderColor: 'border-indigo-600',
    icon: 'cards',
    iconType: 'MaterialCommunityIcons',
    iconColor: '#4F46E5',
    cta: 'Practice Cards',
  },
  Assessments: {
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-600',
    icon: 'clipboard-list',
    iconType: 'FontAwesome5',
    iconColor: '#EA580C',
    cta: 'Start Assessment',
  },
  'Live class': {
    bgColor: 'bg-red-500',
    borderColor: 'border-red-600',
    icon: 'video',
    iconType: 'FontAwesome5',
    iconColor: '#DC2626',
  },
};

const QuizCard = memo(
  ({
    Title,
    secondOption,
    parent_module_id,
    optionClick,
    unique_id,
    status,
    video_url,
    order_id,
    locked,
    subscription_status,
    live_class_end_date,
    level_id,
    time_spent = '0 min',
  }) => {
    const navigation = useNavigation();
    const cardStyle = CARD_STYLES[optionClick] || CARD_STYLES.Quiz;

    const handleNavigation = useCallback(
      (route, params) => {
        navigation.navigate(route, params);
      },
      [navigation],
    );

    const toggleModal = useCallback(
      option => {
        const routes = {
          Quiz: () => {
            try {
              trackEvent('Quiz', {
                title: Title,
                chapter_id: parent_module_id,
              });

              handleNavigation(ROUTES.SAMPLE_QUIZ, {
                module_id: unique_id,
                title: Title,
              });
            } catch (error) {
              console.log('error', error);
            }
          },
          'Reading Material': () => {
            try {
              trackEvent('Reading Material', {
                title: Title,
                chapter_id: parent_module_id,
              });

              handleNavigation(ROUTES.READING, {
                read_id: unique_id,
                order_id,
                chapter_id: parent_module_id,
                unique_id,
              });
            } catch (error) {
              console.log('error', error);
            }
          },
          Live: () => {
            try {
              trackEvent('Live class', {
                title: Title,
                chapter_id: parent_module_id,
              });

              handleNavigation(ROUTES.RECORDING, {video_url});
            } catch (error) {
              console.log('error', error);
            }
          },
          'Flash Card': () => {
            try {
              trackEvent('Flash Card', {
                title: Title,
                chapter_id: parent_module_id,
              });

              handleNavigation(ROUTES.FLASH, {
                flash_id: unique_id,
                order_id,
                chapter_id: parent_module_id,
                unique_id,
              });
            } catch (error) {
              console.log('error', error);
            }
          },
          Assessments: () => {
            try {
              trackEvent('Assessments', {
                title: Title,
                chapter_id: parent_module_id,
              });

              handleNavigation(ROUTES.ASSESSMENTS, {
                assessment_id: unique_id,
                order_id,
                chapter_id: parent_module_id,
                unique_id,
              });
            } catch (error) {
              console.log('error', error);
            }
          },
        };

        routes[option]?.();
      },
      [
        handleNavigation,
        unique_id,
        Title,
        order_id,
        parent_module_id,
        level_id,
        video_url,
      ],
    );

    const ctaButton = item => {
      switch (optionClick) {
        case 'Reading Material':
          return (
            <Pressable
              className={`${cardStyle.bgColor} text-white px-4 py-2 rounded-md `}
              onPress={() => {
                try {
                  trackEvent('Reading Material', {
                    title: Title,
                    chapter_id: parent_module_id,
                  });
                  handleNavigation(ROUTES.READING, {
                    read_id: unique_id,
                    order_id,
                    chapter_id: parent_module_id,
                    unique_id,
                  });
                } catch (error) {
                  console.log('error', error);
                }
              }}>
              <Text className="text-xs text-white font-semibold">Read now</Text>
            </Pressable>
          );
        case 'Flash Card':
          return (
            <Pressable
              className={`${cardStyle.bgColor} text-white px-4 py-2 rounded-md`}
              onPress={() => {
                try {
                  trackEvent('Flash Card', {
                    title: Title,
                    chapter_id: parent_module_id,
                  });

                  handleNavigation(ROUTES.FLASH, {
                    flash_id: unique_id,
                    order_id,
                    chapter_id: parent_module_id,
                    unique_id,
                  });
                } catch (error) {
                  console.log('error', error);
                }
              }}>
              <Text className="text-xs text-white font-semibold">
                Practice now
              </Text>
            </Pressable>
          );

        case 'Assessments':
          return (
            <Pressable
              className={`${cardStyle.bgColor} text-white px-4 py-2 rounded-md`}
              onPress={() => {
                try {
                  trackEvent('Assessments', {
                    title: Title,
                    chapter_id: parent_module_id,
                  });
                  handleNavigation(ROUTES.ASSESSMENTS, {
                    assessment_id: unique_id,
                    order_id,
                    chapter_id: parent_module_id,
                    unique_id,
                  });
                } catch (error) {
                  console.log('error', error);
                }
              }}>
              <Text className="text-xs text-white font-semibold">
                Start Assessment
              </Text>
            </Pressable>
          );

        case 'Live class':
          if (!video_url) {
            return null;
          }

          return (
            <Pressable
              className={`${cardStyle.bgColor} text-white px-4 py-2 rounded-md`}
              onPress={() => {
                try {
                  trackEvent('Live class', {
                    title: Title,
                    chapter_id: parent_module_id,
                  });

                  handleNavigation(ROUTES.RECORDING, {video_url});
                } catch (error) {
                  console.log('error', error);
                }
              }}>
              <Text className="text-xs text-white font-semibold">
                Watch recording
              </Text>
            </Pressable>
          );

        case 'Quiz':
          return (
            <Pressable
              className={`${cardStyle.bgColor} text-white px-4 py-2 rounded-md`}
              onPress={() => {
                try {
                  handleNavigation(ROUTES.SAMPLE_QUIZ, {
                    module_id: unique_id,
                    title: Title,
                  });
                } catch (error) {
                  console.log('error', error);
                }
              }}>
              <Text className="text-xs text-white font-semibold">Attempt</Text>
            </Pressable>
          );

        default:
          return (
            <Pressable
              className={`${cardStyle.bgColor} text-white px-4 py-2 rounded-md`}
              onPress={() =>
                handleNavigation(ROUTES.SAMPLE_QUIZ, {
                  module_id: unique_id,
                  title: Title,
                })
              }>
              <Text className="text-xs text-white font-semibold">Attempt</Text>
            </Pressable>
          );
      }
    };

    const formatTime = time => {
      if (!time || isNaN(time)) return;

      console.log('time', time);

      // time seconds
      const hours = Math.floor(time / 3600) ? Math.floor(time / 3600) : 0;
      const minutes = Math.floor((time % 3600) / 60)
        ? Math.floor((time % 3600) / 60)
        : 0;
      const seconds = time % 60 ? time % 60 : 0;
      return `${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''} ${
        seconds ? seconds + 's' : ''
      }`;
    };

    return (
      <>
        <TouchableOpacity
          disabled={locked}
          className={`py-4 px-4 bg-white rounded-lg border ${
            cardStyle.borderColor
          } ${locked ? 'opacity-20' : ''} my-2`}
          onPress={
            locked
              ? () => Linking.openURL('https://portal.indephysio.com/sign-in')
              : () => toggleModal(optionClick)
          }>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              {cardStyle.iconType === 'MaterialCommunityIcons' && (
                <MaterialCommunityIcons
                  name={cardStyle.icon}
                  size={22}
                  color={cardStyle.iconColor}
                />
              )}
              {cardStyle.iconType === 'FontAwesome5' && (
                <FontAwesome5
                  name={cardStyle.icon}
                  size={20}
                  color={cardStyle.iconColor}
                />
              )}
              <Text
                className="font-semibold text-base ml-3"
                style={{color: cardStyle.iconColor}}>
                {optionClick}
              </Text>
            </View>

            {locked ? (
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="lock" size={22} color="#DC2626" />
              </View>
            ) : status ? (
              <MaterialCommunityIcons
                name="check-circle"
                size={22}
                color="#22C55E"
              />
            ) : null}
          </View>

          <View className="mb-2">
            <View className="flex-row items-start justify-between">
              <Text
                className="font-bold text-gray-900 text-base"
                numberOfLines={1}>
                {Title.length > 20 ? Title.slice(0, 20) + '...' : Title}
              </Text>
              {optionClick?.toLowerCase() === 'quiz' && !locked && status ? (
                <TouchableOpacity
                  className="bg-green-600 rounded-md px-4 py-2"
                  onPress={() =>
                    handleNavigation(ROUTES.MARKS, {
                      module_id: unique_id,
                      title: Title,
                      description: secondOption,
                    })
                  }>
                  <Text className="text-sm font-semibold text-white text-center">
                    View Results
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
              {secondOption}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-auto">
            {ctaButton()}
            <Text className="text-xs text-gray-500">
              {formatTime(time_spent)}
            </Text>
          </View>
        </TouchableOpacity>

        {locked && (
          <View className="absolute top-0 right-0 w-full h-[90%] my-2 rounded-lg bg-black/10 flex items-center justify-center z-10">
            <TouchableOpacity
              disabled={subscription_status}
              className="rounded-md px-6 py-3 bg-p1 shadow-lg flex-row items-center justify-center"
              onPress={() =>
                Linking.openURL('https://portal.indephysio.com/sign-in')
              }>
              <MaterialCommunityIcons name="lock" size={22} color="#fff" />
              <Text className="text-sm text-white font-bold ml-2">
                {subscription_status
                  ? 'Finish prior module first'
                  : 'Get subscription to access'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  },
);

// Add getItemLayout for FlashList optimization
QuizCard.getItemLayout = (data, index) => ({
  length: 100,
  offset: 100 * index,
  index,
});

export default QuizCard;
