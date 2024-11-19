// import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React, {useContext} from 'react';
// import color from '../../Constants/color';
// import Icon from 'react-native-vector-icons/Feather';
// import Action from 'react-native-vector-icons/SimpleLineIcons';
// import Download from 'react-native-vector-icons/Feather';
// import {AppContext} from '../../theme/AppContext';
// import {useNavigation} from '@react-navigation/native';

// const Index = ({webinar, setAdVisible}) => {
//   const {path} = useContext(AppContext);

//   const openWebsite = url => {
//     Linking.openURL(url).catch(err => console.log('Failed to open URL:', err));
//   };

//   const navigation = useNavigation();
//   return (
//     <>
//       {webinar && (
//         <TouchableOpacity
//           onPress={() => setAdVisible(true)}
//           style={{
//             backgroundColor: '#EE4E4E',
//             marginTop: 10,
//             width: '100%',
//             borderRadius: 10,
//             paddingVertical: 8,
//             paddingHorizontal: 12,
//           }}>
//           <View
//             style={{
//               display: 'flex',
//               flexDirection: 'row',
//               alignItems: 'center',
//             }}>
//             <Icon name="info" size={28} color="white" />
//             <View
//               style={{
//                 width: '91%',
//                 marginLeft: 7,
//                 display: 'flex',
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 justifyContent: 'space-between',
//               }}>
//               <View>
//                 {webinar && (
//                   <>
//                     <Text
//                       style={{color: 'white', fontWeight: '600', fontSize: 18}}>
//                       {webinar?.title.length > 28
//                         ? `${webinar?.title.substring(0, 28)}...`
//                         : webinar[0]?.title}
//                     </Text>
//                     <Text style={{color: 'rgba(257,257,257,0.8)'}}>
//                       {webinar?.description.length > 35
//                         ? `${webinar?.description.substring(0, 35)}...`
//                         : webinar?.description}
//                     </Text>
//                   </>
//                 )}
//               </View>
//               {webinar?.web_type == 2 ? (
//                 <TouchableOpacity
//                   onPress={() => {
//                     // navigation.navigate('Meeting', {
//                     //   room: webinar?.webinar_url,
//                     // });
//                     setAdVisible(false);
//                   }}>
//                   <Download name="download" size={25} color="white" />
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   onPress={() => {
//                     navigation.navigate('Meeting', {
//                       room: webinar?.webinar_url,
//                     });
//                     setAdVisible(false);
//                   }}>
//                   <Action name="action-redo" size={25} color="white" />
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         </TouchableOpacity>
//       )}
//     </>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({});
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import color from '../../Constants/color';

const AnnouncementBanner = ({webinar, setAdVisible}) => {
  const {path} = useContext(AppContext);
  const navigation = useNavigation();

  const openWebsite = url => {
    Linking.openURL(url).catch(err => console.log('Failed to open URL:', err));
  };

  return (
    <>
      {webinar && (
        <TouchableOpacity
          onPress={() => setAdVisible(true)}
          style={styles.container}>
          <LinearGradient
            colors={['#133E87', '#5B99C2', '#87A2FF']}
            // colors={['#3A1C71', color.darkPrimary, color.lowPrimary]}
            // colors={['#3A1C71', '#D76D77', '#FFAF7B']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientBackground}>
            {/* Decorative Overlay */}
            <View style={styles.overlay}>
              <View style={styles.circle1}></View>
              <View style={styles.circle2}></View>
              <View style={styles.circle3}></View>
            </View>

            <View style={styles.content}>
              <Icon
                name="megaphone-outline"
                size={32}
                color="white"
                style={styles.icon}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  {webinar?.title.length > 24
                    ? `${webinar?.title.substring(0, 24)}...`
                    : webinar?.title}
                </Text>
                <Text style={styles.description}>
                  {webinar?.description.length > 50
                    ? `${webinar?.description.substring(0, 50)}...`
                    : webinar?.description}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (webinar?.web_type == 0) {
                    navigation.navigate('Meeting', {
                      room: webinar?.notification_url,
                    });
                    setAdVisible(false);
                  } else if (webinar?.web_type == 1) {
                    Linking.openURL(webinar?.notification_url);
                    setAdVisible(false);
                  } else if (webinar?.web_type == 2) {
                    setAdVisible(false);
                  }
                }}
                style={styles.actionButton}>
                <Icon
                  name={
                    webinar?.web_type == 2
                      ? 'download-outline'
                      : 'arrow-forward-outline'
                  }
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  gradientBackground: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    opacity: 0.2,
  },
  circle1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  circle2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  circle3: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    position: 'absolute',
    top: 50,
    right: 80,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  actionButton: {
    padding: 5,
  },
});

export default AnnouncementBanner;
