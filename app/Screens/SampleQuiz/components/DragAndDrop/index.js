import { View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import React, { useState, useEffect } from 'react';

const DragAndDrop = ({ data, onReorder }) => {
  const [items, setItems] = useState(data);
  
  useEffect(() => {
    console.log("data", data);
    
  }, [data]);

  const renderItem = ({ item, drag, isActive, index }) => {
    console.log("item", item);
    
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          activeOpacity={0.8}
          className="bg-white p-4 mx-4 rounded-xl border border-gray-200 justify-center mb-2"
          style={{ height: 70 - 10 }}
        >
          <Text className="text-base text-gray-800 font-medium">{item.label}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        minHeight: items.length * 70 + 20,
        paddingBottom: 100
      }}
    >
      <DraggableFlatList
        data={items}
        onDragEnd={({ data }) => {
          setItems(data);
          if (onReorder) {
            console.log("data", data);
            onReorder(data);
          }
        }}
        keyExtractor={(item, index) => item.value?.toString() || index.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default React.memo(DragAndDrop);