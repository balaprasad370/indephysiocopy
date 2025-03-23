import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../theme/AppContext';
import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../../Components/axiosInstance';
import moment from 'moment';
import {io} from 'socket.io-client';
import {supportSocketEndPoint} from '../../Constants/config';

const TicketDetails = () => {
  const {isDark} = useContext(AppContext);
  const navigation = useNavigation();
  const route = useRoute();
  const {ticketId} = route.params || {};
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [newReply, setNewReply] = useState('');
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef(null);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(supportSocketEndPoint);
    socket.current?.emit('join_room', 'Meduniverse' + ticketId);

    socket.current?.on('ticket_reply', data => {
      // update the ticket with the new reply

      // The ticket is null here because this effect runs only once on component mount
      // but ticket is loaded asynchronously after the component mounts
      // We need to include ticket in the dependency array to re-establish the socket
      // listener whenever ticket changes

      console.log('ticket', ticket);
      console.log('data', data);

      // Only update if ticket exists
      if (ticket) {
        const updatedTicket = {
          ...ticket,
          communications: [...ticket.communications, data],
        };

        setTicket(updatedTicket);
      }
    });

    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [ticketId, ticket]); // Add ticket to dependency array to ensure socket handler has latest ticket data

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch the ticket details from an API
      const response = await axiosInstance.get(`/tickets/${ticketId}`);
      setTicket(response.data);

      // console.log('response.data', response.data);

      // Using dummy data for now
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load ticket details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!newReply.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setSending(true);
    try {
      //send an api call to send the reply
      const response = await axiosInstance.post(`/tickets/${ticketId}/reply`, {
        message: newReply,
      });

      setNewReply('');
      setSending(false);
    } catch (error) {
      console.error('Error sending reply:', error);
      setSending(false);
      Alert.alert('Error', 'Failed to send your reply. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatDate = dateString => {
    return moment(dateString * 1000).format('DD-MM-YYYY hh:mm A');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="relative pb-4">
          <View className="absolute w-full top-0 left-0 right-0">
            <Image
              source={topBgBackground}
              className="w-full h-[200px] -mt-24"
              resizeMode="cover"
              onError={() => console.warn('Failed to load background image')}
              accessible={false}
            />
          </View>
          <PageTitle pageName="Ticket Details" />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-600 dark:text-gray-300 mt-2">
            Loading ticket details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="relative pb-4">
          <View className="absolute w-full top-0 left-0 right-0">
            <Image
              source={topBgBackground}
              className="w-full h-[200px] -mt-24"
              resizeMode="cover"
              onError={() => console.warn('Failed to load background image')}
              accessible={false}
            />
          </View>
          <PageTitle pageName="Ticket Details" />
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons
            name="alert-circle-outline"
            size={50}
            color={isDark ? '#FFFFFF' : '#6366f1'}
          />
          <Text className="text-gray-600 dark:text-gray-300 mt-4 text-center">
            Ticket not found or an error occurred.
          </Text>
          <TouchableOpacity
            className="mt-4 bg-indigo-600 py-2 px-4 rounded-lg"
            onPress={() => navigation.goBack()}>
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isResolved = ticket.status.toLowerCase() === 'resolved';

  const renderMessage = ({item}) => {
    return (
      <View
        key={item.id}
        className={`mb-3 p-3 rounded-lg ${
          item.sender === 'user'
            ? 'bg-b50 dark:bg-indigo-900 ml-8 w-2/3 self-end'
            : 'bg-gray-300 dark:bg-gray-800 mr-8 w-2/3 self-start'
        }`}>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="font-medium text-gray-800 dark:text-white">
            {item.sender === 'user' ? 'You' : 'Support Team'}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-xs">
            {formatDate(item.timestamp)}
          </Text>
        </View>
        <Text className="text-gray-700 dark:text-gray-300">{item.message}</Text>
        {item.sender === 'support' && item.supportName && (
          <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1 italic">
            {item.supportName}
          </Text>
        )}
      </View>
    );
  };

  const headerComponent = () => {
    return (
      <>
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="font-bold text-gray-800 dark:text-white text-lg flex-1 mr-2">
              {ticket.title}
            </Text>
            {isResolved ? (
              <View className="bg-green-100 p-1 rounded-full">
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              </View>
            ) : (
              <View className="bg-yellow-100 p-1 rounded-full">
                <Ionicons name="time-outline" size={20} color="#f59e0b" />
              </View>
            )}
          </View>

          <View className="flex-row flex-wrap mb-3">
            <View className="mr-4 mb-2">
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Type
              </Text>
              <Text className="text-gray-700 dark:text-gray-300">
                {ticket.type}
              </Text>
            </View>
            <View className="mr-4 mb-2">
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Status
              </Text>
              <Text
                className={`${
                  isResolved ? 'text-green-600' : 'text-yellow-600'
                }`}>
                {ticket.status}
              </Text>
            </View>
            <View className="mb-2">
              <Text className="text-gray-500 dark:text-gray-400 text-xs">
                Opened On
              </Text>
              <Text className="text-gray-700 dark:text-gray-300">
                {formatDate(ticket.ticket_timestamp)}
              </Text>
            </View>
          </View>

          {isResolved && (
            <View className="mb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
              <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                Resolved On
              </Text>
              <Text className="text-gray-700 dark:text-gray-300">
                {formatDate(ticket.resolved_at)}
              </Text>
            </View>
          )}
          <View className="mb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
            <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">
              Attachment
            </Text>
            {ticket.file_path ? (
              <TouchableOpacity
                onPress={() => Linking.openURL(ticket.file_path)}>
                <View className="flex-row items-center">
                  <Ionicons
                    name="document-outline"
                    size={20}
                    color={isDark ? '#FFFFFF' : '#6366f1'}
                  />
                  <Text className="text-indigo-600 dark:text-indigo-400 ml-2 underline">
                    {ticket.file_path.split('/').pop()}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text className="text-gray-700 dark:text-gray-300 italic">
                No file attached
              </Text>
            )}
          </View>
        </View>

        <Text className="font-bold text-gray-800 dark:text-white text-base mb-3">
          Communication
        </Text>
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="relative pb-4">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
            onError={() => console.warn('Failed to load background image')}
            accessible={false}
          />
        </View>
        <PageTitle pageName="Ticket Details" />
      </View>

      <View className="flex-1 px-2">
        {ticket && (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={ticket?.communications || []}
            renderItem={renderMessage}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{paddingTop: 16}}
            ListHeaderComponent={headerComponent}
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({animated: true})
            }
          />
        )}

        <View className="h-20" />
      </View>

      {!isResolved && (
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
          <View className="flex-row items-center pb-4">
            <TextInput
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 text-gray-800 dark:text-white mr-2 pl-4"
              placeholder="Type your reply..."
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={newReply}
              onChangeText={setNewReply}
              style={{maxHeight: 100}}
              multiline={true}
            />
            <TouchableOpacity
              className={`p-2 rounded-full ${
                sending ? 'bg-gray-400' : 'bg-indigo-600'
              }`}
              onPress={handleSendReply}
              disabled={sending}>
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="send" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default TicketDetails;
