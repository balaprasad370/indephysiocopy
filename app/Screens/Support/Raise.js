import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Linking,
} from 'react-native';
import React, {useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../theme/AppContext';
import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from './../../Constants/routes';
import DocumentPicker from 'react-native-document-picker';
import RNBlobUtil from 'react-native-blob-util';
import axios from 'axios';
import axiosInstance from '../../Components/axiosInstance';

const Raise = () => {
  const {isDark} = useContext(AppContext);
  const navigation = useNavigation();
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);

  const issueTypes = [
    {id: 1, name: 'Join Program'},
    {id: 2, name: 'Technical Problem'},
    {id: 3, name: 'Billing Issue'},
    {id: 4, name: 'Account Access'},
    {id: 5, name: 'Feature Request'},
    {id: 6, name: 'Content Issue'},
    {id: 7, name: 'Other'},
  ];

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        setDocument(result[0]);
        await uploadFile(result[0]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled document picker');
      } else {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'Failed to attach file. Please try again.');
      }
    }
  };

  const uploadFile = async file => {
    setUploading(true);
    try {
      const fileData = {
        name: file.name,
        type: file.type,
        uri:
          Platform.OS === 'android'
            ? file.uri
            : file.uri.replace('file://', ''),
      };

      // Upload using RNBlobUtil
      const response = await RNBlobUtil.fetch(
        'POST',
        'https://server.indephysio.com/upload/image',
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'file',
            filename: fileData.name,
            type: fileData.type,
            data: RNBlobUtil.wrap(fileData.uri),
          },
        ],
      );

      const responseData = JSON.parse(response.data);
      console.log('File upload response:', responseData);

      const filepath = responseData.filepath;

      // Update document with server response if needed
      if (responseData.filepath) {
        setDocument({
          ...file,
          filepath: responseData.filepath,
        });
      }

      Alert.alert('Success', 'File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!issueType || !description) {
      Alert.alert(
        'Error',
        'Please select an issue type and provide a description',
      );
      return;
    }

    setLoading(true);

    try {
      // Create form data for API submission

      console.log('Document:', document);
      
  
      const obj = {
        issueType,
        description,
        fileUrl: document?.filepath || '',
      };

      console.log('Submitting support ticket:', obj);

      // Uncomment when API is ready
      const response = await axiosInstance.post('/tickets', obj);

      // Simulate API call for now
    
        setLoading(false);
        Alert.alert(
          'Success',
          'Your support ticket has been submitted. We will contact you soon.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIssueType('');
                setDescription('');
                setDocument(null);
              },
            },
          ],
        );
    
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      setLoading(false);
      Alert.alert(
        'Error',
        'Failed to submit your ticket. Please try again later.',
      );
    }
  };

  const openWebsite = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', `Cannot open URL: ${url}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-b50 dark:bg-gray-900">
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
          />
        </View>
        <PageTitle pageName="Support Center" />
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            How can we help you?
          </Text>
          <Text className="text-gray-600 dark:text-gray-300">
            Fill out the form below to submit a support ticket. Our team will
            respond to your inquiry as soon as possible.
          </Text>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <Text className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Issue Type
          </Text>
          <View className="flex-row flex-wrap mb-4">
            {issueTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                  issueType === type.name
                    ? 'bg-indigo-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                onPress={() => setIssueType(type.name)}>
                <Text
                  className={`${
                    issueType === type.name
                      ? 'text-white'
                      : 'text-gray-800 dark:text-gray-300'
                  }`}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-gray-700 dark:text-gray-300 font-medium mb-2">
            Describe your issue
          </Text>
          <TextInput
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3 min-h-[120px] mb-4"
            multiline
            placeholder="Please provide details about your issue..."
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            value={description}
            onChangeText={setDescription}
          />

          <View className="mb-6">
            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-2">
              Attach File (Optional)
            </Text>
            {document ? (
              <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <Ionicons
                  name={
                    document.type?.startsWith('image')
                      ? 'image-outline'
                      : 'document-text-outline'
                  }
                  size={24}
                  color={isDark ? '#FFFFFF' : '#6366f1'}
                />
                <Text
                  className="text-gray-800 dark:text-white ml-2 flex-1"
                  numberOfLines={1}>
                  {document.name || document.uri.split('/').pop()}
                </Text>
                <TouchableOpacity onPress={() => setDocument(null)}>
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color={isDark ? '#FFFFFF' : '#6366f1'}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="flex-row items-center justify-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                onPress={handleDocumentPick}
                disabled={uploading}>
                <Ionicons
                  name="attach-outline"
                  size={24}
                  color={isDark ? '#FFFFFF' : '#6366f1'}
                />
                <Text className="text-gray-800 dark:text-white ml-2">
                  {uploading ? 'Uploading...' : 'Select a file'}
                </Text>
              </TouchableOpacity>
            )}
            {document?.serverUrl && (
              <Text className="text-green-600 dark:text-green-400 mt-2 text-xs">
                File uploaded successfully
              </Text>
            )}
          </View>

          <TouchableOpacity
            className={`py-3 rounded-lg flex-row justify-center items-center ${
              loading || uploading ? 'bg-indigo-400' : 'bg-indigo-600'
            }`}
            onPress={handleSubmit}
            disabled={loading || uploading}>
            {loading ? (
              <View className="flex-row items-center">
                <Ionicons name="hourglass-outline" size={20} color="#FFFFFF" />
                <Text className="text-white font-medium ml-2">
                  Submitting...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons
                  name="paper-plane-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <Text className="text-white font-medium ml-2">
                  Submit Ticket
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 mt-6">
          <Text className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Contact Information
          </Text>

          <TouchableOpacity
            className="flex-row items-center mb-3"
            onPress={() => openWebsite('https://www.meduniverse.in')}>
            <Ionicons
              name="globe-outline"
              size={24}
              color={isDark ? '#FFFFFF' : '#6366f1'}
              className="mr-3"
            />
            <Text className="text-indigo-600 dark:text-indigo-400 pl-2 underline">
              www.meduniverse.in
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={24}
              color={isDark ? '#FFFFFF' : '#6366f1'}
              className="mr-3"
            />
            <Text className="text-gray-700 dark:text-gray-300 pl-2">
              Monday - Friday, 9:00 AM - 5:00 PM IST
            </Text>
          </View>
        </View>

        <View className="bg-indigo-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <Text className="text-gray-800 dark:text-white font-medium mb-2">
            Frequently Asked Questions
          </Text>
          <TouchableOpacity
            className="mt-2"
            onPress={() => navigation.navigate(ROUTES.FAQ)}>
            <Text className="text-indigo-600 dark:text-indigo-400">
              Visit our FAQ page →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Raise;
