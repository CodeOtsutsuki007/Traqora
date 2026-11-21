import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface Quote {
  id: string;
  expiresAt: number;
  amount: number;
}

interface CheckoutScreenProps {
  quote: Quote;
  currentTime?: number;
  onCompleteCheckout: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  quote,
  currentTime = Date.now(),
  onCompleteCheckout,
}) => {
  const [now, setNow] = useState(currentTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isExpired = now >= quote.expiresAt;
  const timeRemaining = quote.expiresAt - now;
  const isCloseToExpiry = !isExpired && timeRemaining <= 60000; // 1 minute warning

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text>Quote ID: {quote.id}</Text>
      <Text>Amount: ${quote.amount}</Text>

      {isExpired ? (
        <Text testID="quote-expired-error" style={styles.errorText}>
          This quote has expired. Please refresh your quote to proceed.
        </Text>
      ) : isCloseToExpiry ? (
        <Text testID="quote-expiry-warning" style={styles.warningText}>
          Warning: This quote is close to expiry! Please complete your checkout promptly.
        </Text>
      ) : null}

      <Button
        title="Complete Checkout"
        disabled={isExpired}
        onPress={onCompleteCheckout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  warningText: { color: 'orange', marginVertical: 8, fontWeight: '600' },
  errorText: { color: 'red', marginVertical: 8, fontWeight: '600' },
});
