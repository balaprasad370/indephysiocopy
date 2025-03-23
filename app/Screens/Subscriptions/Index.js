import {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import axiosInstance from './../../Components/axiosInstance';
import {useNavigation, useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import topBgBackground from '../../assets/top-bg-shape2.png';
import PageTitle from '../../ui/PageTitle';
import moment from 'moment';
import RazorpayCheckout from 'react-native-razorpay';
import { ROUTES } from '../../Constants/routes';

const Index = () => {
  const navigation = useNavigation();
  const {colors} = useTheme();
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState({});
  const [visibleSubscriptionModal, setVisibleSubscriptionModal] =
    useState(false);
  const [subscription_id, setSubscriptionId] = useState('');
  const [price, setPrice] = useState(0);
  const [amountToBePaid, setAmountToBePaid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [netTotal, setNetTotal] = useState(0);
  const [walletAmount, setWalletAmount] = useState(0);
  const [payFromWallet, setPayFromWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const {width} = Dimensions.get('window');
  const isTablet = width > 768;

  const getTransactionDetails = async () => {
    try {
      const response = await axiosInstance.get(
        'https://server.indephysio.com/student/subscriptions',
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getTransactionDetails();
      await getData();
      await getWalletAmount();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getTransactionDetails();
    getData();
    getWalletAmount();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        'https://server.indephysio.com/portal/student/subscriptionDetails',
      );
      setUserData(response.data);
      setPrice(response.data.subscription_amount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getWalletAmount = async () => {
    try {
      const response = await axiosInstance.get(
        'https://server.indephysio.com/student/walletAmount',
      );
      setWalletAmount(response.data.wallet_amount);
      setWalletBalance(response.data.wallet_amount);
    } catch (error) {
      console.error('Error fetching wallet amount:', error);
    }
  };

  const handleRenewSubscription = subscriptionId => {
    setVisibleSubscriptionModal(true);
    setSubscriptionId(subscriptionId);
  };

  const handlePayment = async () => {
    const amount = netTotal;
    if (amount === 0) return;

    try {
      const orderData = await fetch(
        'https://server.indephysio.com/create-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            notes: {
              reason: 'Renew subscription from mobile app',
              package: userData.package,
              name: userData?.first_name + ' ' + userData?.last_name,
              email: userData?.email,
              mobile: userData?.mobile,
              student_id: userData?.student_id,
              subscription_expiry: userData?.subscription_expiry,
              batch_name: userData?.batch_name,
              batch_subscription_date: userData?.batch_subscription_date,
              discount_amount: userData?.discount_amount
                ? userData?.discount_amount
                : 0,
              discount_notes: userData?.discount_notes
                ? userData?.discount_notes
                : '',
            },
            receipt:
              userData?.first_name.trim().substring(0, 20) + ' subscription',
          }),
        },
      ).then(res => res.json());

      const options = {
        description: 'Meduniverse private limited',
        image: 'https://i.imgur.com/3g7nmJC.png',
        currency: orderData.currency,
        key: 'rzp_live_squ9PiHM5Cyog4',
        amount: orderData.amount,
        name: 'MedUniverse',
        order_id: orderData.id,
        prefill: {
          email: userData?.username,
          contact: userData?.mobile,
          name: userData?.first_name,
        },
        theme: {color: '#3399cc'},
      };

         RazorpayCheckout.open(options)
              .then(data => {
                const paymentdata = {
                  package: userData.package,
                  amount: amount,
                  payment_order_id: data.razorpay_order_id,
                  razorpay_payment_id: data.razorpay_payment_id,
                  razorpay_signature: data.razorpay_signature,
                };
                handleUpdatePayment(paymentdata);
              })
              .catch(error => {
                console.log(`Error: ${error.code} | ${error.description}`);
                Alert.alert(
                  'Payment Failed',
                  'The payment process was cancelled or failed.',
                );
              });
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
    }
  };

  const handleUpdatePayment = async paymentdata => {
    try {
      const obj = {
        ...paymentdata,
        amountToBePaid: parseFloat(amountToBePaid),
        netTotal: parseFloat(netTotal),
        walletAmount: parseFloat(walletAmount),
        walletBalance: parseFloat(walletBalance),
        payFromWallet: payFromWallet,
        subscription_id: subscription_id ? subscription_id : 0,
      };

      await axiosInstance.post(
        'https://server.indephysio.com/student/subscription/update',
        obj,
      );

      getTransactionDetails();
      setVisibleSubscriptionModal(false);
      setAmountToBePaid(0);
      setNetTotal(0);
      getWalletAmount();
      setPayFromWallet(false);
      setSubscriptionId('');
      Alert.alert('Success', 'Subscription updated successfully');
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert(
        'Error',
        'Contact Us ' + (error.response?.data || 'An error occurred'),
      );
    }
  };

  const handleUpdatePaymentWithoutGateway = async obj => {
    try {
      await axiosInstance.post(
        'https://server.indephysio.com/student/subscription/updatewithoutgateway',
        obj,
      );

      getTransactionDetails();
      setVisibleSubscriptionModal(false);
      setAmountToBePaid(0);
      setNetTotal(0);
      getWalletAmount();
      setPayFromWallet(false);
      setSubscriptionId('');
      Alert.alert('Success', 'Subscription updated successfully');
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Error',
        'Contact Us ' + (error.response?.data || 'An error occurred'),
      );
    }
  };

  const handleTriggerPayment = () => {
    const obj = {
      amountToBePaid: parseFloat(amountToBePaid),
      netTotal: parseFloat(netTotal),
      walletAmount: parseFloat(walletAmount),
      walletBalance: parseFloat(walletBalance),
      payFromWallet: payFromWallet,
      subscription_id: subscription_id,
    };

    if (netTotal > 0) {
      handlePayment();
    } else {
      handleUpdatePaymentWithoutGateway(obj);
    }
  };

  useEffect(() => {
    if (payFromWallet) {
      if (parseFloat(walletAmount) > parseFloat(amountToBePaid)) {
        setNetTotal(0);
        setWalletBalance(parseFloat(walletAmount) - parseFloat(amountToBePaid));
      } else if (parseFloat(walletAmount) < parseFloat(amountToBePaid)) {
        setNetTotal(parseFloat(amountToBePaid) - parseFloat(walletAmount));
        setWalletBalance(0);
      } else if (parseFloat(walletAmount) === parseFloat(amountToBePaid)) {
        setNetTotal(0);
        setWalletBalance(0);
      }
    } else {
      setWalletBalance(walletAmount);
      setNetTotal(amountToBePaid);
    }
  }, [payFromWallet, amountToBePaid, walletAmount]);

  const renderItem = ({item}) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-800 flex-1">
          {item.package || 'Unknown Package'}
        </Text>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">Transaction ID:</Text>
        <Text className="text-gray-800">
          {item.razorpay_payment_id || 'N/A'}
        </Text>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">Net Amount:</Text>
        <Text className="text-gray-800">₹{item.amount}</Text>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">Paid Amount:</Text>
        <Text className="text-gray-800">₹{item.paid_amount || 'pending'}</Text>
      </View>

      <View className="flex-row justify-between mb-1">
        <Text className="text-gray-600">From Wallet:</Text>
        <Text className="text-gray-800">₹{item.wallet_paid_amount}</Text>
      </View>

      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-600">Date:</Text>
        <Text className="text-gray-800">
          {moment(item.transaction_date).format('DD MMM, YYYY hh:mm A')} IST
        </Text>
      </View>

      <View className="flex-row justify-end">
        {item.invoice_status === 1 ? (
          <TouchableOpacity
            className="bg-indigo-500 px-4 py-2 rounded-md"
            onPress={() =>
              navigation.navigate(ROUTES.INVOICE, {
                invoice_id: item.subscription_id,
              })
            }>
            <Text className="text-white font-bold">View Invoice</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded-md"
            onPress={() => {
              setAmountToBePaid(item.amount);
              setNetTotal(item.amount);
              handleRenewSubscription(item.subscription_id);
            }}>
            <Text className="text-white font-bold">Complete Payment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-b50">
      <View className="relative pb-8">
        <View className="absolute w-full top-0 left-0 right-0">
          <Image
            source={topBgBackground}
            className="w-full h-[200px] -mt-24"
            resizeMode="cover"
            onError={() => console.warn('Failed to load background image')}
          />
        </View>
        <PageTitle pageName="Subscriptions" />
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item =>
          item.subscription_id?.toString() || Math.random().toString()
        }
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366f1']}
          />
        }
        ListHeaderComponent={
          <View className="">
            {userData?.package !== '' &&
              data.some(item => item.invoice_status === 0) && (
                <View className="mx-4 mb-4 bg-red-100 p-4 rounded-md border-l-4 border-l-red-500">
                  <Text className="text-red-800 font-medium">
                    Please pay your pending payments to continue your services.
                    Do not ignore your pending payments.
                  </Text>
                </View>
              )}

            {userData?.package !== '' &&
              moment()
                .date(moment(userData?.batch_subscription_date).format('DD'))
                .add(1, 'month')
                .isSameOrAfter(moment(), 'month') && (
                <View className="mx-4 mb-4 bg-yellow-100 p-4 rounded-md border-l-4 border-l-yellow-500">
                  <View className="flex-row items-center">
                    <Icon
                      name="warning"
                      size={24}
                      color="#f59e0b"
                      className="mr-2"
                    />
                    <View className="flex-1">
                      <Text className="font-bold text-yellow-800">
                        Your subscription will expire on{' '}
                        {moment()
                          .date(
                            moment(userData?.batch_subscription_date).format(
                              'DD',
                            ),
                          )
                          .add(1, 'month')
                          .format('DD MMM, YYYY')}{' '}
                        . Renew before it expires to continue without
                        interruption.
                      </Text>
                      <Text className="text-sm text-yellow-800 mt-1">
                        Your billing cycle is on{' '}
                        <Text className="font-bold">
                          {moment(userData?.batch_subscription_date).format(
                            'DD',
                          )}
                        </Text>{' '}
                        of every month.
                      </Text>
                    </View>
                  </View>
                </View>
              )}

            {loading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="mt-2 text-gray-600">
                  Loading subscription details...
                </Text>
              </View>
            ) : price ? (
              <View className="mx-4 mb-4 bg-teal-100 p-4 rounded-md border-l-4 border-l-teal-500">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    {userData.package === '' ? (
                      <View>
                        <Text className="font-bold text-teal-800">
                          Subscribe to the plan
                        </Text>
                        <Text className="text-sm text-teal-800">
                          Subscribe and start learning from anywhere and anytime
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text className="font-bold text-teal-800">
                          Continue Subscription for{' '}
                          <Text className="text-blue-500">
                            {userData.package}
                          </Text>
                        </Text>
                        <Text className="text-sm text-teal-800">
                          Continue your subscription and learn from anywhere and
                          anytime
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="items-center">
                    <Text className="font-bold text-teal-800">
                      ₹{price > 0 ? price : 'N/A'}/month
                    </Text>
                    <TouchableOpacity
                      disabled={price <= 0}
                      onPress={() => {
                        setAmountToBePaid(price);
                        setNetTotal(price);
                        setVisibleSubscriptionModal(true);
                      }}
                      className="bg-blue-500 px-3 py-1.5 rounded-md mt-2">
                      <Text className="text-white font-bold">
                        Subscribe now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : (
              <View className="mx-4 mb-4 bg-yellow-300 p-4 rounded-md">
                <Text className="font-bold text-red-600">
                  Contact admin to update your subscription details
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-5">
            <Icon name="subscriptions" size={80} color="#d1d5db" />
            <Text className="text-lg text-gray-500 mt-4">
              No subscription history found
            </Text>
          </View>
        }
      />

      <Modal
        visible={visibleSubscriptionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setAmountToBePaid(0);
          setNetTotal(0);
          setWalletBalance(walletAmount);
          setPayFromWallet(false);
          setSubscriptionId('');
          setVisibleSubscriptionModal(false);
        }}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Renew Your Subscription
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setAmountToBePaid(0);
                  setNetTotal(0);
                  setWalletBalance(walletAmount);
                  setPayFromWallet(false);
                  setSubscriptionId('');
                  setVisibleSubscriptionModal(false);
                }}>
                <Icon name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View className="h-[1px] bg-gray-200 my-2" />

            <View className="flex-row justify-between items-center my-2">
              <Text className="font-bold text-gray-700">
                Subscription Amount:
              </Text>
              <Text className="text-gray-700">₹{amountToBePaid}</Text>
            </View>

            <View className="h-[1px] bg-gray-200 my-2" />

            <View className="flex-row justify-between items-center my-2">
              <Text className="font-bold text-gray-700">Wallet Balance:</Text>
              <Text className="text-gray-700">₹{walletAmount}</Text>
            </View>

            <View className="flex-row justify-between items-center my-2">
              <Text className="text-gray-700">Pay using wallet balance</Text>
              <Switch
                disabled={walletAmount === 0}
                value={payFromWallet}
                onValueChange={() => setPayFromWallet(!payFromWallet)}
                trackColor={{false: '#d1d5db', true: '#a5b4fc'}}
                thumbColor={payFromWallet ? '#6366f1' : '#f4f4f5'}
              />
            </View>

            <View className="flex-row justify-between items-center my-2">
              <Text className="font-bold text-gray-700">
                Current Wallet Balance:
              </Text>
              <Text className="text-gray-700">₹{walletBalance}</Text>
            </View>

            <View className="h-[1px] bg-gray-200 my-2" />

            <View className="flex-row justify-between items-center my-2">
              <Text className="font-bold text-gray-700">Net Total:</Text>
              <Text className="text-gray-700">₹{netTotal}</Text>
            </View>

            <View className="h-[1px] bg-gray-200 my-2" />

            <TouchableOpacity
              onPress={handleTriggerPayment}
              className="bg-blue-600 py-3 rounded-md mt-4">
              <Text className="text-white font-bold text-center">
                Pay ₹{netTotal}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Index;
