import { View, Text, TextInput, Alert, ScrollView } from 'react-native'
import { useState, useCallback, useEffect } from 'react'
import Clipboard from '@react-native-community/clipboard'

const index = ({item, index, isVisited, selectedAnswer, onAnswerSelect, selectedAnswers}) => {
  const [textHeight, setTextHeight] = useState(40)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [lastLength, setLastLength] = useState(0)

  // Initialize counts when selectedAnswer changes
  useEffect(() => {
    if (selectedAnswer) {
      setWordCount(selectedAnswer.trim().split(/\s+/).filter(word => word.length > 0).length)
      setCharCount(selectedAnswer.length)
      setLastLength(selectedAnswer.length)
    }
  }, [selectedAnswer])
  
  const handleContentSizeChange = useCallback((event) => {
    setTextHeight(Math.max(40, event.nativeEvent.contentSize.height))
  }, [])

  const handleTextChange = useCallback((text) => {
    // Check for pasting by comparing length differences
    const lengthDiff = Math.abs(text.length - lastLength)
    
    if (lengthDiff > 15) {
      Alert.alert(
        "Pasting Detected",
        "Pasting text is not allowed. Please type your answer.",
        [{ text: "OK" }]
      )
      return
    }

    setLastLength(text.length)
    onAnswerSelect(item?.id, text)
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length)
    setCharCount(text.length)
  }, [lastLength, item?.id, onAnswerSelect])

  if (!item) {
    return null
  }

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 20}}
      className="bg-white rounded-xl p-4">
      <Text className="text-lg font-medium mb-2">Question {index + 1}</Text>
      <Text className="mb-4">{item.question}</Text>
      <TextInput
        multiline
        value={selectedAnswer || ''}
        onChangeText={handleTextChange}
        style={{
          height: 300,
          textAlignVertical: 'top', 
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          padding: 12
        }}
        placeholder="Write your answer here..."
        contextMenuHidden={true} // Disable context menu with paste option
      />
      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-500">Words: {wordCount}</Text>
        <Text className="text-gray-500">Characters: {charCount}</Text>
      </View>
    </ScrollView>
  )
}

export default index