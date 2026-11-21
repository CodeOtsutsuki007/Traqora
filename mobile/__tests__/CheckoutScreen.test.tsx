import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CheckoutScreen from '../booking/CheckoutScreen';

describe('CheckoutScreen Duplicate Submission Prevention', () => {
  it('prevents multiple rapid submissions when confirm button is pressed repeatedly', async () => {
    let resolvePromise: (value: void) => void = () => {};
    const mockConfirm = jest.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolvePromise = resolve;
      });
    });

    const { getByRole } = render(
      <CheckoutScreen bookingId="12345" onConfirmCheckout={mockConfirm} />
    );

    const button = getByRole('button');

    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockConfirm).toHaveBeenCalledTimes(1);

    resolvePromise();

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });
});
