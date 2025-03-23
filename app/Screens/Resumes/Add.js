import {View, TouchableOpacity, Text, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useState, useRef, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResumesEdit = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {resume_session_id} = route.params || {};
  const [webViewKey, setWebViewKey] = useState(1);
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  console.log('resume_session_id', resume_session_id);
  

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  return (
    <View style={{flex: 1}}>
      <View className="flex flex-row justify-end items-center p-2 bg-p1">
        <TouchableOpacity
          onPress={handleRefresh}
          style={{
            padding: 8,
            backgroundColor: '#f0f0f0',
            borderRadius: 5,
            marginRight: 10,
          }}>
          <Icon name="refresh" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
            backgroundColor: '#f0f0f0',
            borderRadius: 5,
          }}>
          <Icon name="close" size={24} />
        </TouchableOpacity>
      </View>
      <WebView
        ref={webViewRef}
        key={webViewKey}
        source={{
          uri: `https://resume.meduniverse.app/sessionnew.php?resume_session_id==${resume_session_id}`,
        }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        cacheEnabled={false}
        onError={() => setWebViewKey(webViewKey + 1)}
        onHttpError={() => setWebViewKey(webViewKey + 1)}
        onNavigationStateChange={navState => {
          console.log('navState', navState);

          console.log('Navigating to:', navState.url);
          setCanGoBack(navState.canGoBack);
        }}
      />
    </View>
  );
};

export default ResumesEdit;
