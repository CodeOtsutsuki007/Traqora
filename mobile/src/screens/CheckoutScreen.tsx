import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface CheckoutScreenProps {
  quoteExpiresAt: number;
  currentTime?: number;
  onCompleteCheckout: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  quoteExpiresAt,
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

  const thresholdMs = 60 * 1000;
  const isStale = now >= quoteExpiresAt;
  const isCloseToExpiry = !isStale && quoteExpiresAt - now <= thresholdMs;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout & Passenger Details</Text>
      {isStale ? (
        <Text testID="stale-warning" style={styles.errorText}>
          Quote has expired. Please refresh your quote to proceed.
        </Text>
      ) : isCloseToExpiry ? (
        <Text testID="expiry-warning" style={styles.warningText}>
          Warning: Your accepted quote is close to expiry!
        </Text>
      ) : null}
      <Button
        title="Complete Checkout"
        disabled={isStale}
        onPress={onCompleteCheckout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  warningText: { color: 'orange', marginBottom: 12 },
  errorText: { color: 'red', marginBottom: 12 },
});
