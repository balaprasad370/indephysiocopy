import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import color from '../../Constants/color';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import scale from '../../utils/utils';
import Loading from '../Loading/Loading';

const Index = ({route}) => {
  const [htmlData, setHtmlData] = useState('');

  const {path, isDark, loader, setLoader} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const {read_id, order_id, chapter_id, unique_id} = route.params;

  const readingMaterial = async read_id => {
    setLoader(true);
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(
          `${path}/reading/chapters/${read_id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );

        let readingText = response.data[0]?.reading_text;

        const customCss = isDark
          ? `
        <style>
          body {
            background-color: black;
            padding:10px;
          }
          p{
            font-size:38px;
            font-family: "Poppins", sans-serif;
            color:white;
          }
          span{
            font-size:40px;
            font-family: "Poppins", sans-serif;
            color:white;
          }

          em{
            font-size:38px;
            font-family: "Poppins", sans-serif;
            color:white;
          }
          img{
            width:100%;
            margin-bottom:10px;
            margin-top:10px;
          }
          ul{
            font-size:38px;
            font-family: "Poppins", sans-serif;
            color:white;
          }
          li{
            font-size:38px;
            font-family: "Poppins", sans-serif;
            color:white;
          }
          strong{
            font-size:38px;
            font-family: "Poppins", sans-serif;
            color:white;
          }
          blockquote{
            font-size:38px;
            font-family: "Poppins", sans-serif;
            color:white;
          }
          iframe {
            width: 100%;
            height: auto;
            max-width: 100%;
            aspect-ratio: 16/9;
          }
          h2{
            font-size:46px;
            font-family: "Poppins", sans-serif;
            color:white;
          }
        </style>
      `
          : `
      <style>
        body {
          background-color: white;
          padding:20px;
        }
        p{
          font-size:38px;
          font-family: "Poppins", sans-serif;
          color:black;
        }
        span{
          font-size:40px;
          font-family: "Poppins", sans-serif;
          color:black;
        }

        em{
          font-size:38px;
          font-family: "Poppins", sans-serif;
          color:black;
        }
        img{
          width:100%;
          margin-bottom:10px;
          margin-top:10px;
        }
        ul{
          font-size:38px;
          font-family: "Poppins", sans-serif;
          color:black;
        }
        li{
          font-size:38px;
          font-family: "Poppins", sans-serif;
          color:black;
        }
        strong{
          font-size:38px;
          font-family: "Poppins", sans-serif;
          color:black;
        }
        blockquote{
          font-size:38px;
          font-family: "Poppins", sans-serif;
          color:black;
        }
        iframe {
          width: 100%;
          height: auto;
          max-width: 100%;
          aspect-ratio: 16/9;
        }
        h2{
          font-size:46px;
          font-family: "Poppins", sans-serif;
          color:black;
        }
      </style>
    `;
        readingText = customCss + readingText;
        setHtmlData(readingText);
        setLoader(false);
      } catch (error) {
        console.log('Error from reading material:', error);
      } finally {
        setLoader(false);
      }
    }
  };

  const [completed, setCompleted] = useState(0);
  const navigation = useNavigation();

  const submitReadStatus = async () => {
    const token = await storage.getStringAsync('token'); // Assuming token is stored

    // setCompleted(!completed);

    Alert.alert(
      'Mark as read',
      'Are you sure you want to submit your Reading material completion?',
      [
        {
          text: 'No',
          onPress: () => console.log('Submission cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await axios.post(
                `${path}/student/readingresult`,
                {
                  read_id,
                  completed: 1,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Attach token
                  },
                },
              );

              console.log('Response:', response.data.msg);
              navigation.goBack();
              // Alert.alert('Success', response.data.msg); // Show success alert
            } catch (error) {
              console.log('Error submitting flashcard:', error);
              Alert.alert(
                'Error',
                'There was a problem submitting the flashcard.',
              );
            }
          },
        },
      ],
      {cancelable: false}, // Prevent dismissing by clicking outside
    );
  };
  // useEffect(() => {
  //   readingMaterial(read_id);
  //   setLoader(false);
  // }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      readingMaterial(read_id);
    });
    return unsubscribe;
  }, [navigation]);

  if (loader) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <WebView
          originWhitelist={['*']} 
          source={{html: htmlData}}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        />
      </View>
      
      <View className="px-4 py-3 bg-white shadow-lg">
        <TouchableOpacity
          onPress={submitReadStatus}
          className="bg-p1 py-4 px-6 rounded-xl shadow-sm active:opacity-90"
          style={{
            shadowColor: '#613BFF',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4
          }}>
          <Text className="text-white text-center font-medium text-lg">
            Mark as read
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({});
