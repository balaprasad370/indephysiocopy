import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Share from 'react-native-share';
import axios from 'axios';
import {AppContext} from '../../../Context/AppContext';
import AudioPlay from './AudioPlay';
const {width, height} = Dimensions.get('window');
import axiosInstance from '../../../Components/axiosInstance';
import RNBlobUtil from 'react-native-blob-util';

const Recordings = ({
  isVisible,
  onClose,
  currentFlashcard,
  currentSideData,
  flash_id,
  updateRecordings,
}) => {
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecordingTime, setCurrentRecordingTime] = useState('00:00');
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [audioSource, setAudioSource] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialRecordings, setInitialRecordings] = useState([]);

  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const isMounted = useRef(true);
  const recordingPath = useRef('');

  // Memoize currentSideData to prevent unnecessary re-renders
  const memoizedSideData = useMemo(
    () => {
      console.log('currentSideData', currentSideData);
      
      return currentSideData;
    },
    [
      currentSideData?.flash_question_id,
      currentSideData?.side,
      currentSideData?.is_front,
      currentSideData?.language,
      currentSideData?.front_recordings,
      currentSideData?.back_recordings,
    ],
  );

  useEffect(() => {
    // Load recordings for this flashcard when modal opens
    if (isVisible && memoizedSideData) {
      loadRecordings();
    }

    // Clean up when component unmounts
    return () => {
      isMounted.current = false;
      // cleanupAudio();
    };
  }, [isVisible, memoizedSideData]);

  const cleanupAudio = useCallback(async () => {
    try {
      if (isRecording) {
        await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setIsRecording(false);
      }

      if (currentPlayingIndex !== null) {
        setCurrentPlayingIndex(null);
        setAudioSource(null);
      }
    } catch (error) {
      console.log('Error during cleanup:', error);
    }
  }, [isRecording, audioRecorderPlayer]);

  const loadRecordings = useCallback(async () => {
    try {
      console.log('memoizedSideData loading recordings', memoizedSideData);

      // Check if we have a valid flashcard question ID
      if (memoizedSideData?.flash_question_id) {
        const isFrontSide = memoizedSideData.side === 'front';

        // Get recordings based on whether we're on front or back side
        let recordingsArray = [];

        if (isFrontSide && memoizedSideData.front_recordings) {
          recordingsArray = memoizedSideData.front_recordings || '[]';
        } else if (!isFrontSide && memoizedSideData.back_recordings) {
          recordingsArray = memoizedSideData.back_recordings || '[]';
        }

        if (recordingsArray.length > 0) {
          const formattedRecordings = recordingsArray.map((uri, index) => ({
            uri,
            duration: '00:00',
            timestamp: new Date().getTime() - index * 1000,
            flash_question_id: memoizedSideData.flash_question_id,
            side: memoizedSideData.side || 'front',
            is_front: isFrontSide ? 1 : 0,
            language: memoizedSideData.language || 'english',
            text: memoizedSideData.text || '',
            isRemote: true,
          }));

          setRecordings(formattedRecordings);
          setInitialRecordings([...formattedRecordings]);
          setHasChanges(false);
        } else {
          setRecordings([]);
          setInitialRecordings([]);
          setHasChanges(false);
        }
      } else {
        setRecordings([]);
        setInitialRecordings([]);
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  }, [memoizedSideData,currentSideData]);

  const startRecording = useCallback(async () => {
    if (isRecording) {
      console.log('Already recording, stopping current recording first');
      await stopRecording();
      return;
    }

    try {
      if (Platform.OS === 'android') {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          grants['android.permission.READ_EXTERNAL_STORAGE'] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          grants['android.permission.RECORD_AUDIO'] !==
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert(
            'Permission Required',
            'Audio recording requires microphone access',
          );
          return;
        }
      }

      if (currentPlayingIndex !== null) {
        setCurrentPlayingIndex(null);
        setAudioSource(null);
      }

      const timestamp = new Date().getTime();
      const audioPath = Platform.select({
        ios: `${RNFS.CachesDirectoryPath}/recording_${timestamp}.m4a`,
        android: `${RNFS.CachesDirectoryPath}/recording_${timestamp}.mp4`,
      });

      recordingPath.current = audioPath;
      setIsRecording(true);
      setCurrentRecordingTime('00:00');

      const result = await audioRecorderPlayer.startRecorder(audioPath);

      audioRecorderPlayer.addRecordBackListener(e => {
        const time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
        setCurrentRecordingTime(time.substring(0, 5));
      });

      console.log('Recording started', result);
    } catch (error) {
      console.log('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
      setIsRecording(false);
    }
  }, [isRecording, currentPlayingIndex, audioRecorderPlayer]);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;

    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();

      console.log('result', result);

      const fileName = result.split('/').slice(-1)[0];
      const type = fileName.split('.').slice(-1)[0];
      const fileData = {
        name: 'file',
        filename: fileName,
        type: 'audio/' + type,
        data: RNBlobUtil.wrap(result)
      };

      console.log('fileData', fileData);

      const response = await RNBlobUtil.fetch(
        'POST',
        'https://server.indephysio.com/uploads',
        {
          'Content-Type': 'multipart/form-data',
        },
        [fileData,
          {
            name: 'folder',
            data: 'flash_recordings/',
          },
        ],
      );

      console.log('response', response.data);

      const parsedResponse = JSON.parse(response.data);
      const cloud_uri = parsedResponse.filepath;

      const newRecording = {
        uri: cloud_uri,
        duration: currentRecordingTime,
        timestamp: new Date().getTime(),
        flash_question_id: memoizedSideData?.flash_question_id,
        side: memoizedSideData?.side || 'front',
        is_front: memoizedSideData?.side === 'front' ? 1 : 0,
        language: memoizedSideData?.language || 'english',
        text: memoizedSideData?.text || '',
        isRemote: false,
      };

      const prev = [...recordings];
      const recordingsNewUpdate = prev.map(recording => recording.uri);
      recordingsNewUpdate.push(cloud_uri);

      updateRecordings(recordingsNewUpdate, memoizedSideData?.side === 'front' ? 1 : 0);

      setRecordings(prev => {
        let newRecordings;
        if (prev.length >= 3) {
          newRecordings = [...prev.slice(1), newRecording];
        } else {
          newRecordings = [...prev, newRecording];
        }

        setHasChanges(true);
        console.log('newRecordings', newRecordings);
        return newRecordings;
      });

      setIsRecording(false);
      setCurrentRecordingTime('00:00');
      console.log('Recording stopped', result);
    } catch (error) {
      console.log('Error stopping recording:', error?.response?.data || error);
      setIsRecording(false);
    }
  }, [
    isRecording,
    audioRecorderPlayer,
    currentRecordingTime,
    memoizedSideData,
  ]);

  const handlePlaybackStatusChange = useCallback((isPlaying, index) => {
    if (isPlaying) {
      setCurrentPlayingIndex(index);
    } else {
      setCurrentPlayingIndex(null);
    }
  }, []);

  const startPlaying = useCallback(
    async index => {
      try {
        if (isRecording) {
          await stopRecording();
        }

        const recording = recordings[index];
        if (!recording) return;

        setCurrentPlayingIndex(index);
        setAudioSource({uri: recording.uri});
      } catch (error) {
        console.log('Error playing recording:', error);
        Alert.alert('Error', 'Failed to play recording');
        setCurrentPlayingIndex(null);
        setAudioSource(null);
      }
    },
    [isRecording, recordings, stopRecording],
  );

  const deleteRecording = useCallback(
    async index => {
      if (currentPlayingIndex === index) {
        setCurrentPlayingIndex(null);
        setAudioSource(null);
      }

      setRecordings(prev => {
        const newRecordings = [...prev];
        newRecordings.splice(index, 1);
        setHasChanges(true);
        return newRecordings;
      });
    },
    [currentPlayingIndex],
  );

  const shareRecordings = useCallback(async () => {
    try {
      if (recordings.length === 0) {
        Alert.alert(
          'No Recordings',
          'You need to record something first before sharing.',
        );
        return;
      }

      const shareOptions = {
        message: 'Hey, check out my pronunciation recordings!',
        title: 'Share Recordings',
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error sharing recordings:', error);
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share recordings');
      }
    }
  }, [recordings]);

  const saveRecordings = useCallback(async () => {
    try {
      const recordingUris = recordings.map(rec => rec.uri);
      const isFrontSide = memoizedSideData?.side === 'front';
      const flash_question_id = memoizedSideData?.flash_question_id;

      console.log(
        'Saving recordings for flash_question_id:',
        flash_question_id,
      );
      console.log('is_front:', isFrontSide ? 1 : 0);
      console.log('Recordings URIs:', JSON.stringify(recordingUris));

      const dataToSave = {
        flash_question_id,
        is_front: isFrontSide ? 1 : 0,
        recordings: recordingUris,
      };

      const response = await axiosInstance.post(
        `/v2/flashcard/recordings`,
        dataToSave,
      );

      console.log('Response from tbl_flashcard_user_posts:', response);

      if (isFrontSide) {
        console.log('Updating front_recordings');
      } else {
        console.log('Updating back_recordings');
      }

      return true;
    } catch (error) {
      console.error('Error saving recordings:', error);
      return false;
    }
  }, [recordings, memoizedSideData]);

  const handleClose = useCallback(() => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'Do you want to save your recordings?',
        [
          {
            text: 'Discard',
            onPress: () => {
              console.log('Discarded recordings changes');
              setRecordings(initialRecordings);
              onClose();
            },
            style: 'cancel',
          },
          {
            text: 'Save',
            onPress: async () => {
              const success = await saveRecordings();
              if (success) {
                console.log('Recordings saved successfully');
              } else {
                console.log('Failed to save recordings');
              }
              onClose();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      onClose();
    }
  }, [hasChanges, initialRecordings, onClose, saveRecordings]);

  const renderRecordingItem = useCallback(
    ({item, index}) => (
      <AudioPlay
        item={item}
        onPlaybackStatusChange={handlePlaybackStatusChange}
        deleteRecording={deleteRecording}
        startPlaying={startPlaying}
        index={index}
        audioSource={audioSource}
      />
    ),
    [
      currentPlayingIndex,
      audioSource,
      startPlaying,
      handlePlaybackStatusChange,
      deleteRecording,
    ],
  );

  const EmptyContainer = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recordings yet</Text>
        <Text style={styles.emptySubtext}>
          Record your pronunciation to practice
        </Text>
      </View>
    ),
    [],
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Recordings</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={shareRecordings}>
                <Icon name="share" size={22} color="#613BFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleClose}>
                <Icon name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.flashcardInfo}>
            <Text style={styles.flashcardTitle} numberOfLines={1}>
              {memoizedSideData?.text ||
                currentFlashcard?.flash_question ||
                'Current Flashcard'}
            </Text>
            <Text style={styles.flashcardSubtitle}>
              {memoizedSideData?.side === 'back' ? 'Answer' : 'Question'} •
              {memoizedSideData?.language === 'english'
                ? ' English'
                : ' German'}
            </Text>
          </View>

          {recordings.length > 0 ? (
            <FlatList
              data={recordings}
              renderItem={renderRecordingItem}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={styles.listContainer}
              extraData={[currentPlayingIndex, isRecording]}
            />
          ) : (
            EmptyContainer
          )}

          <TouchableOpacity
            style={[
              styles.recordButton,
              {
                backgroundColor: isRecording ? '#EF4444' : '#613BFF',
              },
            ]}
            onPress={isRecording ? stopRecording : startRecording}>
            <Icon
              name={isRecording ? 'stop' : 'mic'}
              size={24}
              color="white"
              style={styles.recordIcon}
            />
            <Text style={styles.recordButtonText}>
              {isRecording
                ? `Recording... ${currentRecordingTime}`
                : 'Record Pronunciation'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: height * 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shareButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  flashcardInfo: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  flashcardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 4,
  },
  flashcardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContainer: {
    flexGrow: 1,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    fontWeight: '500',
    color: '#1F2937',
  },
  recordingLanguage: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  recordingText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  recordingDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  recordingActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#1F2937',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 14,
  },
  recordButton: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  recordIcon: {
    marginRight: 8,
  },
  recordButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Recordings;
