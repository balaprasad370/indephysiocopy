import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import Voice from '@react-native-community/voice';
import color from '../../Constants/color';

export default function TextToSpeech({item}) {
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [end, setEnd] = useState('');

  useEffect(() => {
    function onSpeechStart(e) {
      console.log('onSpeechStart: ', e);
      setStarted('√');
    }

    function onSpeechEnd(e) {
      console.log('onSpeechEnd: ', e);
      setEnd('√');
    }

    function onSpeechError(e) {
      console.log('onSpeechError: ', e);
      setError(JSON.stringify(e.error));
    }

    function onSpeechResults(e) {
      console.log('onSpeechResults: ', e);
      setResults(e.value);
    }

    function onSpeechPartialResults(e) {
      console.log('onSpeechPartialResults: ', e);
      setPartialResults(e.value);
    }

    function onSpeechVolumeChanged(e) {
      console.log('onSpeechVolumeChanged: ', e);
      setPitch(e.value);
    }

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const _startRecognizing = async () => {
    if (!Voice) {
      console.error('Voice is not initialized properly');
      return;
    }

    setPitch('');
    setError('');
    setStarted('');
    setResults([]);
    setPartialResults([]);
    setEnd('');

    try {
      await Voice.start('en-US');
      // await Voice.start('de-DE'); // Changed to German language
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }

    setPitch('');
    setError('');
    setStarted('');
    setResults([]);
    setPartialResults([]);
    setEnd('');
  };

  return (
    <View style={{}}>
      <TouchableHighlight
        onPress={_startRecognizing}
        style={{marginVertical: 20}}>
        <Image
          style={styles.button}
          source={{
            uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png',
          }}
        />
      </TouchableHighlight>

      <View style={{flexDirection: 'row'}}>
        <TouchableHighlight
          onPress={_stopRecognizing}
          style={{flex: 1, backgroundColor: color.darkPrimary}}>
          <Text style={styles.action}>Stop</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={_cancelRecognizing}
          style={{flex: 1, backgroundColor: color.darkPrimary}}>
          <Text style={styles.action}>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={_destroyRecognizer}
          style={{flex: 1, backgroundColor: color.darkPrimary}}>
          <Text style={styles.action}>Destroy</Text>
        </TouchableHighlight>
      </View>
      <Text style={styles.stat}>Results</Text>
      <ScrollView style={{}}>
        {results.map((result, index) => (
          <Text key={`result-${index}`} style={styles.stat}>
            {result}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: color.darkPrimary,
    marginTop: 10,
    marginBottom: 1,
  },
});
