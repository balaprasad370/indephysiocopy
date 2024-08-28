// import {StyleSheet, View} from 'react-native';
// import React, {useContext, useEffect, useState} from 'react';
// import WebView from 'react-native-webview';
// import axios from 'axios';
// import {AppContext} from '../../theme/AppContext';

// const Index = ({route}) => {
//   const [htmlData, setHtmlData] = useState('');

//   const {path} = useContext(AppContext);

//   // const {chapterId} = route.params;
//   const {chapterId} = route.params;

//   const readingMaterial = async chapterId => {
//     try {
//       const response = await axios.get(
//         `http://${path}:4000/reading/${chapterId}`,
//       );
//       const readingText = response.data[0]?.reading_text;
//       console.log(readingText);
//       setHtmlData(readingText);
//     } catch (error) {
//       console.log('Error from reading material:', error);
//     }
//   };

//   useEffect(() => {
//     // const chapterId = 44;
//     readingMaterial(chapterId);
//   }, []);

//   return (
//     <View style={{flex: 1, backgroundColor: 'white', padding: '3%'}}>
//       <WebView
//         style={{height: 500}}
//         originWhitelist={['*']}
//         source={{html: htmlData}}
//       />
//     </View>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({});
import {StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';

const Index = ({route}) => {
  const [htmlData, setHtmlData] = useState('');

  const {path} = useContext(AppContext);

  const {chapterId} = route.params;

  console.log(chapterId);
  const readingMaterial = async chapterId => {
    try {
      const response = await axios.get(
        `https://server.indephysio.com/reading/44`,
        // `https://server.indephysio.com/reading/${chapterId}`,
        // `http://${path}:4000/reading/${chapterId}`,
      );
      let readingText = response.data[0]?.reading_text;
      const customCss = `
        <style>
          p{
            font-size:38px;
            font-family: "Poppins", sans-serif;
          }
          em{
            font-size:38px;
            font-family: "Poppins", sans-serif;
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
  };

  useEffect(() => {
    readingMaterial(chapterId);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#FFF', padding: '3%'}}>
      <WebView originWhitelist={['*']} source={{html: htmlData}} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
