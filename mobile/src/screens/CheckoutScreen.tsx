import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface CheckoutScreenProps {
  totalAmount: string;
  onSuccess?: (txHash: string) => void;
}

export default function CheckoutScreen({ totalAmount, onSuccess }: CheckoutScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyToken] = useState<string>(() => 'checkout-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9));
  const [hasCompleted, setHasCompleted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSubmitCheckout = useCallback(async () => {
    if (isSubmitting || hasCompleted) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulated checkout execution with idempotency protection
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockHash);
      setHasCompleted(true);
      if (onSuccess) {
        onSuccess(mockHash);
      }
    } catch (error) {
      console.error('Checkout submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, hasCompleted, idempotencyToken, onSuccess]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Secure Checkout</Text>
      <Text style={styles.amount}>Amount Due: {totalAmount}</Text>
      <Text style={styles.tokenLabel} testID="idempotency-token-label">Token: {idempotencyToken}</Text>

      {hasCompleted ? (
        <View style={styles.completedBox}>
          <Text style={styles.completedText}>Payment Processed</Text>
          <Text style={styles.hashText} numberOfLines={1} ellipsizeMode="middle">Tx: {txHash}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.payButton, (isSubmitting || hasCompleted) && styles.disabledButton]}
          onPress={handleSubmitCheckout}
          disabled={isSubmitting || hasCompleted}
          testID="checkout-submit-button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" testID="loading-indicator" />
          ) : (
            <Text style={styles.payButtonText}>Submit Secure Payment</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  amount: { fontSize: 18, marginBottom: 8, textAlign: 'center', color: '#333' },
  tokenLabel: { fontSize: 11, color: '#aaa', textAlign: 'center', marginBottom: 24 },
  payButton: { backgroundColor: '#28a745', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#6c757d' },
  payButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  completedBox: { alignItems: 'center', padding: 16, backgroundColor: '#e2f0d9', borderRadius: 8 },
  completedText: { color: '#385723', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  hashText: { color: '#555', fontSize: 12 },
});
