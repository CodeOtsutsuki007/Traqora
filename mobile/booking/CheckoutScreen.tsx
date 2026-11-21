import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface CheckoutScreenProps {
  onConfirmBooking: () => Promise<string>;
  onBookingSuccess: (bookingId: string) => void;
}

export default function CheckoutScreen({
  onConfirmBooking,
  onBookingSuccess,
}: CheckoutScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (isSubmitting || submittedId) {
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingId = await onConfirmBooking();
      setSubmittedId(bookingId);
      onBookingSuccess(bookingId);
    } catch (error: any) {
      Alert.alert('Booking Error', error?.message || 'Failed to complete booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Checkout & Confirmation</Text>
      <TouchableOpacity
        style={[styles.button, (isSubmitting || submittedId) && styles.disabledButton]}
        disabled={isSubmitting || submittedId !== null}
        onPress={handleConfirm}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Processing Booking...' : submittedId ? 'Booking Confirmed' : 'Confirm & Pay'}
        </Text>
      </TouchableOpacity>
      {submittedId && (
        <Text style={styles.notice}>
          This booking has already been submitted. Reference: {submittedId}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notice: {
    marginTop: 15,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});
