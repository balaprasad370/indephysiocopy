// import {
//   ActivityIndicator,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
// } from 'react-native';
// import React, {useContext, useState} from 'react';
// import storage from '../../Constants/storage';
// import axios from 'axios';
// import scale from '../../utils/utils';
// import color from '../../Constants/color';
// import {AppContext} from '../../theme/AppContext';

// const Evaluate = ({item, questionIndex}) => {
//   const {path} = useContext(AppContext);
//   const [evaluate, setEvaluate] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmitForEvaluation = async (question_id, question, evaluate) => {
//     console.log('question_id', question_id);
//     console.log('question', question);
//     console.log('evaluate', evaluate);

//     const token = await storage.getStringAsync('token');
//     // console.log('token', token);

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${path}/portal/student/conversation/writingevaluate`,
//         {
//           question_id,
//           answer: evaluate,
//           question,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       console.log('Evaluation submitted successfully', response.data);
//       if (response.data.status) {
//         setSubmitted(true);
//       }
//     } catch (error) {
//       console.log('Error submitting for evaluation:', error.response.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//   <Text selectable={true} style={styles.quiztitle}>
//     Q{questionIndex + 1}) {item.question}
//   </Text>
//       <TextInput
//         style={{
//           borderWidth: 1,
//           borderColor: 'black',
//           borderRadius: 8,
//           marginTop: 10,
//           padding: 8,
//           height: 100,
//           textAlignVertical: 'top',
//           multiline: true,
//         }}
//         value={evaluate}
//         onChangeText={setEvaluate}
//         placeholder="Write your answer"
//         multiline={true}
//         numberOfLines={4}
//       />
//       {loading ? (
//         <ActivityIndicator
//           size="large"
//           color={color.darkPrimary}
//           style={{marginTop: 10}}
//         />
//       ) : submitted ? (
//         <TouchableOpacity
//           style={{
//             backgroundColor: color.darkPrimary,
//             padding: 10,
//             borderRadius: 8,
//             marginTop: 10,
//             display: 'flex',
//             alignItems: 'center',
//             alignSelf: 'flex-end',
//           }}>
//           <Text style={{color: 'white', fontSize: 18}}>Submitted</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity
//           onPress={() =>
//             handleSubmitForEvaluation(item.id, evaluate, item.question)
//           }
//           style={{
//             backgroundColor: color.darkPrimary,
//             padding: 10,
//             borderRadius: 8,
//             marginTop: 10,
//             display: 'flex',
//             alignItems: 'center',
//             alignSelf: 'flex-end',
//           }}>
//           <Text style={{color: 'white', fontSize: 18}}>
//             Submit for evaluation
//           </Text>
//         </TouchableOpacity>
//       )}
//     </>
//   );
// };

// export default Evaluate;

// const styles = StyleSheet.create({
//   quiztitle: {
//     fontSize: scale(14),
//     textAlign: 'justify',
//     color: 'black',
//     fontWeight: '500',
//   },
// });

import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {AppContext} from '../../theme/AppContext';
import storage from '../../Constants/storage';
import axios from 'axios';
import scale from '../../utils/utils';
import color from '../../Constants/color';

const Evaluate = ({item, questionIndex, inputValue, setInputValue}) => {
  const {path} = useContext(AppContext);
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
    console.log('inputValue', inputValue);
  }, [inputValue]);

  const renderQuestion = () => (
    <Text selectable={true} style={styles.quiztitle}>
      Q{questionIndex + 1}) {item.question}
    </Text>
  );

  const renderInput = () => (
    <TextInput
      style={styles.input}
      value={inputValue[questionIndex]}
      onChangeText={setAnswer}
      placeholder="Write your answer here..."
      placeholderTextColor={color.lighGrey}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
    />
  );

  const renderButton = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color={color.darkPrimary}
          style={styles.loader}
        />
      );
    }

    return (
      <TouchableOpacity
        onPress={handleSubmitForEvaluation}
        style={[styles.button, submitted && styles.submittedButton]}
        disabled={submitted}>
        <Text style={styles.buttonText}>
          {submitted ? 'Submitted' : 'Submit for evaluation'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {renderQuestion()}
      {renderInput()}
      {renderButton()}
    </>
  );
};

const styles = StyleSheet.create({
  question: {
    fontSize: scale(16),
    lineHeight: scale(24),
    color: '#1f2937',
    fontWeight: '500',
  },
  questionNumber: {
    fontWeight: '700',
    color: color.darkPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: color.lighGrey,
    borderRadius: scale(12),
    marginTop: scale(12),
    padding: scale(12),
    minHeight: scale(120),
    fontSize: scale(16),
    color: '#1f2937',
    backgroundColor: color.white,
    shadowColor: color.lighGrey,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
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
  quiztitle: {
    fontSize: scale(14),
    textAlign: 'justify',
    color: 'black',
    fontWeight: '500',
  },
});

export default Evaluate;
