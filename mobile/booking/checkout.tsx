import React, { useState, useEffect } from 'react';

interface CheckoutProps {
  bookingId: string;
  onConfirmCheckout: (id: string, idempotencyKey: string) => Promise<void>;
}

export default function CheckoutScreen({ bookingId, onConfirmCheckout }: CheckoutProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  useEffect(() => {
    const keyStorageKey = `traqora_checkout_idempotency_${bookingId}`;
    let existingKey = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(keyStorageKey) : null;
    if (!existingKey) {
      existingKey = 'idemp_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(keyStorageKey, existingKey);
      }
    }
    setIdempotencyKey(existingKey);
  }, [bookingId]);

  const handleCheckoutSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirmCheckout(bookingId, idempotencyKey);
    } catch (error) {
      console.error('Checkout failed:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Complete Checkout</h1>
      <p>Booking Reference: TRAQ-{bookingId}</p>
      <button
        disabled={isSubmitting}
        onClick={handleCheckoutSubmit}
        className="confirm-checkout-btn"
      >
        {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
      </button>
    </div>
  );
}
