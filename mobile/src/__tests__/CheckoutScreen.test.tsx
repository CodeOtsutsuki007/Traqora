import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CheckoutScreen from '../screens/CheckoutScreen';

describe('CheckoutScreen Duplicate Submission Prevention', () => {
  it('renders correctly and completes checkout on single press', async () => {
    const mockConfirm = jest.fn().mockResolvedValue(undefined);
    const { getByText } = render(
      <CheckoutScreen
        flightId="TRQ101"
        passengerName="Alice Smith"
        onConfirmPayment={mockConfirm}
      />
    );

    const button = getByText('Complete Checkout');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(getByText('Booking Confirmed')).toBeTruthy();
    });
  });

  it('prevents multiple checkout submissions when pressed rapidly', async () => {
    let resolvePayment: (() => void) | undefined;
    const mockConfirm = jest.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolvePayment = resolve;
      });
    });

    const { getByText } = render(
      <CheckoutScreen
        flightId="TRQ102"
        passengerName="Bob Jones"
        onConfirmPayment={mockConfirm}
      />
    );

    const button = getByText('Complete Checkout');
    
    // Press multiple times rapidly
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockConfirm).toHaveBeenCalledTimes(1);

    if (resolvePayment) {
      resolvePayment();
    }

    await waitFor(() => {
      expect(getByText('Booking Confirmed')).toBeTruthy();
    });
  });

  it('handles validation or failure paths safely allowing retry', async () => {
    const mockConfirm = jest.fn().mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce(undefined);

    const { getByText } = render(
      <CheckoutScreen
        flightId="TRQ103"
        passengerName="Charlie Brown"
        onConfirmPayment={mockConfirm}
      />
    );

    const button = getByText('Complete Checkout');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
    });

    // Button should be active again after failure
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(2);
      expect(getByText('Booking Confirmed')).toBeTruthy();
    });
  });
});
