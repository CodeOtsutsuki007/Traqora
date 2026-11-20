import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CheckoutScreenProps {
  onConfirmBooking: () => Promise<void>;
  bookingReference?: string;
}

export default function CheckoutScreen({
  onConfirmBooking,
  bookingReference,
}: CheckoutScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePress = async () => {
    if (isSubmitting || isSubmitted) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirmBooking();
      setIsSubmitted(true);
    } catch (err) {
      console.error('Checkout submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Details & Checkout</Text>
      {bookingReference && (
        <Text style={styles.ref}>Reference: {bookingReference}</Text>
      )}
      <TouchableOpacity
        style={[styles.button, (isSubmitting || isSubmitted) && styles.disabledButton]}
        onPress={handlePress}
        disabled={isSubmitting || isSubmitted}
        testID="confirm-checkout-btn"
      >
        <Text style={styles.buttonText}>
          {isSubmitting
            ? 'Processing...'
            : isSubmitted
            ? 'Confirmed'
            : 'Confirm Booking'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ref: {
    fontSize: 14,
    color: '#666',
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
});
