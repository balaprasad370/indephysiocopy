import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import color from '../../Constants/color';
import Icon from 'react-native-vector-icons/Feather';
import Action from 'react-native-vector-icons/SimpleLineIcons';
import {AppContext} from '../../theme/AppContext';

const Index = ({informationData}) => {
  const {path} = useContext(AppContext);

  const openWebsite = url => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#EE4E4E',
        marginTop: 10,
        width: '100%',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}>
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
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
            {/* Check if informationData exists and has at least one item */}
            {informationData && informationData.length > 0 ? (
              <>
                <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                  {/* Title truncation */}
                  {informationData[0]?.info_title.length > 30
                    ? `${informationData[0]?.info_title.substring(0, 30)}...`
                    : informationData[0]?.info_title}
                </Text>
                <Text style={{color: 'rgba(257,257,257,0.8)'}}>
                  {/* Description truncation */}
                  {informationData[0]?.info_description.length > 40
                    ? `${informationData[0]?.info_description.substring(
                        0,
                        40,
                      )}...`
                    : informationData[0]?.info_description}
                </Text>
              </>
            ) : (
              <Text style={{color: 'white'}}>No information available</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => openWebsite(informationData[0]?.action)}>
            <Action name="action-redo" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Index;

const styles = StyleSheet.create({});
