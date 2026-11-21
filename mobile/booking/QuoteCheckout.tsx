import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface QuoteCheckoutProps {
  quoteId: string;
  createdAt: number;
  expiresAt: number;
  currentTime?: number;
  onAuthorize: () => void;
}

export const QuoteCheckout: React.FC<QuoteCheckoutProps> = ({
  quoteId,
  createdAt,
  expiresAt,
  currentTime = Date.now(),
  onAuthorize,
}) => {
  const [now, setNow] = useState(currentTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeLeft = expiresAt - now;
  const isExpired = timeLeft <= 0;
  // Warn if less than 60 seconds (60000 ms) remain before expiry
  const isCloseToExpiry = !isExpired && timeLeft <= 60000;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout Quote #{quoteId}</Text>
      {isExpired ? (
        <Text style={styles.errorText} testID="quote-expired-error">
          Quote has expired. Stale authorization prevented.
        </Text>
      ) : (
        <>
          {isCloseToExpiry && (
            <Text style={styles.warningText} testID="quote-expiry-warning">
              Warning: Quote is close to expiry ({Math.ceil(timeLeft / 1000)}s remaining).
            </Text>
          )}
          <Button
            title="Authorize Payment"
            onPress={onAuthorize}
            disabled={isExpired}
            testID="authorize-button"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  warningText: { color: 'orange', marginBottom: 12 },
  errorText: { color: 'red', marginBottom: 12, fontWeight: 'bold' },
});
