import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  searchBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInnerBox: {
    ...Platform.select({
      ios: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#898A89',
        padding: 2,
      },
      android: {
        display: 'flex',
        flexDirection: 'row',
        width: '80%',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#898A89',
        padding: 2,
      },
    }),
  },
  searchIcon: {fontSize: 26, color: '#898A89', fontWeight: '800'},
  searchInput: {
    ...Platform.select({
      ios: {
        width: '85%',
        backgroundColor: 'transparent',
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 10,
        paddingTop: 10,
      },
      android: {
        width: '85%',
        backgroundColor: 'transparent',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 8,
        paddingTop: 8,
      },
    }),
  },
});
