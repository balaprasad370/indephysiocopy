// import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React from 'react';
// import notifee from '@notifee/react-native';

// const Index = () => {
//   const displayNotifications = async () => {
//     await notifee.requestPermission();

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//     });

//     // Display a notification
//     await notifee.displayNotification({
//       title: 'Notification Title',
//       body: 'Main body content of the notification',
//       android: {
//         channelId,
//         // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
//         // pressAction is needed if you want the notification to open the app when pressed
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   };
//   return (
//     <View style={{marginTop: 20, marginBottom: 20}}>
//       <TouchableOpacity onPress={() => displayNotifications()}>
//         <Text>Click me </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({});
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import storage from '../../Constants/storage';
import axios from 'axios';
import {AppContext} from '../../theme/AppContext';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import color from '../../Constants/color';
import {useNavigation} from '@react-navigation/native';

const Index = () => {
  const {path} = useContext(AppContext);
  const [groupedNotifications, setGroupedNotifications] = useState({});
  const navigation = useNavigation();

  const groupNotificationsByDate = notifications => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const grouped = {
      Today: [],
      Yesterday: [],
    };

    notifications.forEach(notification => {
      const modifiedDate = new Date(notification.modified_at);
      const dateKey = modifiedDate.toDateString();

      if (modifiedDate.toDateString() === today.toDateString()) {
        grouped.Today.push(notification);
      } else if (modifiedDate.toDateString() === yesterday.toDateString()) {
        grouped.Yesterday.push(notification);
      } else {
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(notification);
      }
    });

    return grouped;
  };

  const getNotification = async () => {
    const token = await storage.getStringAsync('token');

    if (token) {
      try {
        const response = await axios.get(`${path}/admin/v1/notifications`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedNotifications = response.data.notifications.sort(
          (a, b) => new Date(b.modified_at) - new Date(a.modified_at),
        );

        setGroupedNotifications(groupNotificationsByDate(sortedNotifications));
      } catch (error) {
        setGroupedNotifications({Today: [], Yesterday: []});
        console.log('error', error);
      }
    }
  };

  const notificationUpdate = async notificationId => {
    console.log('notificationId', notificationId);
    const token = await storage.getStringAsync('token');
    try {
      const response = await axios.post(
        `${path}/admin/v1/update-single-notification`,
        {notificationId},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getNotification();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      key={item.notification_id}
      onPress={
        item.notification_type == 0
          ? () => {
              notificationUpdate(item.notification_id);
              navigation.navigate('Meeting', {
                room: item.notification_url,
              });
            }
          : () => {
              notificationUpdate(item.notification_id);
              Linking.openURL(item.notification_url);
            }
      }>
      <LinearGradient
        colors={
          item.isOpened === false
            ? ['#ffffff', '#f0f0f5']
            : [color.darkPrimary, color.darkPrimary]
        }
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.notificationCard}>
        <View style={styles.iconContainer}>
          <Icon name="notifications-outline" size={20} color="#4b5d67" />
        </View>
        <View style={styles.textContainer}>
          <Text style={item.isOpened ? styles.title : styles.titleOpened}>
            {item.title}
          </Text>
          <Text
            style={
              item.isOpened ? styles.description : styles.descriptionOpened
            }
            numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={item.isOpened ? styles.time : styles.timeOpened}>
            {new Date(item.modified_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSection = (title, data) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.notification_id.toString()}
        scrollEnabled={false} // Disables individual FlatList scrolling
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {Object.keys(groupedNotifications).map(section =>
        groupedNotifications[section].length > 0
          ? renderSection(section, groupedNotifications[section])
          : null,
      )}
      {Object.values(groupedNotifications).every(
        section => section.length === 0,
      ) && <Text style={styles.emptyMessage}>No notifications available</Text>}
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#dde2e6',
    borderRadius: 15,
    padding: 6,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  titleOpened: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: 'white',
    marginBottom: 4,
  },
  descriptionOpened: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  time: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  timeOpened: {
    fontSize: 10,
    color: '#888',
    fontWeight: '500',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
    marginTop: 20,
  },
});
