import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#3898fe',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  upload: {
    fontSize: 22,
    textAlign: 'center',
  },
  uploadBox: {
    position: 'absolute',
    left: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    backgroundColor: 'white',
    borderRadius: 30,
    height: 50,
    padding: 10,
  },
  uploadBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9ac9ff',
    width: '70%',
    height: 55,
    borderRadius: 50,
    position: 'relative',
  },
  rotateUpload: {fontSize: 30, transform: [{rotate: '180deg'}]},
});
