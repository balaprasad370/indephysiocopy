import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, SafeAreaView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
import {FlashList} from '@shopify/flash-list';
import axiosInstance from './../../Components/axiosInstance';
import FAQItem from './components/FAQItem';

import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const toggleExpand = useCallback(
    index => {
      setExpandedIndex(expandedIndex === index ? null : index);
    },
    [expandedIndex],
  );

  const getFaqData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/faq');
      setFaqData(response.data);
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      setFaqData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFaqData();
  }, []);

  const keyExtractor = useCallback((_, index) => index.toString(), []);

  const renderEmptyList = () => (
    <View className="flex items-center justify-center py-10">
      <Ionicons
        name="help-circle-outline"
        size={50}
        color="#9ca3af"
      />
      <Text className="text-center mt-4 text-base text-gray-500">
        No FAQ items available
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-b50">
      <View className="relative pb-4">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
          />
        </View>
        <View className="flex-row justify-between items-center px-4">
          <PageTitle pageName="FAQ" />
        </View>
      </View>

      <View className="p-4 py-8 flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600">
              Loading FAQ...
            </Text>
          </View>
        ) : (
          <FlashList
            data={faqData}
            renderItem={({item, index}) => <FAQItem item={item} index={index} />}
            keyExtractor={keyExtractor}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
            ListEmptyComponent={renderEmptyList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FAQ;
