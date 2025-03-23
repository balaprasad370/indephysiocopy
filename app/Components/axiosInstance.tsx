import axios from 'axios';
import storage from '../Constants/storage';
import { useNavigation } from '@react-navigation/native';

const defaultBaseUrl = 'https://mobile.indephysio.com';

const axiosInstance = axios.create({
  baseURL: defaultBaseUrl,
  timeout: 10000,
});

const navigation = useNavigation();

// Method to dynamically set base URL
axiosInstance.setBaseURL = function(newBaseUrl) {
  this.defaults.baseURL = newBaseUrl || defaultBaseUrl;
};

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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      storage.removeStringAsync('token');
      navigation.navigate("/SignIn" as any);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Example usage:

// 1. Using with default base URL
// axiosInstance.get('/api/users')
//   .then(response => console.log(response.data))
//   .catch(error => console.error('Error:', error));

// 2. Setting a custom base URL in the same component
// const MyComponent = () => {
//   useEffect(() => {
//     // Set base URL at component initialization
//     axiosInstance.setBaseURL('https://server.indephysio.com');
//     
//     // Make API call with the new base URL
//     axiosInstance.get('/portal/subscriptions/invoices/123')
//       .then(response => console.log(response.data))
//       .catch(error => console.error('Error:', error));
//   }, []);
//   
//   return <View>...</View>;
// };

// 3. Using with a full URL (bypassing base URL)
// axiosInstance.get('https://server.indephysio.com/student/subscriptions')
//   .then(response => console.log(response.data))
//   .catch(error => console.error('Error:', error));
