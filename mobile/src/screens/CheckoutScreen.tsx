import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CheckoutScreenProps {
  onSubmit: () => Promise<string>;
}

export default function CheckoutScreen({ onSubmit }: CheckoutScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePress = async () => {
    if (isSubmitting || submitted) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Checkout</Text>
      <TouchableOpacity
        testID="submit-checkout-button"
        style={[styles.button, (isSubmitting || submitted) && styles.disabled]}
        disabled={isSubmitting || submitted}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Processing...' : submitted ? 'Confirmed' : 'Confirm & Pay'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
