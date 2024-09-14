import React, {useCallback, useRef, useEffect} from 'react';
import {BackHandler, Alert} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
import {useNavigation} from '@react-navigation/native';

const Meeting = ({route}) => {
  const jitsiMeeting = useRef(null);
  const navigation = useNavigation();
  const {room} = route.params;

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
        customToolbarButtons: [
          {
            icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
            id: 'btn1',
            text: 'Button one',
          },
          {
            icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
            id: 'btn2',
            text: 'Button two',
          },
        ],
      }}
      eventListeners={eventListeners}
      flags={{
        'call-integration.enabled': true,
        'fullscreen.enabled': false,
        'invite.enabled': true,
        'pip.enabled': true,
        'pip-while-screen-sharing.enabled': true,
      }}
      ref={jitsiMeeting}
      style={{flex: 1}}
      room={room}
      serverURL={'https://meet.indephysio.com'}
    />
  );
};

export default Meeting;
