import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface CheckoutScreenProps {
  bookingId: string;
  onConfirmCheckout: () => Promise<void>;
}

export default function CheckoutScreen({ bookingId, onConfirmCheckout }: CheckoutScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePress = async () => {
    if (isSubmitting || submitted) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirmCheckout();
      setSubmitted(true);
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Checkout</Text>
      <Text style={styles.subtitle}>Booking ID: {bookingId}</Text>
      <TouchableOpacity
        style={[styles.button, (isSubmitting || submitted) && styles.disabledButton]}
        onPress={handlePress}
        disabled={isSubmitting || submitted}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSubmitting || submitted }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{submitted ? 'Confirmed' : 'Confirm & Pay'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  disabledButton: { backgroundColor: '#A0A0A0' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
