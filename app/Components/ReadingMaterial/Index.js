import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import WebView from 'react-native-webview';
import axios from 'axios';

const Index = () => {
  const [htmlData, setHtmlData] = useState('');

  const readingMaterial = async () => {
    try {
      const response = await axios.get(
        'https://server.indephysio.com/reading/1',
      );
      const readingText = response.data[0]?.reading_text;
      setHtmlData(readingText);
    } catch (error) {
      console.log('Error from reading material:', error);
    }
  };

  useEffect(() => {
    readingMaterial();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: '3%'}}>
      <WebView
        style={{height: 500}}
        source={{
          html: `
          <html>
          <body style="margin:0; padding:0;">
          <div style="font-family: Arial, sans-serif;">
          <h1 style="color: #2c3e50;">Gender in German Grammar</h1>
          <p>In German grammar, every noun has a gender. The three grammatical genders in German are:</p>
          <ul>
          <li style="color: #2980b9;">
          <strong>Masculine (der)</strong>
          </li><li style="color: #e74c3c;">
          <strong>Feminine (die)</strong>
          </li>
          <li style="color: #27ae60;">
          <strong>Neuter (das)</strong>
          </li>
          </ul>
          <h2 style="color: #2c3e50;">Examples of Gender</h2>
          <table style="width: 100%; border-collapse: collapse;">
          <thead><tr style="background-color: #ecf0f1;">
          <th style="border: 1px solid #bdc3c7; padding: 8px;">Gender</th>
          <th style="border: 1px solid rgb(189, 195, 199); padding: 8px; width: 20.7839%;">Article</th>
          <th style="border: 1px solid rgb(189, 195, 199); padding: 8px; width: 51.6627%;">Example</th>
          </tr>
          </thead>
          <tbody>
          <tr>
          <td style="border: 1px solid #bdc3c7; padding: 8px; color: #2980b9;">Masculine</td>
          <td style="border: 1px solid rgb(189, 195, 199); padding: 8px; width: 20.7839%;">der</td>
          <td style="border: 1px solid rgb(189, 195, 199); padding: 8px; width: 51.6627%;">der Mann (the man)</td>
          </tr><tr><td style="border: 1px solid #bdc3c7; padding: 8px; color: #e74c3c;">Feminine</td>
          <td style="border: 1px solid rgb(189, 195, 199); padding: 8px; width: 20.7839%;">die</td>
          <td style="border: 1px solid rgb(189, 195, 199); padding: 8px; width: 51.6627%;">die Frau (the woman)</td>
          </tr><tr><td style="border: 1px solid #bdc3c7; padding: 8px; color: #27ae60;">Neuter</td>
          <td style="border: 1px solid rgb(189, 195, 199); padding: 8px; width: 20.7839%;">das</td>
          <td style="border: 1px solid rgb(189, 195, 199); padding: 8px; width: 51.6627%;">das Kind (the child)</td>
          </tr></tbody></table><h2 style="color: #2c3e50;">Usage and Tips</h2>
          <p>Unlike some other languages, the gender of a noun in German is not always intuitive and does not necessarily correspond to the apparent gender of the object it describes. Here are some tips to help you remember the genders:</p>
          <ul>
          <li style="padding: 5px;">Memorize the gender along with the noun. For example, instead of learning &quot;Haus&quot; (house), learn &quot;das Haus&quot;.</li>
          <li style="padding: 5px;">Use mnemonic devices to remember tricky nouns.</li>
          <li style="padding: 5px;">Practice with articles to get used to the gendered forms.</li>
          </ul><h2 style="color: #2c3e50;">Common Gender Patterns</h2>
          <p>
          <br>
          </p>
          <p>While there are exceptions, many German nouns follow certain patterns that can help you determine their gender:</p>
          <ul>
          <li style="padding: 5px;">
          <strong>Masculine:</strong>
          Nouns ending in -er, -en, -el are often masculine.</li>
          <li style="padding: 5px;">
          <strong>Feminine:</strong> 
          Nouns ending in -e, -heit, -keit, -ung tend to be feminine.</li>
          <li style="padding: 5px;">
          <strong>Neuter:</strong> 
          Nouns ending in -chen, -lein (diminutives) are usually neuter.</li>
          </ul>
          </div>
        </body>
          </html>
        `,
        }}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});

{
  /* <View style={{flex: 1, height: 800}}>
     <WebView originWhitelist={['*']} source={{html: htmlData}} />
    </View> */
}
