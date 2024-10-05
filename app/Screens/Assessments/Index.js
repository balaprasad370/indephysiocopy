import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {AppContext} from '../../theme/AppContext';
import axios from 'axios';
import storage from '../../Constants/storage';

import {PermissionsAndroid, Platform} from 'react-native';

const Index = ({route, navigation}) => {
  const {path} = useContext(AppContext);
  const {chapter_id, order_id, assessment_id, unique_id} = route.params;
  const [assessment, setAssessment] = useState(null); // State to hold assessment details
  const [inputText, setInputText] = useState(''); // State to hold user input text
  const [image, setImage] = useState(null); // State to hold selected image

  const fetchAssessment = async () => {
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.get(
        `${path}/assessments/student/${assessment_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAssessment(response.data[0]); // Assuming the response contains an array of assessments
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch assessment details');
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, [chapter_id]);

  // Function to handle image selection (camera or gallery)
  const selectImage = () => {
    Alert.alert('Upload Image', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () => openCamera(),
      },
      {
        text: 'Gallery',
        onPress: () => openGallery(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera access to take pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 1,
      });
      if (result.didCancel) {
        Alert.alert('Cancelled', 'No image selected');
      } else if (result.errorMessage) {
        Alert.alert('Error', result.errorMessage);
      } else {
        setImage(result.assets[0]); // Set the selected image
      }
    } else {
      Alert.alert('Error', 'Camera permission is required');
    }
  };

  // Function to handle image selection from gallery
  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1, // Choose the highest quality image
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('Error: ', result.errorMessage);
      Alert.alert('Error', result.errorMessage);
    } else if (result.assets) {
      setImage(result.assets[0]);
    }
  };

  const uploadFileToServer = async file => {
    const token = await storage.getStringAsync('token');

    // If the file is an object, extract the required properties
    let name = file.fileName;
    file.name = name;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://server.indephysio.com/upload/image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Upload response:', response.data.filepath);
      return response.data.filepath;
    } catch (error) {
      console.log('Error uploading file:', error);
      throw new Error('Upload failed');
    }
  };

  // const handleSubmit = async () => {
  //   if (inputText || image) {
  //     try {
  //       // Only upload the image if it's provided
  //       const image_url = image ? await uploadFileToServer(image) : null;

  //       const token = await storage.getStringAsync('token');
  //       const response = await axios.post(
  //         `${path}/student/assessmentresult`,
  //         {
  //           ass_id: assessment_id,
  //           text_answer: inputText,
  //           image_answer: image_url,
  //           completed: true,
  //         },
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${token}`,
  //           },
  //         },
  //       );

  //       console.log('Submission response:', response.data);
  //       navigation.goBack(); // Navigate back after successful submission
  //     } catch (error) {
  //       console.error('Submission error:', error);
  //       Alert.alert('Error', 'Failed to submit assessment');
  //     } finally {
  //       setLoading(false); // Ensure loading is reset
  //     }
  //   } else {
  //     Alert.alert('Error', 'Please provide a response or upload an image');
  //   }
  // };
  const handleSubmit = async () => {
    if (!inputText && !image) {
      Alert.alert(
        'Error',
        'One of the following is required: response or image.',
      );
      return; // Exit the function if both are empty
    }

    try {
      const image_url = image ? await uploadFileToServer(image) : null;

      console.log('image_url', image_url);

      const token = await storage.getStringAsync('token');
      console.log('token', inputText, image_url);
      // return;

      // Post the assessment result
      const response = await axios.post(
        `${path}/student/assessmentresult`,
        {
          ass_id: assessment_id,
          text_answer: inputText || '',
          image_answer: image_url || '',
          completed: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Submission response:', response.data);
      navigation.goBack(); // Navigate back after successful submission
    } catch (error) {
      Alert.alert('Error', 'Failed to submit assessment');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {assessment ? (
        <>
          <Text style={styles.title}>{assessment.title}</Text>
          <Text style={styles.description}>{assessment.description}</Text>

          <TextInput
            style={styles.input}
            placeholder="Write your answer here..."
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#bbb"
            multiline={true}
            numberOfLines={10} // Initial number of lines
            textAlignVertical="top" // Align text to the top
          />

          <Text style={{textAlign: 'center', marginBottom: 10, fontSize: 22}}>
            Or
          </Text>
          <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{uri: image.uri}}
              style={styles.imagePreview}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading assessment details...</Text>
      )}
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2e3a59',
  },
  description: {
    fontSize: 16,
    color: '#556987',
    marginBottom: 25,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  imageButton: {
    backgroundColor: '#0a74da',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  imagePreview: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});
