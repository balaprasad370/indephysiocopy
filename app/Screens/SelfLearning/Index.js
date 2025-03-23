import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {AppContext} from '../../theme/AppContext';
import QuizCard from '../../Components/QuizCard/Index';
import axios from 'axios';
import storage from '../../Constants/storage';
import Loading from '../../Components/Loading/Loading';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';

const {width, height} = Dimensions.get('window');

const ChapterContent = memo(({route, navigation}) => {
  const {parent_module_id, title = 'Contents', level_id} = route.params;
  const {path, loader, setLoader, packageId} = useContext(AppContext);

  const [content, setContent] = useState([]);

  // Memoize content item props calculation
  const getContentItemProps = useCallback(
    item => ({
      Title:
        item?.flashcard_name || item?.title || item?.name || item?.title_live,
      secondOption:
        item?.flashcard_description ||
        item?.description ||
        item?.description_live,
      parent_module_id,
      optionClick: item?.read_id
        ? 'Reading Material'
        : item?.flash_id
        ? 'Flash Card'
        : item?.schedule_live_class_id
        ? 'Live class'
        : item?.type === 'assessments'
        ? 'Assessments'
        : 'Quiz',
      unique_id: item?.read_id || item?.flash_id || item?.id,
      status: item?.status,
      room_name: item?.room_name,
      video_url: item?.video_url,
      order_id: item?.order_id,
      time_spent: item?.time_spent,
      locked: item?.locked,
      subscription_status: item?.subscription_status,
      live_class_end_date: item?.live_class_end_date,
      level_id,
    }),
    [parent_module_id, level_id],
  );

  // Memoized content item component
  const ContentItem = useMemo(
    () =>
      memo(
        ({item}) => <QuizCard {...getContentItemProps(item)} />,
        (prevProps, nextProps) =>
          prevProps.item.unique_index === nextProps.item.unique_index,
      ),
    [getContentItemProps],
  );

  // Memoized API call with error handling and cleanup
  const fetchContent = useCallback(async () => {
    if (loader) return;

    let isMounted = true;
    setLoader(true);

    try {
      const token = await storage.getStringAsync('token');
      const response = await axios({
        method: 'get',
        url: `${path}/student/v7/${parent_module_id}`,
        params: {package_id: packageId},
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (isMounted) {
        console.log('response.data', response.data);
        setContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      if (isMounted) {
        setLoader(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [parent_module_id, packageId, path, loader, setLoader]);

  useEffect(() => {
    navigation.setOptions({title});
    const unsubscribe = navigation.addListener('focus', fetchContent);
    return unsubscribe;
  }, [navigation, title, fetchContent]);

  const keyExtractor = useCallback(item => item.unique_index.toString(), []);

  const renderItem = useCallback(
    ({item}) => <ContentItem item={item} />,
    [ContentItem],
  );

  const getItemType = useCallback(item => item.type, []);

  const listMemo = useMemo(
    () => (
      <FlashList
        data={content}
        estimatedItemSize={240}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      />
    ),
    [content, renderItem, keyExtractor, getItemType],
  );

  if (loader) return <Loading />;

  return (
    <View className="flex-1 bg-b50">
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image source={topBgBackground} className="w-full h-[200px] -mt-24" />
        </View>
        <PageTitle pageName={title} />
      </View>

      {!content?.length ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-black">No content available</Text>
        </View>
      ) : (
        <View style={{flex: 1, width, height}}>{listMemo}</View>
      )}
    </View>
  );
});

export default ChapterContent;
