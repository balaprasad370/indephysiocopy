import {
  Alert,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import color from '../../Constants/color';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign';
import {styles} from './QuizStyle';
import {TextInput} from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import AudioComponent from './AudioComponent';
import {AppContext} from '../../theme/AppContext';
import CustomModal from './QuizModal';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';

const Index = ({Title, secondOption, cardURL, optionClick}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [room, onChangeRoom] = useState('meeting');

  const navigation = useNavigation();

  const toggleModal = option => {
    console.log(option);
    if (option === 'Quiz') {
      setModalVisible(!modalVisible);
    } else if (option === 'Reading') {
      navigation.navigate(ROUTES.READING);
    } else if (option === 'Live') {
      navigation.navigate('Meeting', {room});
    }
  };

  {
    /* <Button
        color="blue"
        disabled={!room}
        // @ts-ignore
        onPress={() => navigation.navigate('Meeting', {room})}
        // @ts-ignore
        style={{height: 32, width: 32}}
        title="Join"
      /> */
  }

  return (
    <View style={styles.quizs}>
      <View style={styles.quizLayout}>
        <TouchableOpacity
          style={styles.quizBox}
          onPress={() => toggleModal(`${optionClick}`)}>
          <View style={styles.middleBox}>
            <Image style={styles.quizMinorBox} src={cardURL} />
            <Text style={styles.quizQuestion}>{Title}</Text>
            <Text style={styles.questionCount}>{secondOption}</Text>
            <View></View>
          </View>
        </TouchableOpacity>
      </View>
      <CustomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        toggleModal={toggleModal}
      />
    </View>
  );
};

export default Index;
