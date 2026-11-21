import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

interface CheckoutScreenProps {
  quote: {
    id: string;
    amount: number;
    expiresAt: number;
  };
  onConfirmPayment: () => void;
  currentTime?: number;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  quote,
  onConfirmPayment,
  currentTime = Date.now(),
}) => {
  const [isExpired, setIsExpired] = useState(false);
  const [isCloseToExpiry, setIsCloseToExpiry] = useState(false);

  const EXPIRY_WARNING_THRESHOLD_MS = 60 * 1000; // 1 minute warning window

  useEffect(() => {
    const checkExpiry = () => {
      const now = Date.now();
      if (now >= quote.expiresAt) {
        setIsExpired(true);
      } else if (quote.expiresAt - now <= EXPIRY_WARNING_THRESHOLD_MS) {
        setIsCloseToExpiry(true);
      } else {
        setIsExpired(false);
        setIsCloseToExpiry(false);
      }
    };

    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [quote.expiresAt]);

  const handlePress = () => {
    if (isExpired || Date.now() >= quote.expiresAt) {
      Alert.alert('Quote Expired', 'The accepted quote has expired. Please refresh your quote to proceed.');
      return;
    }
    onConfirmPayment();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.amount}>Amount: ${quote.amount.toFixed(2)}</Text>
      {isCloseToExpiry && !isExpired && (
        <Text style={styles.warningText} testID="quote-expiry-warning">
          Warning: Your quote is close to expiry! Please complete checkout promptly.
        </Text>
      )}
      {isExpired && (
        <Text style={styles.errorText} testID="quote-expired-error">
          Error: Quote has expired. Stale authorization prevented.
        </Text>
      )}
      <Button
        title="Confirm Payment"
        onPress={handlePress}
        disabled={isExpired}
        testID="confirm-payment-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amount: {
    fontSize: 18,
    marginBottom: 20,
  },
  warningText: {
    color: 'orange',
    marginBottom: 15,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});
