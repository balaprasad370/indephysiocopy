import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import color from '../../Constants/color';

import LinearGradient from 'react-native-linear-gradient';
import Loading from '../../Components/Loading/Loading';
import IconTimer from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';

const Index = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {level_id} = route.params;
  const {path, clientId, packageId, isDark, loader, setLoader} =
    useContext(AppContext);

  const [message, setMessage] = useState('');

  const [chapters, setChapters] = useState([]);
  const [isBranch, setIsBranch] = useState(false);
  const style = isDark ? DarkTheme : LighTheme;

  // Memoized function to fetch chapters data
  const fetchChapters = useCallback(async () => {
    const token = await storage.getStringAsync('token');
    if (!token) return;
    setLoader(true);
    try {
      // console.log(token);

      const response = await axios.get(
        // `${path}/admin/v3/chapters-with-progress`,
        `${path}/admin/v1/chapters`,
        {
          params: {
            level_id,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);
      
      if (response.data.success == false) {
        setMessage(response.data.message);
        setChapters([]);
      } else {
        setIsBranch(response.data?.is_branch ? true : false);
        setChapters(response.data.chapters);
      }
    } catch (error) {
      console.log('Error fetching chapters:', error.response.data);
      setMessage(error.response?.data?.message);
      setChapters([]);
    } finally {
      setLoader(false);
    }
  }, [path, level_id, clientId, packageId]);

  // Use useFocusEffect to refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchChapters();
    }, [fetchChapters]),
  );

  const getProgressColor = useCallback(percentage => {
    if (percentage >= 75) return '#4CAF50';
    if (percentage >= 50) return '#FFA726';
    if (percentage < 25) return '#FF7043';
    return '#F44336';
  }, []);

  const RenderProgressBar = useCallback(({percentage}) => {
    const progressSteps = 5;
    const filledSteps = Math.round((percentage / 100) * progressSteps);
    const color = getProgressColor(percentage);

    return (
      <View style={styles.progressWrapper}>
        <Text style={styles.progressText}>{Math.round(percentage)}%</Text>
        <View style={styles.dotsContainer}>
          {Array(progressSteps)
            .fill(0)
            .map((_, index) => (
              <React.Fragment key={index}>
                <View
                  style={[
                    styles.progressDot,
                    index < filledSteps && {backgroundColor: color},
                  ]}
                />
                {index < progressSteps - 1 && (
                  <View
                    style={[
                      styles.progressLine,
                      index < filledSteps && {backgroundColor: color},
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
        </View>
      </View>
    );
  }, []);

  const renderChapterCard = useCallback(
    ({item}) => {
      const {progress} = item;

      return (
        <TouchableOpacity
          disabled={progress.is_locked}
          onPress={() => {
            navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
              parent_module_id: item.id,
              title: item.name,
              level_id: level_id,
            });
          }}
          style={styles.cardContainer}>
          <LinearGradient
            style={[
              styles.gradientContainer,
              progress.is_locked && styles.lockedCard,
            ]}
            colors={
              isDark
                ? ['#2A89C6', '#3397CB', '#0C5CB4']
                : [color.lightPrimary, color.lightPrimary, color.lightPrimary]
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            {progress.is_locked && (
              <View style={styles.lockIconContainer}>
                <IconTimer
                  name="lock-closed-sharp"
                  size={30}
                  color="#000"
                  style={styles.lockIcon}
                />
              </View>
            )}

            <View style={styles.contentContainer}>
              {/* Chapter Image */}
              {item.image ? (
                <Image
                  source={{
                    uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.image}`,
                  }}
                  style={styles.chapterImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage} />
              )}
              <View style={styles.infoContainer}>
                <Text style={styles.chapterName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.chapterDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <RenderProgressBar
                  percentage={progress.completion_percentage}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    },
    [isDark, navigation, level_id],
  );

  const renderChapterBranchCard = useCallback(
    ({item}) => {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(ROUTES.BRANCH_CHAPTERS, {
              category_id: item.category_id,
              title: item.category_title,
            });
          }}
          style={styles.cardContainer}>
          <LinearGradient
            style={[styles.gradientContainer]}
            colors={
              isDark
                ? ['#2A89C6', '#3397CB', '#0C5CB4']
                : [color.lightPrimary, color.lightPrimary, color.lightPrimary]
            }
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>

            <View style={styles.contentContainer}>
              {/* Chapter Image */}
              {item.category_img ? (
                <Image
                  source={{
                    uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.category_img}`,
                  }}
                  style={styles.chapterImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImage} />
              )}
              <View style={styles.infoContainer}>
                <Text style={styles.chapterName} numberOfLines={1}>
                  {item.category_title}
                </Text>
                <Text style={styles.chapterDescription} numberOfLines={2}>
                  {item.category_description}
                </Text>
                {/* <RenderProgressBar
                  percentage={progress.completion_percentage}
                /> */}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    },
    [isDark, navigation, level_id],
  );

  if (loader) return <Loading />;

  return (
    <SafeAreaView style={style.chapterContainer}>
      {/* <Text>Chapters</Text> */}
      {chapters && chapters.length > 0 ? (
        <>
          <FlatList
            data={chapters}
            renderItem={isBranch ? renderChapterBranchCard : renderChapterCard}
            // keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            removeClippedSubviews={Platform.OS === 'android'}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 100,
        shadowOffset: {
          width: 50,
          height: 60,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  gradientContainer: {
    borderRadius: 15,
    padding: 12,
    overflow: 'hidden',
  },
  lockedCard: {
    opacity: 0.7,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 1,
    transform: [{translateX: -15}, {translateY: -15}],
  },
  chapterImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: '#f5f5f5',
  },
  placeholderImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: 'white',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chapterName: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chapterDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#333',
    marginRight: 8,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  progressLine: {
    width: 12,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: color.darkPrimary,
  },
});

export default Index;
