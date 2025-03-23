import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useMemo, useCallback } from 'react'
import Animated, { SlideInRight, SlideInLeft } from 'react-native-reanimated'

const Normal = ({item, index, isVisited, selectedAnswer, onAnswerSelect}) => {
  const [selectedOption, setSelectedOption] = useState(selectedAnswer)

  // Memoize options array to prevent recreation on each render
  const options = useMemo(() => {
    return [
      { id: 1, text: item.option1 },
      { id: 2, text: item.option2 }, 
      { id: 3, text: item.option3 },
      { id: 4, text: item.option4 },
      { id: 5, text: item.option5 },
      { id: 6, text: item.option6 },
      { id: 7, text: item.option7 },
      { id: 8, text: item.option8 },
      { id: 9, text: item.option9 },
      { id: 10, text: item.option10 },
      { id: 11, text: item.option11 },
      { id: 12, text: item.option12 }
    ].filter(option => option.text !== null && option.text !== undefined && option.text !== '')
  }, [item]) // Only recreate if item changes

  // Memoize onPress handler
  const handleOptionPress = useCallback((optionId) => {
    setSelectedOption(optionId)
    onAnswerSelect(item.id, optionId)
  }, [item.id, onAnswerSelect])

  // Memoize animation entering prop calculation
  const getEnteringAnimation = useCallback((idx) => {
    if (isVisited) return null
    return idx % 2 === 0 
      ? SlideInLeft.duration(400).delay(300 + (idx * 100))
      : SlideInRight.duration(400).delay(300 + (idx * 100))
  }, [isVisited])

  return (
    <ScrollView 
    contentContainerStyle={{paddingBottom: 20}}
    className="bg-white px-4 rounded-md mb-20" key={`${index}-${item.id}`}>
      <View className="mb-8 flex-row items-start justify-start gap-2">
        <Text className="text-lg text-p1 font-bold uppercase tracking-wider">
          {index + 1}
        </Text>
        <Text className="text-xl font-bold text-gray-900">
          {item.question}
        </Text>
      </View>

      <View className="space-y-4">
        {options.map((option, idx) => (
          <Animated.View
            key={`${index}-${option.id}`}
            entering={getEnteringAnimation(idx)}
          >
            <TouchableOpacity
              className={`p-5 rounded-xl border ${
                selectedOption === option.id 
                  ? "bg-b50 border-p1" 
                  : "bg-white border-gray-200"
              }`}
              onPress={() => handleOptionPress(option.id)}
            >
              <View className="flex-row items-center space-x-3">
                <View
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedOption === option.id
                      ? 'bg-p1 border-p1'
                      : 'border-gray-300'
                  }`}
                >
                  <View 
                    className={`w-2 h-2 rounded-full m-auto ${
                      selectedOption === option.id ? 'bg-white' : 'bg-transparent'
                    }`} 
                  />
                </View>
              
                <Text
                  className={`text-base flex-1 ${
                    selectedOption === option.id
                      ? 'text-p1 font-semibold'
                      : 'text-gray-600'
                  }`}>
                  {option.text}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  )
}

export default React.memo(Normal) // Prevent unnecessary re-renders
