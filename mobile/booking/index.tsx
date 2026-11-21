import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface BookingIndexProps {
  onCompleteBooking?: (details: any) => Promise<any> | void;
}

export default function BookingIndex({ onCompleteBooking }: BookingIndexProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleConfirmCheckout = useCallback(async () => {
    if (isSubmitting || submitted) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (onCompleteBooking) {
        await onCompleteBooking({ timestamp: Date.now() });
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Checkout submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, submitted, onCompleteBooking]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Checkout</Text>
      <Button
        title={isSubmitting ? 'Processing...' : submitted ? 'Confirmed' : 'Confirm Checkout'}
        disabled={isSubmitting || submitted}
        onPress={handleConfirmCheckout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
