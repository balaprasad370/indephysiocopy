import { View, Text, TextInput, ScrollView } from 'react-native'
import { useState, useCallback, useEffect } from 'react'

const index = ({item, index, selectedAnswer, onAnswerSelect}) => {
  const [text, setText] = useState(selectedAnswer || '')

  const handleTextChange = (newText) => {
    setText(newText)
    onAnswerSelect(item?.id, newText)
  }

  if (!item) {
    return (
      <View className="bg-white rounded-xl p-4">
        <Text className="text-lg font-medium text-red-500">
          Invalid Question Type: Question data is missing or corrupted
        </Text>
      </View>
    )
  }
  
  return (
    <ScrollView 
    contentContainerStyle={{paddingBottom: 20}}
    className="bg-white rounded-xl p-4">
      <View className="mb-8 flex-row items-start justify-start gap-2">
        <Text className="text-lg text-p1 font-bold uppercase tracking-wider">
          {index + 1}
        </Text>
        <Text className="text-xl font-bold text-gray-900">
          {item.question}
        </Text>
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
          padding: 12
        }}
        placeholder="Write your answer here..."
      />
    </ScrollView>
  )
}

export default index