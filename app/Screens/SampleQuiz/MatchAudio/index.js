import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  LogBox,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import Animated, {SlideInRight, SlideInLeft} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from './../../../utils/axiosInstance/index';
import AudioPlayer from '../components/Audio';

const JumbledSentences = ({
  item,
  index,
  isVisited,
  selectedAnswer,
  onAnswerSelect,
}) => {
  const [leftLabelsData, setLeftLabelsData] = useState([]);
  const [rightLabelsData, setRightLabelsData] = useState([]);
  const [loading, setLoading] = useState(false);

  LogBox.ignoreAllLogs();

  useEffect(() => {
    if (item.matchAnswerLeft || item.matchAnswerRight) {
      getLabelsData(item.id);
    }
  }, [item.matchAnswerLeft, item.matchAnswerRight]);

  const getLabelsData = async data => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/match/match-question/${data}`);
      setLeftLabelsData(response.data.leftData);
      setRightLabelsData(response.data.rightData);
    } catch (error) {
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

  const onLeftDragEnd = useCallback(({data}) => {
    const userJumbledData = data.map(item => item.value);
    const rightAnswers = rightLabelsData.map(item => item.value);

    const matchAnswer = {
      matchUserAnswerLeft: userJumbledData,
      matchUserAnswerRight: rightAnswers,
    };

    onAnswerSelect(item.id, matchAnswer);
    setLeftLabelsData(data);
  }, []);

  const onRightDragEnd = useCallback(({data}) => {
    const userJumbledData = data.map(item => item.value);
    const leftAnswers = leftLabelsData.map(item => item.value);

    const matchAnswer = {
      matchUserAnswerLeft: leftAnswers,
      matchUserAnswerRight: userJumbledData,
    };

    onAnswerSelect(item.id, matchAnswer);
    setRightLabelsData(data);
  }, []);

  const ListHeaderComponent = useCallback(
    () => (
      <View className="mb-8 flex-row items-start gap-2">
        <Text className="text-lg text-p1 font-bold uppercase tracking-wider">
          {index + 1}
        </Text>
        <Text className="text-xl font-bold text-n0">{item.question}</Text>
        <View className="flex-row items-center gap-2">
          <AudioPlayer source={{uri: item.audioURL}} />
        </View>
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
        <View>

          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={ListHeaderComponent}
            // horizontal
            numColumns={2}
            data={[
              {key: 'left', data: leftLabelsData},
              {key: 'right', data: rightLabelsData}
            ]}
            renderItem={({item: columnData}) => (
              <View style={{width: (Dimensions.get('window').width - 48) / 2}}>
                <DraggableFlatList
                  data={columnData.data}
                  onDragEnd={columnData.key === 'left' ? onLeftDragEnd : onRightDragEnd}
                  keyExtractor={item => item.value}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
            keyExtractor={item => item.key}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 170}}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(JumbledSentences);
