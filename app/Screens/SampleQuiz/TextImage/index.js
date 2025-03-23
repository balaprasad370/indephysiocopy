import {View, Text, TextInput, ScrollView} from 'react-native';
import {useState} from 'react';
import ImageViewer from '../components/Image';

const index = ({item, index, selectedAnswer, onAnswerSelect}) => {
  const [text, setText] = useState(selectedAnswer || '');

  const handleTextChange = newText => {
    try {
      setText(newText);
      onAnswerSelect(item?.id, newText);
    } catch (error) {
      console.error('Error handling text change:', error);
    }
  };

  if (!item) {
    return (
      <View className="bg-white rounded-xl p-4">
        <Text className="text-lg font-medium text-red-500">
          Invalid Question Type: Question data is missing or corrupted
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 80}}
      className="bg-white rounded-xl p-4">
      <View className="mb-8 flex-row items-start justify-start gap-2">
        <Text className="text-lg text-p1 font-bold uppercase tracking-wider">
          {index + 1}
        </Text>
        <Text className="text-xl font-bold text-gray-900">{item.question}</Text>
      </View>
      <View className="p-4">
        <ImageViewer source={{uri: item?.imageURL}} />
      </View>

      <TextInput
        multiline
        value={text}
        onChangeText={handleTextChange}
        style={{
          height: 100,
          textAlignVertical: 'top',
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          padding: 12,
          marginTop: 16,
        }}
        placeholder="Write your answer here..."
      />
    </ScrollView>
  );
};

export default index;
