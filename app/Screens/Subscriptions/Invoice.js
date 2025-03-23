import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import moment from 'moment';
import axiosInstance from '../../Components/axiosInstance';
import PageTitle from '../../ui/PageTitle';
import topBgBackground from '../../assets/top-bg-shape2.png';

const Invoice = () => {
  const route = useRoute();
  const { invoice_id } = route.params || {};
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  
  const [invoiceData, setInvoiceData] = useState({});
  const [loading, setLoading] = useState(true);

  const getInvoiceDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `https://server.indephysio.com/portal/subscriptions/invoices/${invoice_id}`
      );
      setInvoiceData(response.data[0]);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceDetails();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading invoice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!invoiceData || Object.keys(invoiceData).length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.relative}>
          <View style={styles.absoluteBackground}>
            <Image
              source={topBgBackground}
              style={styles.backgroundImage}
              resizeMode="cover"
            />
          </View>
          <PageTitle pageName="Invoice" />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Invalid Invoice</Text>
          <Text style={styles.errorMessage}>
            The invoice details could not be found. Please check the invoice link and try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.relative}>
        <View style={styles.absoluteBackground}>
          <Image
            source={topBgBackground}
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        </View>
        <PageTitle pageName="Invoice" />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={[styles.invoiceContainer, isTablet && styles.invoiceContainerTablet]}>
          {/* Invoice Header with Logo and Title */}
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceTitleSection}>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>#{invoiceData.subscription_id}</Text>
            </View>
          </View>

          {/* Company Information */}
          <View style={styles.companySection}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>Meduniverse International Pvt. Ltd.</Text>
              <Text style={styles.companyContact}>info@meduniverse.app | +91 9894604603</Text>
            </View>
            <View style={styles.invoiceDateSection}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Invoice Date:</Text>
                <Text style={styles.dateValue}>{moment().format('DD MMM YYYY')}</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Payment Date:</Text>
                <Text style={styles.dateValue}>
                  {moment(parseInt(invoiceData.timestamp)).format('DD MMM YYYY')}
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Information */}
          <View style={styles.customerSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>BILLED TO</Text>
            </View>
            <Text style={styles.customerName}>
              {invoiceData.first_name} {invoiceData.last_name}
            </Text>
            <Text style={styles.customerEmail}>{invoiceData.username}</Text>
          </View>

          {/* Invoice Items */}
          <View style={styles.itemsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>SUBSCRIPTION DETAILS</Text>
            </View>
            
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Description</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Amount</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {invoiceData.package} Pathway
              </Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                ₹{invoiceData.amount}
              </Text>
            </View>

            {/* Subtotal, Tax, and Total */}
            <View style={styles.summarySection}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{invoiceData.amount}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>₹0.00</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{invoiceData.amount}</Text>
              </View>
            </View>
          </View>

          {/* Payment Information */}
          <View style={styles.paymentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>PAYMENT INFORMATION</Text>
            </View>
            <View style={styles.paymentDetails}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Method:</Text>
                <Text style={styles.paymentValue}>Online Payment</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Transaction ID:</Text>
                <Text style={styles.paymentValue}>{invoiceData.razorpay_payment_id}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Status:</Text>
                <Text style={[styles.paymentValue, styles.paymentSuccess]}>Paid</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.thankYou}>Thank you for choosing Meduniverse!</Text>
            <Text style={styles.footerWebsite}>www.meduniverse.app</Text>
            <Text style={styles.disclaimer}>
              This is a computer generated invoice and does not require a signature.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  relative: {
    position: 'relative',
    paddingBottom: 32,
  },
  absoluteBackground: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    marginTop: -24,
  },
  scrollView: {
    flex: 1,
  },
  invoiceContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  invoiceContainerTablet: {
    maxWidth: 600,
    alignSelf: 'center',
    marginHorizontal: 'auto',
    padding: 30,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
  },
  invoiceTitleSection: {
    alignItems: 'flex-start',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  companySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  companyInfo: {
    flex: 1,
    marginRight: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  companyAddress: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 3,
  },
  companyContact: {
    fontSize: 14,
    color: '#4B5563',
  },
  invoiceDateSection: {
    minWidth: 150,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  customerSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  sectionHeader: {
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  customerEmail: {
    fontSize: 14,
    color: '#4B5563',
  },
  itemsSection: {
    marginBottom: 25,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  tableCell: {
    fontSize: 15,
    color: '#111827',
  },
  summarySection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 15,
    alignItems: 'flex-end',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  paymentSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  paymentDetails: {
    marginTop: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 120,
  },
  paymentValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  paymentSuccess: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  thankYou: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 8,
  },
  footerWebsite: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 15,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default Invoice;