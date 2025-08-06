/**
 * Booking Screen - Ocean Blue Theme
 * Handles dynamic booking creation with API integration
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import services
import { apiService, Dahabiya, Package } from '../services/ApiService';

interface BookingFormData {
  startDate: Date;
  endDate: Date;
  guests: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests: string;
}

const BookingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, id } = route.params as { type: 'dahabiya' | 'package'; id: string };

  // State
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<Dahabiya | Package | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    guests: 2,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
  });

  useEffect(() => {
    loadItemDetails();
  }, []);

  useEffect(() => {
    if (item && type === 'dahabiya') {
      checkAvailability();
    }
  }, [formData.startDate, formData.endDate, formData.guests, item]);

  const loadItemDetails = async () => {
    try {
      setLoading(true);
      if (type === 'dahabiya') {
        const dahabiya = await apiService.getDahabiya(id);
        setItem(dahabiya);
      } else {
        const pkg = await apiService.getPackage(id);
        setItem(pkg);
      }
    } catch (error) {
      console.error('Error loading item details:', error);
      Alert.alert('Error', 'Unable to load details. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (type !== 'dahabiya' || !item) return;

    try {
      setCheckingAvailability(true);
      const result = await apiService.checkAvailability({
        dahabiyaId: item.id,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        guests: formData.guests,
      });
      setAvailability(result);
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmitBooking = async () => {
    // Validate form
    if (!formData.customerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!formData.customerEmail.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!formData.customerPhone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (type === 'dahabiya' && availability && !availability.isAvailable) {
      Alert.alert('Error', 'Selected dates are not available. Please choose different dates.');
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        type: type.toUpperCase(),
        ...(type === 'dahabiya' ? { dahabiyaId: id } : { packageId: id }),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        guests: formData.guests,
        totalPrice: type === 'dahabiya' ? availability?.totalPrice : (item as Package)?.price,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        specialRequests: formData.specialRequests,
      };

      const booking = await apiService.createBooking(bookingData);

      Alert.alert(
        'Booking Submitted!',
        'Your booking request has been submitted successfully. We will contact you shortly to confirm the details.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home' as never),
          },
        ]
      );

    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert(
        'Booking Error',
        'Unable to submit your booking. Please try again or contact us directly.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading && !item) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0080ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book {item?.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Item Summary */}
        <View style={styles.itemSummary}>
          <Text style={styles.itemName}>{item?.name}</Text>
          <Text style={styles.itemDescription}>{item?.shortDescription}</Text>
          <Text style={styles.itemPrice}>
            {type === 'dahabiya' 
              ? `$${(item as Dahabiya)?.pricePerDay}/day` 
              : `$${(item as Package)?.price} total`
            }
          </Text>
        </View>

        {/* Booking Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          {/* Dates */}
          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Start Date</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formData.startDate.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color="#0080ff" />
              </TouchableOpacity>
            </View>

            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>End Date</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formData.endDate.toLocaleDateString()}
                </Text>
                <Ionicons name="calendar" size={20} color="#0080ff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Guests */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Number of Guests</Text>
            <View style={styles.guestSelector}>
              <TouchableOpacity 
                style={styles.guestButton}
                onPress={() => updateFormData('guests', Math.max(1, formData.guests - 1))}
              >
                <Ionicons name="remove" size={20} color="#0080ff" />
              </TouchableOpacity>
              <Text style={styles.guestCount}>{formData.guests}</Text>
              <TouchableOpacity 
                style={styles.guestButton}
                onPress={() => updateFormData('guests', formData.guests + 1)}
              >
                <Ionicons name="add" size={20} color="#0080ff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Availability Check for Dahabiyas */}
          {type === 'dahabiya' && (
            <View style={styles.availabilitySection}>
              {checkingAvailability ? (
                <Text style={styles.checkingText}>Checking availability...</Text>
              ) : availability ? (
                <View style={[styles.availabilityResult, 
                  availability.isAvailable ? styles.available : styles.unavailable
                ]}>
                  <Ionicons 
                    name={availability.isAvailable ? "checkmark-circle" : "close-circle"} 
                    size={20} 
                    color={availability.isAvailable ? "#28a745" : "#dc3545"} 
                  />
                  <Text style={[styles.availabilityText, 
                    { color: availability.isAvailable ? "#28a745" : "#dc3545" }
                  ]}>
                    {availability.message}
                  </Text>
                </View>
              ) : null}
            </View>
          )}

          {/* Customer Information */}
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.customerName}
              onChangeText={(text) => updateFormData('customerName', text)}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email Address *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.customerEmail}
              onChangeText={(text) => updateFormData('customerEmail', text)}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone Number *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.customerPhone}
              onChangeText={(text) => updateFormData('customerPhone', text)}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Special Requests</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.specialRequests}
              onChangeText={(text) => updateFormData('specialRequests', text)}
              placeholder="Any special requests or dietary requirements?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, 
            (loading || (type === 'dahabiya' && availability && !availability.isAvailable)) && styles.disabledButton
          ]}
          onPress={handleSubmitBooking}
          disabled={loading || (type === 'dahabiya' && availability && !availability.isAvailable)}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={formData.startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              updateFormData('startDate', selectedDate);
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={formData.endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              updateFormData('endDate', selectedDate);
            }
          }}
          minimumDate={formData.startDate}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#0080ff',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
  },
  itemSummary: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0080ff',
  },
  formSection: {
    backgroundColor: '#ffffff',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateField: {
    flex: 0.48,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  guestSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
  },
  guestButton: {
    backgroundColor: '#0080ff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
  },
  textInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  availabilitySection: {
    marginBottom: 20,
  },
  checkingText: {
    fontSize: 14,
    color: '#0080ff',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  availabilityResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  available: {
    backgroundColor: '#d4edda',
  },
  unavailable: {
    backgroundColor: '#f8d7da',
  },
  availabilityText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#0080ff',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;
