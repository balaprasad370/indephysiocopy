import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import scale from '../../utils/utils';
const TableComponent = () => {
  const tableData = [
    ['', 'Superfast', 'Express', 'Professional', 'UG Finals', 'UG Dreamers'],
    [
      'Duration (of job placement)',
      '6 Months',
      '1 year',
      '18 months',
      '6 months after graduation',
      '6 months after graduation',
    ],
    [
      'Consultancy Fee',
      '1,49,999/-',
      '69,999/-',
      '34,999/-',
      '14,999/-',
      '2499',
    ],
    ['Monthly', '9,999/-', '7,499/-', '3,499/-', '1499/-', '499/-'],
    ['Translation', '$30/page', '$30/page', '$30/page', '$30/page', '$30/page'],
    [
      'Application',
      '20k - 40k',
      '20k - 40k',
      '20k - 40k',
      '20k - 40k',
      '20k - 40k',
    ],
    [
      'Job Placement fee',
      '599$ after 1st month salary',
      '599$ after 1st month salary',
      '599$ after 1st month salary',
      '599$ after 1st month salary',
      '599$ after 1st month salary',
    ],
  ];

  return (
    <View>
      {tableData.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <Text key={cellIndex} style={styles.cell}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: scale(6),
    backgroundColor: '#f1f4f8',
    borderWidth: 1,
    fontSize: 10,
    borderColor: 'white',
  },
});

export default TableComponent;
