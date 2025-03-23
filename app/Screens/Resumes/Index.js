import React, {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Linking,
  Dimensions,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import {WebView} from 'react-native-webview';
import axiosInstance from './../../Components/axiosInstance';
import {useNavigation, useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';
import {ROUTES} from '../../Constants/routes';
import Share from 'react-native-share';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

const Index = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);

  // Determine if device is tablet based on screen size
  const isTablet = width > 768;

  const getResumes = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        'https://server.indephysio.com/student/getResumes',
      );
      if (response && response.data) {
        setResumes(response.data);
      } else {
        setResumes([]);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getResumes();
    } finally {
      setRefreshing(false);
    }
  }, [getResumes]);

  useEffect(() => {
    getResumes();
  }, [getResumes]);

  const handleResumeSelect = useCallback(resume => {
    setSelectedResume(resume);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedResume(null);
  }, []);

  const handleEditResume = useCallback(
    item => {
      navigation.navigate(ROUTES.RESUMES_EDIT, {
        resume_session_id: item?.resume_session_id,
      });
    },
    [navigation, selectedResume],
  );

  const handleDeleteResume = useCallback(
    async resume_session_id => {
      Alert.alert(
        'Delete Resume',
        'Are you sure you want to delete this resume?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await axiosInstance.delete(
                  `https://server.indephysio.com/student/deleteResume/${resume_session_id}`,
                );
                getResumes();
              } catch (error) {
                console.error('Error deleting resume:', error);
                Alert.alert(
                  'Error',
                  'Failed to delete resume. Please try again.',
                );
              }
            },
          },
        ],
        {cancelable: true},
      );
    },
    [getResumes],
  );

  const handleShareResumeLink = useCallback(async resume_session_id => {
    try {
      console.log('resume_session_id', resume_session_id);

      const url = `https://portal.indephysio.com/profile/resume/${resume_session_id}`;
      await Share.open({
        url: url,
        type: 'url',
        title: 'Share Resume',
      });
    } catch (error) {
      // console.error('Error sharing resume link:', error);
      // Alert.alert('Error', 'Failed to share resume link');
    }
  }, []);

  const handleCreateNewResume = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCreateResume = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter a resume title');
        return;
      }

      const response = await axiosInstance.post(
        'https://server.indephysio.com/student/createResume',
        {title: name, description},
      );

      getResumes();
      bottomSheetModalRef.current?.dismiss();
      setName('');
      setDescription('');

      navigation.navigate(ROUTES.RESUMES_ADD, {
        resume_session_id: response.data.resume_session_id,
      });
    } catch (error) {
      console.error('Error creating resume:', error);
      Alert.alert('Error', 'Failed to create resume. Please try again.');
    }
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="mt-2 text-base text-gray-600">Loading resumes...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-b50">
          <View className="relative pb-8">
            <View className="absolute w-full top-0 left-0 right-0">
              <Image
                source={topBgBackground}
                className="w-full h-[200px] -mt-24"
                resizeMode="cover"
                onError={() => console.warn('Failed to load background image')}
              />
            </View>
            <View className="flex-row justify-between items-center px-4">
              <PageTitle pageName="Resumes" />
            </View>
          </View>

          <View className="flex-row justify-end items-center px-4">
            <TouchableOpacity
              onPress={handleCreateNewResume}
              className="bg-p1 p-3 rounded-full shadow-md flex-row items-center">
              <Icon name="add" size={24} color="#fff" />
              <Text className="text-white font-bold ml-2">
                Create New Resume
              </Text>
            </TouchableOpacity>
          </View>

          {!resumes || resumes.length === 0 ? (
            <View className="flex-1 justify-center items-center p-5">
              <Icon
                name="description"
                size={isTablet ? 100 : 80}
                color="#d1d5db"
              />
              <Text
                className={`text-${isTablet ? 'xl' : 'lg'} text-gray-500 mt-4`}>
                No resumes found
              </Text>
              <TouchableOpacity
                onPress={handleCreateNewResume}
                className="mt-6 bg-p1 px-5 py-3 rounded-full flex-row items-center">
                <Icon name="add" size={20} color="#fff" />
                <Text className="text-white font-bold ml-2 ">
                  Create New Resume
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={resumes}
              keyExtractor={item =>
                item.resume_id?.toString() || Math.random().toString()
              }
              contentContainerStyle={{
                padding: 16,
                paddingHorizontal: isTablet ? 24 : 16,
                maxWidth: isTablet ? 1024 : undefined,
                alignSelf: isTablet ? 'center' : undefined,
                width: isTablet ? '100%' : undefined,
              }}
              numColumns={isTablet ? 2 : 1}
              key={isTablet ? 'two-column' : 'one-column'}
              columnWrapperStyle={
                isTablet ? {justifyContent: 'space-between'} : undefined
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#6366f1']}
                />
              }
              renderItem={({item}) => (
                <View
                  className={`bg-white rounded-xl p-4 mb-4 shadow ${
                    item.is_active ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                  style={{
                    width: isTablet ? '48.5%' : '100%',
                  }}>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text
                      className={`text-${
                        isTablet ? 'xl' : 'lg'
                      } font-bold text-gray-800 flex-1`}>
                      {item.title || 'Untitled Resume'}
                    </Text>
                    {item.is_active ? (
                      <View className="bg-emerald-500 px-2 py-1 rounded-full">
                        <Text className="text-white text-xs font-bold">
                          Active
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text className="text-sm text-gray-600 mb-3">
                    {item.description || 'No description'}
                  </Text>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-xs text-gray-500">
                      Created:{' '}
                      {item.resume_created_date
                        ? new Date(
                            item.resume_created_date,
                          ).toLocaleDateString()
                        : 'Unknown date'}
                    </Text>
                  </View>

                  <View className="flex-row justify-around mt-4 pt-3 border-t border-gray-100">
                    <TouchableOpacity
                      className="items-center"
                      onPress={() => handleResumeSelect(item)}>
                      <View className="bg-indigo-100 p-2 rounded-full mb-1">
                        <Icon name="visibility" size={20} color="#4f46e5" />
                      </View>
                      <Text className="text-xs text-gray-700">View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="items-center"
                      onPress={() => handleEditResume(item)}>
                      <View className="bg-amber-100 p-2 rounded-full mb-1">
                        <Icon name="edit" size={20} color="#d97706" />
                      </View>
                      <Text className="text-xs text-gray-700">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="items-center"
                      onPress={() =>
                        handleShareResumeLink(item.resume_session_id)
                      }>
                      <View className="bg-blue-100 p-2 rounded-full mb-1">
                        <Icon name="link" size={20} color="#2563eb" />
                      </View>
                      <Text className="text-xs text-gray-700">Share</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="items-center"
                      onPress={() =>
                        handleDeleteResume(item.resume_session_id)
                      }>
                      <View className="bg-red-100 p-2 rounded-full mb-1">
                        <Icon name="delete" size={20} color="#dc2626" />
                      </View>
                      <Text className="text-xs text-gray-700">Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          {/* Resume Viewer Modal */}
          <Modal
            visible={selectedResume !== null}
            animationType="slide"
            transparent={false}
            onRequestClose={handleBack}>
            <SafeAreaView className="flex-1 bg-white">
              <View className="bg-p1 p-4 flex-row items-center justify-between mb-4">
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-row items-center">
                  <Icon name="arrow-back" size={24} color="#fff" />
                  <Text className="text-white ml-2 text-base">Back</Text>
                </TouchableOpacity>
                <Text
                  className="text-white text-lg font-bold flex-1 ml-4"
                  numberOfLines={1}>
                  {selectedResume?.title || 'Resume'}
                </Text>
                <TouchableOpacity onPress={handleBack} className="p-1">
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              {selectedResume && selectedResume.resume_session_id && (
                <WebView
                  source={{
                    uri: `https://resume.meduniverse.app/resumeshare.php?resume=${selectedResume.resume_session_id}`,
                  }}
                  className="flex-1 z-20"
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View className="absolute inset-0 justify-center items-center bg-gray-50">
                      <ActivityIndicator size="large" color="#6366f1" />
                    </View>
                  )}
                  onError={syntheticEvent => {
                    const {nativeEvent} = syntheticEvent;
                    console.error('WebView error:', nativeEvent);
                  }}
                />
              )}
            </SafeAreaView>
          </Modal>

          {/* Create Resume Bottom Sheet */}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            onChange={handleSheetChanges}
            handleIndicatorStyle={{backgroundColor: '#9ca3af'}}
            backgroundStyle={{backgroundColor: '#ffffff'}}>
            <BottomSheetView style={styles.contentContainer}>
              <Text className="text-xl font-bold text-gray-800 mb-6">
                Create New Resume
              </Text>

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Resume Title *
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg p-3 mb-4 text-gray-800"
                placeholder="Enter resume title"
                value={name}
                onChangeText={setName}
              />

              <Text className="text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </Text>
              <TextInput
                className="bg-gray-100 rounded-lg p-3 mb-6 text-gray-800"
                placeholder="Enter resume description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetModalRef.current?.dismiss();
                    setName('');
                    setDescription('');
                  }}
                  className="px-4 py-3 rounded-lg border border-gray-300">
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCreateResume}
                  className="px-4 py-3 rounded-lg bg-indigo-600">
                  <Text className="text-white font-medium">Create</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4b5563',
  },
  headerContainer: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
  },
  resumeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeResume: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  resumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  activeIndicator: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resumeDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  resumeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  resumeDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  resumeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },
});

export default Index;
