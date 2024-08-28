import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';

import Cross from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/AntDesign';
import {AppContext} from '../../theme/AppContext';
import LighTheme from '../../theme/LighTheme';
import DarkTheme from '../../theme/Darktheme';
import {styles} from './DocumentCard';

const Index = ({isDone}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const {isDark, setIsDark} = useContext(AppContext);

  const style = isDark ? DarkTheme : LighTheme;

  return (
    <View>
      <TouchableOpacity
        onPress={toggleModal}
        style={isDone ? style.documentCard : style.documentLockCard}>
        <Text style={style.documentCardText}>Indephysio documents</Text>
        <View style={style.documentImage}></View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}>
        <ScrollView style={style.modalContainer}>
          <View>
            <TouchableOpacity
              onPress={toggleModal}
              style={{display: 'flex', alignItems: 'flex-end'}}>
              <Cross name="cross" style={style.cross} />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={style.documentModalText}>Documentation Name</Text>
            <Text style={style.updateDate}>Update date: dd/mm/yyyy</Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                marginTop: 30,
                width: '95%',
                height: 480,
                backgroundColor: '#9ac9ff',
                borderRadius: 20,
              }}></View>
          </View>
          <View
            style={{
              marginTop: 30,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#9ac9ff',
                width: '70%',
                height: 55,
                borderRadius: 50,
                position: 'relative',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  textAlign: 'center',
                }}>
                Download
              </Text>
              <View
                style={{
                  position: 'absolute',
                  right: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 48,
                  backgroundColor: 'white',
                  borderRadius: 30,
                  height: 50,
                  padding: 10,
                }}>
                <Icon name="download" style={{fontSize: 30}} />
              </View>
            </TouchableOpacity>
            <Text style={style.orAnd}>Or / and</Text>
            <TouchableOpacity style={styles.uploadBtn}>
              <View style={styles.uploadBox}>
                <Icon name="download" style={styles.rotateUpload} />
              </View>
              <Text style={styles.upload}>Upload</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default Index;
