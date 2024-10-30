import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import color from '../../Constants/color';
import Icon from 'react-native-vector-icons/Feather';
import Action from 'react-native-vector-icons/SimpleLineIcons';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';

const Index = ({webinar, setAdVisible}) => {
  const {path} = useContext(AppContext);

  const openWebsite = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  const navigation = useNavigation();
  return (
    <>
      {webinar && (
        <TouchableOpacity
          onPress={() => setAdVisible(true)}
          style={{
            backgroundColor: '#EE4E4E',
            marginTop: 10,
            width: '100%',
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name="info" size={28} color="white" />
            <View
              style={{
                width: '91%',
                marginLeft: 7,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View>
                {webinar && (
                  <>
                    <Text
                      style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                      {webinar?.title.length > 28
                        ? `${webinar?.title.substring(0, 28)}...`
                        : webinar[0]?.title}
                    </Text>
                    <Text style={{color: 'rgba(257,257,257,0.8)'}}>
                      {webinar?.description.length > 35
                        ? `${webinar?.description.substring(0, 35)}...`
                        : webinar?.description}
                    </Text>
                  </>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Meeting', {
                    room: webinar.webinar_url,
                    // room: 'ic2wYAPi7sqlUZKi',
                  });
                  setAdVisible(false);
                }}>
                <Action name="action-redo" size={25} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default Index;

const styles = StyleSheet.create({});
