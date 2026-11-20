import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface QuoteCheckoutProps {
  quoteTimestamp: number;
  expiryDurationSeconds?: number;
  onAuthorize: () => void;
  onQuoteExpired?: () => void;
}

export const QuoteCheckout: React.FC<QuoteCheckoutProps> = ({
  quoteTimestamp,
  expiryDurationSeconds = 300,
  onAuthorize,
  onQuoteExpired,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = quoteTimestamp + expiryDurationSeconds;
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        if (onQuoteExpired) {
          onQuoteExpired();
        }
      } else {
        setTimeLeft(remaining);
        setIsExpired(false);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [quoteTimestamp, expiryDurationSeconds, onQuoteExpired]);

  const isCloseToExpiry = timeLeft > 0 && timeLeft <= 60;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout & Passenger Details</Text>
      {isExpired ? (
        <Text style={styles.errorText} testID="quote-expired-error">
          Quote has expired. Please refresh to continue.
        </Text>
      ) : isCloseToExpiry ? (
        <Text style={styles.warningText} testID="quote-expiry-warning">
          Warning: Quote is close to expiry! ({timeLeft}s remaining)
        </Text>
      ) : (
        <Text style={styles.infoText} testID="quote-time-info">
          Time remaining to authorize: {timeLeft}s
        </Text>
      )}
      <Button
        title="Authorize Booking"
        onPress={onAuthorize}
        disabled={isExpired}
        testID="authorize-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  infoText: { fontSize: 14, color: '#333', marginBottom: 12 },
  warningText: { fontSize: 14, color: '#d9534f', fontWeight: 'bold', marginBottom: 12 },
  errorText: { fontSize: 14, color: '#d9534f', fontWeight: 'bold', marginBottom: 12 },
});
