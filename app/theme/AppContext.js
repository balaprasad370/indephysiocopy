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
  const path = '192.168.1.5';
  // const path = '192.168.35.48';
  // http://192.168.1.5
  // 192.168.1.5

  const [isDark, setIsDark] = useState(storage.getBool('theme'));
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(storage.getBool('show'));

  const [userData, setUserData] = useState(null);

  const [loadTime, setLoadTime] = useState(false);

  const [error, setError] = useState(false);

  const chapterData = async () => {
    const token = await storage.getStringAsync('token');

    if (token) {
      try {
        const response = await axios.get(`http://${path}:4000/chapters`);
      } catch (error) {
        console.log('error helo', error);
      }
    }
  };

  const getDatFunc = async () => {
    try {
      // Check if the user is logged in
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');
      const token = await storage.getStringAsync('token');
      if (isLoggedIn && token) {
        const res = await axios({
          method: 'get',
          url: 'https://server.indephysio.com/student/getDetails',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        });
        setUserData(res.data);
      }
    } catch (error) {
      console.log('Error Message:', error);

      if (error.response && error.response.status === 403) {
        console.log('Token expired or invalid');
        // Handle token expiration or invalidation
        await storage.setBoolAsync('isLoggedIn', false);
        await storage.setStringAsync('token', null);
        setIsAuthenticate(false);
      }
    }
  };

  const [documentStatus, setDocumentStatus] = useState('Not initialized');

  const fetchDocumentStatus = async () => {
    const token = await storage.getStringAsync('token');
    if (userData?.student_id) {
      try {
        const response = await axios.get(
          'https://server.indephysio.com/student/documentStatus',
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
    // Fetch document status initially
    fetchDocumentStatus();

    // Set up an interval to fetch document status every 10 seconds
    const intervalId = setInterval(fetchDocumentStatus, 10000); // 10000 milliseconds = 10 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getDatFunc();
    // Set up polling interval
    const intervalId = setInterval(getDatFunc, 3000); // Poll every 3 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs only on mount

  const fetchToken = async () => {
    try {
      const isLoggedIn = await storage.getBoolAsync('isLoggedIn');
      const token = await storage.getStringAsync('token');
      if (isLoggedIn) {
        setIsAuthenticate(true);
      }
    } catch (storageError) {
      console.error('Error fetching token or isLoggedIn state:', storageError);
    }
  };

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocumentData = async () => {
      if (userData?.student_id) {
        try {
          const response = await axios.get(`http://${path}:4000/documentData`, {
            params: {student_id},
          });

          console.log(first);

          if (response.status === 200) {
            const {status, documents} = response.data;
            setDocuments(documents);
            console.log(documents);
          } else {
            throw new Error('Unexpected response status');
          }
        } catch (error) {
          console.error('Error fetching document data:', error);
          Alert.alert(
            'Error',
            'Unable to fetch document data. Please try again later.',
          );
        }
      }
    };

    fetchDocumentData();
  }, []);

  useEffect(() => {
    chapterData();
    getDatFunc();
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
  };

  const style = isDark ? DarkTheme : LighTheme;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
