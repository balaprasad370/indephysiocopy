import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import DarkTheme from '../../theme/Darktheme';
import LighTheme from '../../theme/LighTheme';
import color from '../../Constants/color';

const Index = ({route}) => {
  const [htmlData, setHtmlData] = useState('');

  const {path, isDark} = useContext(AppContext);
  const style = isDark ? DarkTheme : LighTheme;

  const {read_id} = route.params;
  const readingMaterial = async read_id => {
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

        // Prepend the CSS to the readingText
        readingText = customCss + readingText;

        setHtmlData(readingText);
      } catch (error) {
        console.log('Error from reading material:', error);
      }
    }
  };

  const [completed, setCompleted] = useState(0);

  const submitReadStatus = async () => {
    const token = await storage.getStringAsync('token'); // Assuming token is stored

    setCompleted(!completed);

    Alert.alert(
      'Submit Completion',
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
                  completed: completed,
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Attach token
                  },
                },
              );

              console.log('Response:', response.data.msg);
              Alert.alert('Success', response.data.msg); // Show success alert
            } catch (error) {
              console.error('Error submitting flashcard:', error);
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

  useEffect(() => {
    readingMaterial(read_id);
  }, []);

  return (
    <View style={style.reading}>
      <WebView
        originWhitelist={['*']}
        source={{html: htmlData}}
        showsVerticalScrollIndicator={false}
      />
      <View
        style={{
          backgroundColor: color.lightPrimary,
          paddingVertical: 8,
          borderRadius: 9,
        }}>
        <TouchableOpacity
          onPress={submitReadStatus}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Text style={{fontSize: 18, color: 'black'}}>Marks as read</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
