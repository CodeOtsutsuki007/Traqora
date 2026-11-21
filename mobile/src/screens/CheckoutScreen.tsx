import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface CheckoutScreenProps {
  flightId: string;
  passengerName: string;
  onConfirmPayment: () => Promise<void> | void;
}

export default function CheckoutScreen({
  flightId,
  passengerName,
  onConfirmPayment,
}: CheckoutScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleCheckout = useCallback(async () => {
    if (isSubmitting || isConfirmed) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirmPayment();
      setIsConfirmed(true);
    } catch (error) {
      console.error('Failed to submit checkout:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, isConfirmed, onConfirmPayment]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checkout Confirmation</Text>
      <Text style={styles.label}>Flight: {flightId}</Text>
      <Text style={styles.label}>Passenger: {passengerName}</Text>
      <TouchableOpacity
        style={[styles.button, (isSubmitting || isConfirmed) && styles.disabledButton]}
        disabled={isSubmitting || isConfirmed}
        onPress={handleCheckout}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isConfirmed ? 'Booking Confirmed' : 'Complete Checkout'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
