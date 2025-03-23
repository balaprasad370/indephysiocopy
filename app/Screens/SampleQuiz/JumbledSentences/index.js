import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  LogBox,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import Animated, {SlideInRight, SlideInLeft} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from './../../../utils/axiosInstance/index';

const JumbledSentences = ({
  item,
  index,
  isVisited,
  selectedAnswer,
  onAnswerSelect,
}) => {
  const [labelsData, setLabelsData] = useState([]);
  const [loading, setLoading] = useState(false);

  LogBox.ignoreAllLogs();

  useEffect(() => {
    getLabelsData(item.id);
  }, []);

  const getLabelsData = async data => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/jumbledSentences/match-question-single/${data}`,
      );

      if (!response.data?.status) {
        console.log('error', response.data);
      }

      if (!selectedAnswer) {
        setLabelsData(response.data.data);
      } else {
        let jumbledData = [];

        for (let i = 0; i < selectedAnswer.length; i++) {
          for (let j = 0; j < response.data?.data?.length; j++) {
            if (selectedAnswer[i] === response.data?.data[j]?.value) {
              jumbledData.push(response.data?.data[j]);
            }
          }
        }

        setLabelsData(jumbledData);
      }
    } catch (error) {
      console.log('error', error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = useCallback(({item: sentence, drag, isActive}) => {
    return (
      <ScaleDecorator activeScale={1.02}>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={{
            padding: 16,
            marginBottom: 8,
            marginHorizontal: 4,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isActive ? '#613BFF' : '#E5E7EB',
            backgroundColor: isActive ? '#EFEBFF' : '#ffffff',
            elevation: isActive ? 3 : 1,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: isActive ? 0.25 : 0.1,
            shadowRadius: isActive ? 3 : 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: '#1F2937',
                flex: 1,
                marginRight: 12,
                fontWeight: '400',
              }}>
              {sentence.label}
            </Text>
            <TouchableOpacity onLongPress={drag}>
              <Icon name="drag" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, []);

  const onDragEnd = useCallback(({data}) => {
    const userJumbledData = data.map(item => item.value);
    onAnswerSelect(item.id, userJumbledData);
    setLabelsData(data);
  }, []);

  const ListHeaderComponent = useCallback(
    () => (
      <View className="mb-8 flex-row items-start gap-2">
        <Text className="text-lg text-p1 font-bold uppercase tracking-wider">
          {index + 1}
        </Text>
        <Text className="text-xl font-bold text-n0">{item.question}</Text>
      </View>
    ),
    [index],
  );

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 70,
        borderRadius: 6,
        height: Dimensions.get('window').height - 150,
      }}>
      {loading ? (
        <ActivityIndicator size="large" color="#613BFF" />
      ) : (
        labelsData.length > 0 && (
          <DraggableFlatList
            data={labelsData}
            onDragEnd={onDragEnd}
            keyExtractor={item => item.value}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            showsVerticalScrollIndicator={false}
          />
        )
      )}
    </View>
  );
};

export default React.memo(JumbledSentences);
