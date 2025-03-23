import axios from 'axios';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import storage from '../../Constants/storage';
import ROUTES from '../../Constants/routes';

const axiosInstance = axios.create({
  baseURL: 'https://mobile.indephysio.com', // Replace with your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await storage.getStringAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Token expired or invalid
        try {
          await storage.clear();
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate to login screen
                  const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [{ name: ROUTES.LOGIN }],
                  });
                  // You'll need to get navigation object here or pass it through context
                  // navigation.dispatch(resetAction);
                },
              },
            ]
          );
        } catch (clearError) {
          console.error('Error clearing storage:', clearError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
