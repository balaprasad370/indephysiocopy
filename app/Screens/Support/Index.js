import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import moment from 'moment';
import React, {useState, useContext, useEffect, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../../theme/AppContext';
import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from './../../Constants/routes';
import axios from 'axios';

import axiosInstance from './../../Components/axiosInstance';

const Index = () => {
  const {isDark} = useContext(AppContext);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('open');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tickets, setTickets] = useState({
    open: [],
    closed: [],
  });

 

  // Sample ticket data for initial UI rendering
  const sampleTickets = {
    open: [
      {
        id: 1,
        title: 'App crashes during quiz',
        type: 'Technical Problem',
        date: '2023-11-15',
      },
      {
        id: 2,
        title: 'Payment not reflecting in account',
        type: 'Billing Issue',
        date: '2023-11-12',
      },
      {
        id: 3,
        title: 'Unable to download study materials',
        type: 'Technical Problem',
        date: '2023-11-10',
      },
    ],
    closed: [
      {
        id: 4,
        title: 'Video playback issue resolved',
        type: 'Technical Problem',
        date: '2023-10-28',
        resolvedDate: '2023-11-05',
      },
      {
        id: 5,
        title: 'Account verification completed',
        type: 'Account Access',
        date: '2023-10-15',
        resolvedDate: '2023-10-20',
      },
      {
        id: 6,
        title: 'Refund processed successfully',
        type: 'Billing Issue',
        date: '2023-10-10',
        resolvedDate: '2023-10-18',
      },
    ],
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Open tickets API call
      const response = await axiosInstance.get('/v1/tickets');

      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error in fetchTickets:', error.response.data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const renderTicketItem = ({item}) => {
    return (
      <TouchableOpacity
        className={`bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm border border-gray-100 dark:border-gray-700`}
        onPress={() =>
          navigation.navigate(ROUTES.TICKET_DETAILS, {ticketId: item.ticket_id})
        }>
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-2">
            <Text className="font-bold text-gray-800 dark:text-white text-base">
              {item.title}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {item.type}
            </Text>
          </View>
          {activeTab === 'open' ? (
            <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Open
              </Text>
            </View>
          ) : (
            <View className="bg-green-100 p-1 rounded-full">
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            </View>
          )}
        </View>

        <View className="flex-row justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Text className="text-gray-500 dark:text-gray-400 text-xs">
            {activeTab === 'open'
              ? `Opened: ${moment(item.date * 1000).format('DD-MM-YYYY')}`
              : `Resolved: ${moment(item.resolvedDate * 1000).format(
                  'DD-MM-YYYY',
                )}`}
          </Text>
          <View className="flex-row items-center">
            <Ionicons
              name="chevron-forward"
              size={16}
              color={isDark ? '#FFFFFF' : '#6366f1'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View className="flex-1 justify-center items-center py-10">
      <Ionicons
        name={
          activeTab === 'open'
            ? 'document-text-outline'
            : 'checkmark-done-circle-outline'
        }
        size={50}
        color={isDark ? '#FFFFFF' : '#6366f1'}
      />
      <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
        {activeTab === 'open'
          ? "You don't have any open support tickets"
          : 'No resolved tickets yet'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-b50 dark:bg-gray-900">
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
        <PageTitle pageName="Support" />
      </View>

      <View className="px-4 py-4 flex-row justify-between items-center mb-4">
        <View className="flex-row bg-white dark:bg-gray-800 rounded-lg p-1">
          <TouchableOpacity
            className={`py-2 px-4 rounded-md ${
              activeTab === 'open' ? 'bg-p1 dark:bg-gray-700 shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('open')}>
            <Text
              className={`font-medium ${
                activeTab === 'open'
                  ? 'text-white dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
              Open
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-2 px-4 rounded-md ${
              activeTab === 'closed' ? 'bg-p1 dark:bg-gray-700 shadow-sm' : ''
            }`}
            onPress={() => setActiveTab('closed')}>
            <Text
              className={`font-medium ${
                activeTab === 'closed'
                  ? 'text-white dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
              Resolved
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-p1 p-2 rounded-full"
          onPress={() => navigation.navigate(ROUTES.RAISE)}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-600 dark:text-gray-300 mt-2">
            Loading tickets...
          </Text>
        </View>
      ) : (
        <FlatList
          data={tickets[activeTab]}
          renderItem={renderTicketItem}
          keyExtractor={item => item?.ticket_id?.toString()}
          contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 20}}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6366f1']}
              tintColor={isDark ? '#FFFFFF' : '#6366f1'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Index;
