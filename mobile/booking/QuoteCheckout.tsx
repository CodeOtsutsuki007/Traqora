import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface QuoteCheckoutProps {
  quoteExpiresAt: number; // timestamp in seconds
  currentTime?: number; // timestamp in seconds
  onCompleteCheckout: () => void;
  onQuoteExpired: () => void;
}

export const QuoteCheckout: React.FC<QuoteCheckoutProps> = ({
  quoteExpiresAt,
  currentTime = Math.floor(Date.now() / 1000),
  onCompleteCheckout,
  onQuoteExpired,
}) => {
  const [isStale, setIsStale] = useState<boolean>(currentTime >= quoteExpiresAt);
  const thresholdSeconds = 60;
  const isCloseToExpiry = !isStale && (quoteExpiresAt - currentTime <= thresholdSeconds);

  useEffect(() => {
    if (currentTime >= quoteExpiresAt) {
      setIsStale(true);
      onQuoteExpired();
    }
  }, [currentTime, quoteExpiresAt, onQuoteExpired]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout & Passenger Details</Text>
      {isStale ? (
        <Text style={styles.errorText} testID="quote-stale-error">
          Quote has expired. Please request a new quote to continue.
        </Text>
      ) : isCloseToExpiry ? (
        <Text style={styles.warningText} testID="quote-expiry-warning">
          Warning: Your accepted quote is close to expiry! Please complete authorization promptly.
        </Text>
      ) : (
        <Text style={styles.validText} testID="quote-valid">
          Quote is valid.
        </Text>
      )}
      <Button
        title="Complete Authorization"
        onPress={onCompleteCheckout}
        disabled={isStale}
        testID="complete-checkout-btn"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  warningText: { color: 'orange', marginBottom: 12, fontWeight: '600' },
  errorText: { color: 'red', marginBottom: 12, fontWeight: '600' },
  validText: { color: 'green', marginBottom: 12 },
});
