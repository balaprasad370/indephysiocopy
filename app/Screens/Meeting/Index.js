// import React, {useCallback, useRef, useState} from 'react';

// import {JitsiMeeting} from '@jitsi/react-native-sdk';

// import {useNavigation} from '@react-navigation/native';
// import PictureInPictureButton from '@jitsi/react-native-sdk/react/features/mobile/picture-in-picture/components/PictureInPictureButton';

// const Meeting = ({route}) => {
//   const jitsiMeeting = useRef(null);
//   const navigation = useNavigation();

//   const {room} = route.params;

//   const onReadyToClose = useCallback(() => {
//     // @ts-ignore
//     navigation.navigate('Home');
//     // @ts-ignore
//     jitsiMeeting.current.close();
//   }, [navigation]);

//   const onEndpointMessageReceived = useCallback(() => {
//     console.log('You got a message!');
//   }, []);

//   const eventListeners = {
//     onReadyToClose,
//     onEndpointMessageReceived,
//   };

//   const [newRoom, setNewRoom] = useState('meeting');

//   return (
//     // @ts-ignore
//     <JitsiMeeting
//       config={{
//         hideConferenceTimer: true,
//         PictureInPictureButton: true,
//         customToolbarButtons: [
//           {
//             icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
//             id: 'btn1',
//             text: 'Button one',
//           },
//           {
//             icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
//             id: 'btn2',
//             text: 'Button two',
//           },
//         ],
//         pictureInPictureEnabled: true,
//       }}
//       eventListeners={eventListeners}
//       flags={{
//         'invite.enabled': true,
//         'ios.screensharing.enabled': true,
//       }}
//       ref={jitsiMeeting}
//       style={{flex: 1}}
//       room={room}
//       serverURL={'https://meet.indephysio.com'}
//     />
//   );
// };

// export default Meeting;

// import React, {useCallback, useRef, useState, useEffect} from 'react';
// import {BackHandler, Alert} from 'react-native';
// import {JitsiMeeting} from '@jitsi/react-native-sdk';
// import {useNavigation} from '@react-navigation/native';

// const Meeting = ({route}) => {
//   const jitsiMeeting = useRef(null);
//   const navigation = useNavigation();

//   const {room} = route.params;

//   const onReadyToClose = useCallback(() => {
//     // @ts-ignore
//     navigation.navigate('Home');
//     // @ts-ignore
//     jitsiMeeting.current.close();
//   }, [navigation]);

//   const onEndpointMessageReceived = useCallback(() => {
//     console.log('You got a message!');
//   }, []);

//   const eventListeners = {
//     onReadyToClose,
//     onEndpointMessageReceived,
//   };

//   const [newRoom, setNewRoom] = useState('paaras');

//   useEffect(() => {
//     const backAction = () => {
//       Alert.alert(
//         'Leave Meeting',
//         'Are you sure you want to leave the meeting?',
//         [
//           {
//             text: 'Cancel',
//             onPress: () => null,
//             style: 'cancel',
//           },
//           {text: 'YES', onPress: () => navigation.navigate('Home')},
//         ],
//       );
//       return true; // prevent default behavior (exiting the app)
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove(); // clean up the event listener
//   }, [navigation]);

//   return (
//     // @ts-ignore
//     <JitsiMeeting
//       config={{
//         hideConferenceTimer: true,
//         customToolbarButtons: [
//           {
//             icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
//             id: 'btn1',
//             text: 'Button one',
//           },
//           {
//             icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
//             id: 'btn2',
//             text: 'Button two',
//           },
//         ],
//       }}
//       eventListeners={eventListeners}
//       flags={{
//         'invite.enabled': true,
//         'ios.screensharing.enabled': true,
//       }}
//       ref={jitsiMeeting}
//       style={{flex: 1}}
//       room={room}
//       serverURL={'https://meet.indephysio.com'}
//     />
//   );
// };

