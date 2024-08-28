import React, {useCallback, useRef, useState, useEffect} from 'react';
import {BackHandler, Alert} from 'react-native';
import {JitsiMeeting} from '@jitsi/react-native-sdk';
import {useNavigation} from '@react-navigation/native';
import PictureInPictureButton from '@jitsi/react-native-sdk/react/features/mobile/picture-in-picture/components/PictureInPictureButton';

const Meeting = ({route}) => {
  const jitsiMeeting = useRef(null);
  const navigation = useNavigation();
  const {room} = route.params;

  const onReadyToClose = useCallback(() => {
    jitsiMeeting.current.close();
    navigation.navigate('Home');
  }, [navigation]);

  const onEndpointMessageReceived = useCallback(() => {
    console.log('You got a message!');
  }, []);

  const eventListeners = {
    onReadyToClose,
    onEndpointMessageReceived,
    onEnterPictureInPicture,
  };

  const [newRoom, setNewRoom] = useState('meduni');

  // Handle back button press for PiP
  useEffect(() => {
    const backAction = () => {
      if (jitsiMeeting.current && jitsiMeeting.current.enterPictureInPicture) {
        jitsiMeeting.current.enterPictureInPicture();
      }
      return true; // Prevent navigating back to the home screen
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const onEnterPictureInPicture = () => {
    /* Custom logic when entering Picture-in-Picture mode */
    handlePiPMode();
    console.log('Entering Picture-in-Picture mode');
    // Perform any specific action you want here, like showing a message or updating state
  };

  // Assuming that PiP is automatically triggered, you can handle that logic elsewhere
  const handlePiPMode = () => {
    if (jitsiMeetViewRef.current) {
      jitsiMeetViewRef.current.enterPictureInPicture(); // Initiating PiP mode manually
      onEnterPictureInPicture(); // Triggering the custom function
    }
  };

  return (
    <JitsiMeeting
      config={{
        hideConferenceTimer: true,
        PictureInPictureEvent: {onEnterPictureInPicture},
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
      // onEnterPictureInPicture={onEnterPictureInPicture}
      flags={{
        'invite.enabled': true,
        'ios.screensharing.enabled': true,
      }}
      ref={jitsiMeeting}
      style={{flex: 1}}
      room={room}
      serverURL={'https://meet.indephysio.com'}
    />
  );
};

export default Meeting;
