import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface QuoteExpiryCheckoutProps {
  quoteTimestamp: number;
  expiryDurationSeconds?: number;
  onConfirmCheckout: () => void;
  onQuoteExpired: () => void;
  currentTimeOverride?: number;
}

export const QuoteExpiryCheckout: React.FC<QuoteExpiryCheckoutProps> = ({
  quoteTimestamp,
  expiryDurationSeconds = 300,
  onConfirmCheckout,
  onQuoteExpired,
  currentTimeOverride,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(
    currentTimeOverride !== undefined ? currentTimeOverride : Math.floor(Date.now() / 1000)
  );

  useEffect(() => {
    if (currentTimeOverride !== undefined) return;
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTimeOverride]);

  const expiryTime = quoteTimestamp + expiryDurationSeconds;
  const secondsRemaining = expiryTime - currentTime;
  const isExpired = secondsRemaining <= 0;
  const isCloseToExpiry = !isExpired && secondsRemaining <= 60;

  useEffect(() => {
    if (isExpired) {
      onQuoteExpired();
    }
  }, [isExpired, onQuoteExpired]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout Summary</Text>
      {isExpired ? (
        <Text testID="expired-warning" style={styles.errorText}>
          Quote has expired. Please refresh to continue.
        </Text>
      ) : isCloseToExpiry ? (
        <Text testID="expiry-warning" style={styles.warningText}>
          Warning: Quote is close to expiry ({secondsRemaining}s remaining)!
        </Text>
      ) : (
        <Text testID="expiry-ok" style={styles.okText}>
          Quote valid ({secondsRemaining}s remaining).
        </Text>
      )}
      <Button
        title="Confirm Payment"
        onPress={onConfirmCheckout}
        disabled={isExpired}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  okText: { color: 'green', marginBottom: 12 },
  warningText: { color: 'orange', fontWeight: 'bold', marginBottom: 12 },
  errorText: { color: 'red', fontWeight: 'bold', marginBottom: 12 },
});
