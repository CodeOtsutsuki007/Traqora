import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CheckoutScreen from '../booking/CheckoutScreen';

describe('CheckoutScreen Duplicate Submission Prevention', () => {
  it('prevents multiple checkout submissions when clicked repeatedly', async () => {
    let callCount = 0;
    const mockConfirm = jest.fn().mockImplementation(async () => {
      callCount++;
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const { getByTestId } = render(
      <CheckoutScreen onConfirmBooking={mockConfirm} bookingReference="REF-999" />
    );

    const btn = getByTestId('confirm-checkout-btn');

    // Click multiple times rapidly
    fireEvent.press(btn);
    fireEvent.press(btn);
    fireEvent.press(btn);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
