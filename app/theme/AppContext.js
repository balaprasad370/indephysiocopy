import React, {createContext, useEffect, useState} from 'react';
import storage from '../Constants/storage';
import axios from 'axios';
import SplashScreen from 'react-native-splash-screen';
import LighTheme from './LighTheme';
import {DarkTheme} from '@react-navigation/native';
import {StatusBar} from 'react-native';

// Create the context
export const AppContext = createContext();

// Create the provider component
export const AuthProvider = ({children}) => {
  const path = '192.168.1.3';
  // const path = '192.168.162.48';
  // const path = '192.168.35.48';
  // http://192.168.1.5
  // 192.168.1.5

  let packageName = 'Superfast';

  const [isDark, setIsDark] = useState(storage.getBool('theme'));
  const [langId, setLangId] = useState(1); // 0 // 1
  const [levelId, setLevelId] = useState(6); //6  // 7
  const [packageId, setPackageId] = useState(3); // 3 // 1
  const [clientId, setClientId] = useState(8); // 8 // 7
  const [studentId, setStudentId] = useState(null);
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

  const chapterData = async () => {
    try {
      const token = await storage.getStringAsync('token');

      if (token) {
        const response = await axios.get(`http://${path}:4000/chapters`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Chapters fetched successfully:', response.data);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const getDatFunc = async () => {
    try {
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');
      const token = await storage.getStringAsync('token');

      if (isLoggedIn && token) {
        const res = await axios.get(`http://${path}:4000/student/getDetails`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setStudentId(res.data?.student_id);
        setUserData(res.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  useEffect(() => {
    getDatFunc();
    const intervalId = setInterval(getDatFunc, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchToken = async () => {
    try {
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');

      if (isLoggedIn) {
        setIsAuthenticate(true);
      }
    } catch (storageError) {
      console.error('Error fetching token or isLoggedIn state:', storageError);
      // Handle error appropriately, perhaps redirect to login or show an alert
    }
  };

  const fetchDocumentStatus = async () => {
    const token = await storage.getStringAsync('token');
    if (studentId) {
      try {
        const response = await axios.get(
          `http://${path}:4000/student/documentStatus`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setDocumentStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching document status:', error);
      }
    }
  };

  useEffect(() => {
    fetchDocumentStatus();
  }, [userData]);

  useEffect(() => {
    chapterData();
    fetchToken();
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
  };

  const style = isDark ? DarkTheme : LighTheme;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
