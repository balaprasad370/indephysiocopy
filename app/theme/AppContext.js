import React, {createContext, useEffect, useState} from 'react';
import storage from '../Constants/storage';
import axios from 'axios';
import SplashScreen from 'react-native-splash-screen';
import LighTheme from './LighTheme';
import {DarkTheme} from '@react-navigation/native';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AuthProvider = ({children}) => {
  // const path = '192.168.1.3';
  // const path = '192.168.162.48';
  const path = 'https://mobile.indephysio.com';
  // const path = 'http://192.168.154.48:4000';
  // http://192.168.1.5
  // 192.168.1.5

  const [packageName, setPackageName] = useState('');

  const [isDark, setIsDark] = useState(storage.getBool('theme'));
  const [langId, setLangId] = useState(1); // 0 // 1
  const [levelId, setLevelId] = useState(6); //6  // 7
  const [packageId, setPackageId] = useState(0); // 3 // 1
  const [clientId, setClientId] = useState(8); // 8 // 7
  const [student_id, setStudentId] = useState(null);
  const [grandScore, setGrandScore] = useState(0);
  const [profileStatus, setProfileStatus] = useState([]);
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [subscribe, setSubscribe] = useState(0);
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(storage.getBool('show'));
  const [documentStatus, setDocumentStatus] = useState('Not initialize');
  const [userData, setUserData] = useState(null);
  const [loadTime, setLoadTime] = useState(false);
  const [error, setError] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [referralcode, setReferralCode] = useState();
  const [fetchTime, setFetchTime] = useState();

  const getDatFunc = async () => {
    try {
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');
      const token = await storage.getStringAsync('token');

      if (isLoggedIn && token) {
        const res = await axios.get(`${path}/student/getDetails`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        setStudentId(res.data?.student_id);
        setPackageId(res.data?.package_id);
        setPackageName(res.data?.package);
        setReferralCode(res.data?.referral_student_id);
        setUserData(res.data);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.warn('Token expired or invalid');
        await storage.setBoolAsync('isLoggedIn', false);
        await storage.setStringAsync('token', null);
        setIsAuthenticate(false);
      } else {
        // Handle other types of errors, possibly show a message to the user
      }
    }
  };

  // const chapterData = async () => {
  //   try {
  //     const token = await storage.getStringAsync('token');

  //     if (token) {
  //       const response = await axios.get(`${path}/chapters`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       console.log('Chapters fetched successfully:', response.data);
  //     }
  //   } catch (error) {
  //     console.log('Error fetching chapters:', error);
  //   }
  // };

  // const fetchPackageData = async () => {
  //   const token = await storage.getStringAsync('token');
  //   if (token && clientId) {
  //     try {
  //       const response = await axios.get(`${path}/packages`, {
  //         params: {
  //           client_id: clientId,
  //         },
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: 'Bearer ' + token,
  //         },
  //       });
  //       // console.log('helo package data', response.data);
  //       // setChapter(response.data);
  //     } catch (error) {
  //       console.log('Error fetching package data:', error);
  //     }
  //   }
  // };

  const fetchToken = async () => {
    try {
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');

      if (isLoggedIn) {
        setIsAuthenticate(true);
      }
    } catch (storageError) {
      console.log('Error fetching token or isLoggedIn state:', storageError);
    }
  };

  const fetchDocumentStatus = async () => {
    const token = await storage.getStringAsync('token');
    if (student_id || token) {
      try {
        const response = await axios.get(`${path}/student/documentStatus`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocumentStatus(response.data.status);
      } catch (error) {
        console.log('Error fetching document status:', error);
      }
    }
  };

  const fetchClockTime = async () => {
    const token = await storage.getStringAsync('token');
    if (token) {
      try {
        const response = await axios.get(`${path}/student/v1/appusagetime`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const appUsageData = response.data;
        if (appUsageData.success) {
          setFetchTime(appUsageData.data);
        } else {
          console.log('Error', 'Failed to retrieve app usage time');
        }
      } catch (error) {
        console.log('Error fetching app usage time:', error);
      }
    }
  };

  // const newFUnction = async () => {
  //   let newToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOjM3MywicmVmZXJyYWxJZCI6OTQzNzA1LCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE3MzI5NTg4NDUsImV4cCI6MTc0MDczNDg0NX0.LtssvZh6U5tZUqbEKMNGqbwg-aCun0HvG-Q6TpmeKKU`;
  //   // let newToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOjQ3MywicmVmZXJyYWxJZCI6MCwidXNlclR5cGUiOiJzdHVkZW50IiwiaWF0IjoxNzMyMzUxODk5LCJleHAiOjE3NDAxMjc4OTl9.eMgakAP-kBQFGI7LEMPlYcVhuJtdBKm2BytUz0h3aNo`;
  //   // let newToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOjQzMSwicmVmZXJyYWxJZCI6OTQzNzQ4LCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE3MzE2NjkzNzcsImV4cCI6MTczOTQ0NTM3N30.JpE6FGUSGGkZ1Hf86QGnTT2gp7Jv5sh3z38NWUKzTec`;
  //   // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOjM2OSwicmVmZXJyYWxJZCI6OTQzNzAxLCJ1c2VyVHlwZSI6InN0dWRlbnQiLCJpYXQiOjE3MzA2NDk0OTMsImV4cCI6MTczODQyNTQ5M30.Hl0C0kQElQ_uGYirnsTWtaI7R_amgN2-iET0pMhLUnM';
  //   await storage.setStringAsync('token', newToken);
  // };
  // useEffect(() => {
  //   // console.log(storage.getStringAsync('token'));
  //   newFUnction();
  // }, []);

  // {student_id:"9", devices:["289qr9qyr9qnkhqrqhr","689649kqhkqkbkb"],status:0}

  // const cloudMessaging = async () => {
  //   const token = await storage.getStringAsync('token');

  //   if (!token) {
  //     console.log('Authorization token is missing. cloudMessaging');
  //     return;
  //   }

  //   try {
  //     const deviceToken = await messaging().getToken();

  //     if (deviceToken && student_id && token) {
  //       const response = await axios.post(`${path}/admin/v1/cloudMessaging`, {
  //         params: {
  //           deviceToken: deviceToken,
  //         },
  //         params: {
  //           deviceToken: deviceToken,
  //         },
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       console.log('Done');
  //     }
  //   } catch (error) {
  //     console.log('error from cloud messagingssss hkakfha k ', error.response);
  //   }
  // };

  // const getPackageId = async () => {
  //   try {
  //     let level = '';
  //     const token = await storage.getStringAsync('token');
  //     if (token && student_id) {
  //       const response = await axios.get(`${path}/v4/package/alias`, {
  //         params: {
  //           package_name: userData?.package, // Using the correct property here
  //           client_id: clientId,
  //           level: level,
  //         },
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       if (response.status === 200) {
  //         let newPacakgeId = response.data[0]?.package_id;
  //         setPackageId(response.data[0]?.package_id);
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Error:', error);
  //   }
  // };

  useEffect(() => {
    // getPackageId();
    fetchClockTime();
    fetchDocumentStatus();
  }, [userData]);

  useEffect(() => {
    // chapterData();
    // cloudMessaging();
    fetchToken();
  }, []);
  useEffect(() => {
    getDatFunc();
    const intervalId = setInterval(getDatFunc, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const value = {
    isDark,
    setIsDark,
    loadTime,
    setLoadTime,
    userData,
    path,
    error,
    setError,
    show,
    setShow,
    isAuthenticate,
    setIsAuthenticate,
    documents,
    documentStatus,
    setDocumentStatus,
    grandScore,
    setGrandScore,
    langId,
    setLangId,
    packageId,
    setPackageId,
    profileStatus,
    setProfileStatus,
    clientId,
    setClientId,
    levelId,
    setLevelId,
    packageName,
    student_id,
    referralcode,
    loader,
    setLoader,
    fetchTime,
    setFetchTime,
  };

  const style = isDark ? DarkTheme : LighTheme;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
