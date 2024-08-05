import {Platform, StyleSheet} from 'react-native';
import color from '../../Constants/color';

export const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? '10%' : '0%',
    backgroundColor: '#FFF',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  quizs: {
    width: '50%',
    flexWrap: 'wrap',
    display: 'flex',
    flexDirection: 'row',
  },

  quizLayout: {
    width: '100%',
  },
  quizBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    margin: 7,
    backgroundColor: '#F6F5F2',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3.84,

    // Elevation for Android
    elevation: 5,
  },
  // quizBox: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'flex-start',
  //   margin: 7,
  //   backgroundColor: '#F6F5F2',

  //   borderRadius: 12,
  // },
  middleBox: {
    margin: 10,
  },
  quizMinorBox: {
    width: '100%',
    borderRadius: 12,
    height: 140,
    backgroundColor: '#FFF',
  },
  quizQuestion: {
    fontSize: 16,
    width: '90%',
    marginTop: 8,
    fontWeight: '500',
    color: color.black,
  },
  questionCount: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 8,
    color: color.black,
  },
});
