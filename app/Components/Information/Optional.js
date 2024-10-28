import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import color from '../../Constants/color';

import Icon from 'react-native-vector-icons/Feather';
import Action from 'react-native-vector-icons/SimpleLineIcons';
import Cross from 'react-native-vector-icons/Entypo';

const Index = ({optionalData}) => {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      {toggle && optionalData && optionalData.length > 0 && (
        <TouchableOpacity
          style={{
            backgroundColor: color.darkPrimary,
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
                <Text style={{color: 'white', fontWeight: '600', fontSize: 18}}>
                  {/* Safe access to optionalData */}
                  {optionalData[0]?.info_title.length > 30
                    ? `${optionalData[0]?.info_title.substring(0, 30)}...`
                    : optionalData[0]?.info_title}
                </Text>
                <Text style={{color: 'rgba(257,257,257,0.8)'}}>
                  {optionalData[0]?.info_description.length > 40
                    ? `${optionalData[0]?.info_description.substring(0, 40)}...`
                    : optionalData[0]?.info_description}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity>
                  <Action name="action-redo" size={25} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setToggle(false)}>
                  <Cross name="cross" size={30} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default Index;

const styles = StyleSheet.create({});
