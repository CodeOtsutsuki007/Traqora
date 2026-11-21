import React, { useState, useEffect } from 'react';

interface PassengerDetailsProps {
  bookingId: string;
  onSubmitPassengerDetails: (details: any, idempotencyKey: string) => Promise<void>;
}

export default function PassengerScreen({ bookingId, onSubmitPassengerDetails }: PassengerDetailsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [passengerName, setPassengerName] = useState('');

  useEffect(() => {
    const keyStorageKey = `traqora_passenger_idempotency_${bookingId}`;
    let existingKey = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(keyStorageKey) : null;
    if (!existingKey) {
      existingKey = 'pass_idemp_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(keyStorageKey, existingKey);
      }
    }
    setIdempotencyKey(existingKey);
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmitPassengerDetails({ bookingId, passengerName }, idempotencyKey);
    } catch (error) {
      console.error('Passenger details submission failed:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="passenger-form">
      <h2>Passenger Details</h2>
      <input
        type="text"
        value={passengerName}
        onChange={(e) => setPassengerName(e.target.value)}
        placeholder="Full Legal Name"
        disabled={isSubmitting}
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Save & Continue'}
      </button>
    </form>
  );
}
