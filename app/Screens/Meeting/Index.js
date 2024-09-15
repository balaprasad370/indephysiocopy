import React, {useCallback, useRef, useEffect, useContext} from 'react';
import {BackHandler, Alert} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../../theme/AppContext';

const Meeting = ({route}) => {
  const jitsiMeeting = useRef(null);
  const navigation = useNavigation();
  const {room} = route.params;
  const {userData} = useContext(AppContext);

  // Logic to handle when the meeting is ready to close
  const onReadyToClose = useCallback(() => {
    // Prevent meeting from closing automatically
    Alert.alert(
      'Leave Meeting',
      'Are you sure you want to leave the meeting?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => {
            if (jitsiMeeting.current) {
              jitsiMeeting.current.close();
            }
            navigation.navigate('Home');
          },
        },
      ],
      {cancelable: true},
    );
  }, [navigation]);

  // Handle receiving a message from another participant
  const onEndpointMessageReceived = useCallback(message => {
    Alert.alert('Message Received', `You received a message: ${message.text}`, [
      {text: 'OK'},
    ]);
    console.log('Message received:', message);
  }, []);

  // Event listeners for the Jitsi meeting
  const eventListeners = {
    onReadyToClose,
    onEndpointMessageReceived,
  };

  return (
    <JitsiMeeting
      config={{
        hideConferenceTimer: true,
      }}
      eventListeners={eventListeners}
      flags={{
        'call-integration.enabled': false,
        'fullscreen.enabled': true,
        'pip.enabled': true,
        'pip-while-screen-sharing.enabled': true,
        'security-options.enabled': false,
        'invite.enabled': false,
        'prejoinpage.enabled': false,
        'breakout-rooms.enabled': false,
      }}
      userInfo={{
        displayName: `${userData?.first_name} ${userData?.last_name}`,
        email: `${userData?.username}`,
      }}
      ref={jitsiMeeting}
      style={{flex: 1}}
      room={room}
      serverURL={'https://meet.indephysio.com'}
    />
  );
};

export default Meeting;
