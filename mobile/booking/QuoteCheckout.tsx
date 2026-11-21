import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface QuoteCheckoutProps {
  quoteTimestamp: number;
  expiryDurationSeconds?: number;
  warningThresholdSeconds?: number;
  onCompleteCheckout: () => void;
  onQuoteExpired: () => void;
}

export const QuoteCheckout: React.FC<QuoteCheckoutProps> = ({
  quoteTimestamp,
  expiryDurationSeconds = 300,
  warningThresholdSeconds = 60,
  onCompleteCheckout,
  onQuoteExpired,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(Date.now() / 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now() / 1000);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const expiresAt = quoteTimestamp + expiryDurationSeconds;
  const timeLeft = Math.max(0, expiresAt - currentTime);
  const isExpired = timeLeft === 0;
  const isCloseToExpiry = !isExpired && timeLeft <= warningThresholdSeconds;

  useEffect(() => {
    if (isExpired) {
      onQuoteExpired();
    }
  }, [isExpired, onQuoteExpired]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout Quote Summary</Text>
      {isExpired ? (
        <Text style={styles.errorText} testID="quote-expired-banner">
          Quote has expired! Please fetch a new quote before proceeding.
        </Text>
      ) : isCloseToExpiry ? (
        <Text style={styles.warningText} testID="quote-warning-banner">
          Warning: Your quote is close to expiry ({Math.ceil(timeLeft)}s remaining).
        </Text>
      ) : (
        <Text style={styles.infoText} testID="quote-valid-banner">
          Quote valid ({Math.ceil(timeLeft)}s remaining).
        </Text>
      )}
      <Button
        title="Complete Booking"
        disabled={isExpired}
        onPress={onCompleteCheckout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  errorText: { color: 'red', marginBottom: 12, fontWeight: 'bold' },
  warningText: { color: 'orange', marginBottom: 12, fontWeight: 'bold' },
  infoText: { color: 'green', marginBottom: 12 },
});
