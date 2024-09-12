import {StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';

const Index = ({route}) => {
  const [htmlData, setHtmlData] = useState('');

  const {path} = useContext(AppContext);

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
        const customCss = `
          <style>
            p{
              font-size:38px;
              font-family: "Poppins", sans-serif;
            }
            span{
              font-size:40px;
              font-family: "Poppins", sans-serif;
            }
            
            em{
              font-size:38px;
              font-family: "Poppins", sans-serif;
            }
            img{
              width:100%;
              margin-bottom:10px;
              margin-top:10px;
            }
            ul{
              font-size:38px;
              font-family: "Poppins", sans-serif;
            }
            li{
              font-size:38px;
              font-family: "Poppins", sans-serif;
            }
            strong{
              font-size:38px;
              font-family: "Poppins", sans-serif;
            }
            blockquote{
              font-size:38px; 
              font-family: "Poppins", sans-serif;
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

  useEffect(() => {
    readingMaterial(read_id);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FFF', padding: '3%'}}>
      <WebView
        originWhitelist={['*']}
        source={{html: htmlData}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
