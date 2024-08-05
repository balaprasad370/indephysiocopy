// import {Alert, StyleSheet, Text, View} from 'react-native';
// import React, {useContext, useState} from 'react';
// import AuthInput from '../../Components/InputFields/AuthInput';
// import AuthLine from '../../Components/CommonLines/AuthLine';
// import AuthTitle from '../../Components/CommonLines/AuthTitle';
// import RememberField from '../../Components/InputFields/RememberField';
// import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
// import LineAfterBtn from '../../Components/CommonLines/LineAfterBtn';
// import SocialMediaButton from '../../Components/Buttons/SocialMediaButton';
// import {ROUTES} from '../../Constants/routes';
// import {useNavigation} from '@react-navigation/native';
// import {AppContext} from '../../theme/AppContext';
// import axios from 'axios';
// import storage from '../../Constants/storage';

// const Index = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const {isDark, setIsDark, setUserLogged, isLoading, setLoading} =
//     useContext(AppContext);

//   const navigation = useNavigation();

//   const handleSignup = async () => {
//     try {
//       const response = await axios
//         .post('http://192.168.1.4:4000/signup', {
//           name,
//           email,
//           password,
//         })
//         .then(res => {
//           console.log('signpdata ', res.data);
//           Alert.alert('Success', 'Registered successfully', [{text: 'OK'}]);
//           storage.setBoolAsync('isLoggedIn', true);
//           setLoading(true);
//           setEmail('');
//           setName('');
//           setPassword('');
//           navigation.navigate(ROUTES.DASHBOARD);
//         });
//     } catch (error) {
//       Alert.alert('Error', error.message, [{text: 'OK'}]);
//       console.log('rror', error);
//     }
//   };

//   return (
//     <View style={{flex: 1, justifyContent: 'space-between'}}>
//       <View style={{height: '10%'}}></View>
//       <View>
//         <AuthTitle authTitle="Create a new account" />
//         <AuthLine authLine="Please put your information below to create a new account for using app." />
//       </View>
//       <View style={styles.inputField}>
//         <AuthInput
//           wrong={false}
//           value={name}
//           onChangeText={setName}
//           placeholder="Full Name"
//         />
//         <AuthInput
//           wrong={false}
//           value={email}
//           onChangeText={setEmail}
//           placeholder="Email"
//         />
//         <AuthInput
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry={true}
//           placeholder="Password"
//         />
//         <CommonButtonAuth
//           handleData={handleSignup}
//           buttonTitle="Register Now"
//         />
//         <LineAfterBtn
//           lineBefore="Already have an account?"
//           secondBtn="Sign in"
//           route={ROUTES.LOGIN}
//         />
//       </View>
//       <SocialMediaButton />
//     </View>
//   );
// };

// export default Index;

// const styles = StyleSheet.create({});

import React, {useContext, useState} from 'react';
import {Alert, FlatList, View, StyleSheet} from 'react-native';
import AuthInput from '../../Components/InputFields/AuthInput';
import AuthLine from '../../Components/CommonLines/AuthLine';
import AuthTitle from '../../Components/CommonLines/AuthTitle';
import RememberField from '../../Components/InputFields/RememberField';
import CommonButtonAuth from '../../Components/Buttons/CommonButtonAuth';
import LineAfterBtn from '../../Components/CommonLines/LineAfterBtn';
import SocialMediaButton from '../../Components/Buttons/SocialMediaButton';
import {ROUTES} from '../../Constants/routes';
import {useNavigation} from '@react-navigation/native';
import {AppContext} from '../../theme/AppContext';
import axios from 'axios';
import storage from '../../Constants/storage';

const Index = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {setLoading} = useContext(AppContext);
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://192.168.1.4:4000/signup', {
        name,
        email,
        password,
      });
      console.log('signpdata ', response.data);
      Alert.alert('Success', 'Registered successfully', [{text: 'OK'}]);
      await storage.setBoolAsync('isLoggedIn', true);
      setLoading(true);
      setEmail('');
      setName('');
      setPassword('');
      navigation.navigate(ROUTES.DASHBOARD);
    } catch (error) {
      Alert.alert('Error', error.message, [{text: 'OK'}]);
      console.log('error', error);
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
          <AuthTitle authTitle="Create a new account" />
          <AuthLine authLine="Please put your information below to create a new account for using app." />
        </>
      ),
    },

    {
      id: '3',
      component: (
        <View style={styles.inputField}>
          <AuthInput
            wrong={false}
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
          />
          <AuthInput
            wrong={false}
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
        </View>
      ),
    },
    {
      id: '4',
      component: (
        <CommonButtonAuth
          handleData={handleSignup}
          buttonTitle="Register Now"
        />
      ),
    },
    {
      id: '5',
      component: (
        <LineAfterBtn
          lineBefore="Already have an account?"
          secondBtn="Sign in"
          route={ROUTES.LOGIN}
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
  inputField: {
    marginBottom: 10, // Adjust spacing as needed
  },
});

export default Index;