// export default Meeting;

// import React, {useCallback, useRef, useState, useEffect} from 'react';
// import {BackHandler, Alert, Platform} from 'react-native';
// import {JitsiMeeting} from '@jitsi/react-native-sdk';
// import {useNavigation} from '@react-navigation/native';

// const Meeting = ({route}) => {
//   const jitsiMeeting = useRef(null);
//   const navigation = useNavigation();

//   const {room} = route.params;

//   const onReadyToClose = useCallback(() => {
//     // @ts-ignore
//     navigation.navigate('Home');
//     // @ts-ignore
//     jitsiMeeting.current.close();
//   }, [navigation]);

//   const onEndpointMessageReceived = useCallback(() => {
//     console.log('You got a message!');
//   }, []);

//   const eventListeners = {
//     onReadyToClose,
//     onEndpointMessageReceived,
//   };

//   const [newRoom, setNewRoom] = useState('meeting');

//   useEffect(() => {
//     const backAction = () => {
//       if (jitsiMeeting.current && jitsiMeeting.current.enterPictureInPicture) {
//         jitsiMeeting.current.enterPictureInPicture();
//       } else {
//         Alert.alert(
//           'Leave Meeting',
//           'Are you sure you want to leave the meeting?',
//           [
//             {
//               text: 'Cancel',
//               onPress: () => null,
//               style: 'cancel',
//             },
//             {text: 'YES', onPress: () => navigation.navigate('Home')},
//           ],
//         );
//       }
//       return true; // prevent default behavior (exiting the meeting)
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove(); // clean up the event listener
//   }, [navigation]);

//   return (
//     // @ts-ignore
//     <JitsiMeeting
//       config={{
//         hideConferenceTimer: true,
//         customToolbarButtons: [
//           {
//             icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
//             id: 'btn1',
//             text: 'Button one',
//           },
//           {
//             icon: 'https://w7.pngwing.com/pngs/987/537/png-transparent-download-downloading-save-basic-user-interface-icon-thumbnail.png',
//             id: 'btn2',
//             text: 'Button two',
//           },
//         ],
//         pictureInPictureEnabled: true, // Enable PiP mode
//       }}
//       eventListeners={eventListeners}
//       flags={{
//         'invite.enabled': true,
//         'ios.screensharing.enabled': true,
//         'pip.enabled': true, // Enable PiP mode
//       }}
//       ref={jitsiMeeting}
//       style={{flex: 1}}
//       room={room}
//       serverURL={'https://meet.indephysio.com'}
//     />
//   );
// };

// export default Meeting;

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
    navigation.navigate('Home');
    jitsiMeeting.current.close();
  }, [navigation]);

  const onEndpointMessageReceived = useCallback(() => {
    console.log('You got a message!');
  }, []);

  const onEnterPictureInPicture = useCallback(() => {
    console.log('Entering Picture-in-Picture mode');
    // You can perform any actions here when PiP mode is entered
  }, []);

  const eventListeners = {
    onReadyToClose,
    onEndpointMessageReceived,
    onEnterPictureInPicture,
  };

  const [newRoom, setNewRoom] = useState('meeting');

  // Handle back button press for PiP
  useEffect(() => {
    const backAction = () => {
      if (jitsiMeeting.current && jitsiMeeting.current.enterPictureInPicture) {
        jitsiMeeting.current.enterPictureInPicture();
      } else {
        Alert.alert(
          'Leave Meeting',
          'Are you sure you want to leave the meeting?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'YES', onPress: () => navigation.navigate('Home')},
          ],
        );
      }
      return true; // prevent default behavior (exiting the meeting)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // clean up the event listener
  }, [navigation]);

  return (
    <JitsiMeeting
      config={{
        hideConferenceTimer: true,
        PictureInPictureButton: true,
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
        pictureInPictureEnabled: true,
      }}
      eventListeners={eventListeners}
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
