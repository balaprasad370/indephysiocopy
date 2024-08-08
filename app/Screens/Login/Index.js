import React, {useContext, useState} from 'react';
import {Alert, FlatList, View, StyleSheet} from 'react-native';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthInput from '../../Components/InputFields/AuthInput';
import RememberField from '../../Components/InputFields/RememberField';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import LineAfterBtn from '../../Components/CommonLines/LineAfterBtn';
import SocialMediaButton from '../../Components/Buttons/SocialMediaButton';
import axios from 'axios';
import {ROUTES} from '../../Constants/routes';
import {AppContext} from '../../theme/AppContext';
import {useNavigation} from '@react-navigation/native';
import storage from '../../Constants/storage';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {setLoading} = useContext(AppContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://server.indephysio.com/login', {
        email,
        password,
        usertype: 'students',
      });
      if (response.status === 200) {
        console.log(response);
        Alert.alert('Success', 'Logged in successfully', [{text: 'OK'}]);
        await storage.setStringAsync('token', response.headers.authorization);
        await storage.setBoolAsync('isLoggedIn', true);
        setLoading(true);

        setEmail('');
        setPassword('');
        navigation.navigate(ROUTES.DASHBOARD);
      } else {
        Alert.alert('Error', 'Unexpected response status', [{text: 'OK'}]);
      }
    } catch (error) {
      Alert.alert('Error', error.message, [{text: 'OK'}]);
    }
  };

  const data = [
    {
      id: '1',
      component: <View style={{marginTop: '10%'}}></View>,
    },
    {
      id: '2',
      component: (
        <>
          <AuthTitle authTitle="Welcome to indephysio" />
          <AuthLine authLine="Please enter your info below to start using app." />
        </>
      ),
    },
    // {
    //   id: '2',
    //   component: (

    //   ),
    // },
    {
      id: '3',
      component: (
        <View>
          <AuthInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <AuthInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="Password"
          />
          <RememberField route={ROUTES.RECOVERY_PASSWORD} />
        </View>
      ),
    },
    // {
    //   id: '3',
    //   component: ,
    // },
    {
      id: '4',
      component: (
        <CommonButtonAuth handleData={handleLogin} buttonTitle="Sign in" />
      ),
    },
    {
      id: '5',
      component: (
        <LineAfterBtn
          lineBefore="Not a member?"
          secondBtn="Join Now"
          route={ROUTES.SIGNUP}
        />
      ),
    },
    {
      id: '6',
      component: <SocialMediaButton />,
    },
  ];

  return (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <View style={styles.itemContainer}>{item.component}</View>
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  itemContainer: {
    marginBottom: 10, // Adjust spacing as needed
  },
});

export default Index;
