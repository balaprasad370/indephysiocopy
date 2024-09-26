import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import color from '../../Constants/color';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import LinearGradient from 'react-native-linear-gradient';
import Loading from '../../Components/Loading/Loading';

const Index = ({navigation}) => {
  const route = useRoute();
  const {level_id} = route.params;
  const {path, clientId, packageId, packageName, isDark, loader, setLoader} =
    useContext(AppContext);
  const [chapter, setChapter] = useState([]);
  const [progressData, setProgressData] = useState({});
  let newPackageId = packageId;

  const style = isDark ? DarkTheme : LighTheme;

  const chapterData = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      setLoader(true);
      try {
        const response = await axios.get(`${path}/chapters`, {
          params: {
            level_id: level_id,
            client_id: clientId,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setChapter(response.data);
        // Fetch progress for each chapter and update progressData
        response.data.forEach(chapter => chapterProgress(chapter.id));
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoader(false);
      }
    }
  };

  const chapterProgress = async chapterId => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(
          `${path}/chapter/v1/admin/${chapterId}/progress`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );
        console.log(response.data, 'response');

        // Update the progressData state with the fetched completion_percentage
        setProgressData(prev => ({
          ...prev,
          [chapterId]: response.data.completion_percentage, // Use the correct field from response
        }));
      } catch (error) {
        console.log('Error fetching progress for chapter', chapterId, error);
      }
    }
  };

  useEffect(() => {
    chapterData();
  }, []);

  if (loader) {
    return <Loading />;
  }

  const renderItem = ({item}) => {
    const progressPercentage = progressData[item.id] || 0; // Fetch the progress for this chapter

    // Determine the rounded progress percentage
    let displayedProgressPercentage;
    if (progressPercentage >= 95) {
      displayedProgressPercentage = 100;
    } else {
      displayedProgressPercentage = Math.floor(progressPercentage / 10) * 10; // Round down to the nearest ten
    }

    const progressSteps = 5; // We will use 5 dots to represent progress
    const progressArray = Array(progressSteps)
      .fill(false)
      .map(
        (_, index) =>
          index <
          Math.round((displayedProgressPercentage / 100) * progressSteps),
      );

    return (
      <TouchableOpacity
        hitSlop={{x: 25, y: 15}}
        onPress={() =>
          navigation.navigate(ROUTES.SELF_LEARN_SCREEN, {
            parent_module_id: item.id,
            title: item.name,
          })
        }
        style={{marginVertical: 6}}>
        <LinearGradient
          style={styles.chapterBox}
          colors={
            isDark
              ? ['#2A89C6', '#3397CB', '#0C5CB4']
              : [color.lightPrimary, color.lightPrimary, color.lightPrimary]
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <View style={styles.chapterCard}>
            {/* Image Section */}
            {item.image ? (
              <Image
                source={{
                  uri: `https://d2c9u2e33z36pz.cloudfront.net/${item.image}`,
                }}
                style={styles.chapterImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  backgroundColor: 'white',
                  width: 70,
                  height: 70,
                  borderRadius: 10,
                  marginRight: 15,
                }}
              />
            )}

            {/* Right Side: Chapter Info */}
            <View style={styles.chapterInfo}>
              <Text style={styles.chapterName}>{item.name}</Text>
              <Text style={styles.chapterDescription}>{item.description}</Text>

              {/* Enhanced Progress Bar */}
              <View style={styles.progressWrapper}>
                <Text style={styles.progressText}>
                  {displayedProgressPercentage}%
                </Text>
                <View style={styles.dotsContainer}>
                  {progressArray.map((filled, index) => (
                    <React.Fragment key={index}>
                      <View
                        style={[
                          styles.progressDot,
                          filled && styles.progressDotFilled,
                        ]}
                      />
                      {index < progressArray.length - 1 && (
                        <View
                          style={[
                            styles.progressLine,
                            filled && styles.progressLineFilled,
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                  <Text
                    style={{marginLeft: 5, fontSize: 12, color: color.black}}>
                    100%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={style.chapterContainer}>
      {chapter.length > 0 ? (
        <FlatList
          data={chapter}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 18, fontWeight: '900'}}>
            There is no content
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  chapterBox: {
    width: '100%',
    backgroundColor: color.lowPrimary,
    borderRadius: 15,
    padding: 5,
    shadowColor: color.lowPrimary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chapterInfo: {
    justifyContent: 'center',
  },
  chapterName: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  chapterDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#333',
    marginRight: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
    transition: 'background-color 0.3s ease',
  },
  progressDotFilled: {
    backgroundColor: '#4CAF50', // Filled color
  },
  progressLine: {
    width: 15,
    height: 2,
    backgroundColor: '#ccc',
  },
  progressLineFilled: {
    backgroundColor: '#4CAF50', // Filled color for the connecting line
  },
});
