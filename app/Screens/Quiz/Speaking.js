import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import Voice from '@react-native-community/voice';
import color from '../../Constants/color';
import storage from '../../Constants/storage';
import {AppContext} from '../../theme/AppContext';
import axios from 'axios';
import scale from '../../utils/utils';

export default function Speaking({
  item,
  score,
  setScore,
  questionIndex,
  inputValue,
  setInputValue,
}) {
  const {path} = useContext(AppContext);
  const [isListening, setIsListening] = useState(false);
  const [finalResult, setFinalResult] = useState('');
  const [partialResult, setPartialResult] = useState('');

  const [answer, setAnswer] = useState(inputValue[questionIndex]);
  const [submitted, setSubmitted] = useState(inputValue[questionIndex]);
  const [loading, setLoading] = useState(false);

  const handleSubmitForEvaluation = async () => {
    if (!answer.trim()) return;
    setInputValue(prevValues => ({
      ...prevValues,
      [questionIndex]: answer,
    }));

    try {
      setLoading(true);
      const token = await storage.getStringAsync('token');

      const response = await axios.post(
        `${path}/portal/student/conversation/writingevaluate`,
        {
          question_id: item.id,
          answer: answer.trim(),
          question: item.question,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Evaluation submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle final speech results
    function onSpeechResults(e) {
      if (e.value && e.value.length > 0) {
        const latestResult = e.value[e.value.length - 1];
        setFinalResult(latestResult);
        setPartialResult('');
      }
    }

    // Handle partial speech results
    function onSpeechPartialResults(e) {
      if (e.value && e.value.length > 0) {
        const latestPartial = e.value[e.value.length - 1];
        setPartialResult(latestPartial);
      }
    }

    // Handle speech end event
    function onSpeechEnd() {
      setIsListening(false);
    }

    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechEnd = onSpeechEnd;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecognizing = async () => {
    try {
      await Voice.start('de-DE'); // German language
      setIsListening(true);
      setFinalResult('');
      setPartialResult('');
    } catch (e) {
      console.error('Error starting voice recognition:', e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
      setIsListening(false);
      setPartialResult('');
    } catch (e) {
      console.error('Error canceling recognition:', e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      setIsListening(false);
      setFinalResult('');
      setPartialResult('');
    } catch (e) {
      console.error('Error destroying recognizer:', e);
    }
  };

  useEffect(() => {
    setAnswer(finalResult);
  }, [finalResult]);

  return (
    <View>
      <TouchableHighlight
        onPress={isListening ? stopRecognizing : startRecognizing}
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
          onPress={cancelRecognizing}
          style={{flex: 1, backgroundColor: color.darkPrimary}}>
          <Text style={styles.action}>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={destroyRecognizer}
          style={{flex: 1, backgroundColor: color.darkPrimary}}>
          <Text style={styles.action}>Destroy</Text>
        </TouchableHighlight>
      </View>

      <Text style={styles.stat}>
        Status: {isListening ? 'Listening...' : 'Not listening'}
      </Text>

      <ScrollView>
        {/* {partialResult ? (
          <Text style={[styles.stat, {color: 'gray'}]}>
            Partial: {partialResult}
          </Text>
        ) : null} */}
        {finalResult ? (
          <Text style={styles.stat}>Final: {finalResult}</Text>
        ) : null}
      </ScrollView>
      <TouchableOpacity
        onPress={handleSubmitForEvaluation}
        style={[styles.submitButton, submitted && styles.submittedButton]}
        disabled={submitted}>
        <Text style={styles.buttonText}>
          {submitted ? 'Submitted' : 'Submit for evaluation'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  action: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 8,
    marginVertical: 5,
    fontWeight: 'bold',
  },
  stat: {
    display: 'flex',
    flexDirection: 'row',
    color: color.darkPrimary,
    marginTop: 10,
    marginBottom: 1,
  },
  submitButton: {
    backgroundColor: color.darkPrimary,
    paddingVertical: scale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    marginTop: scale(16),
    alignSelf: 'flex-end',
    elevation: 3,
    shadowColor: color.lighGrey,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submittedButton: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: color.white,
    fontSize: scale(16),
    fontWeight: '600',
  },
  loader: {
    marginTop: scale(16),
  },
});
