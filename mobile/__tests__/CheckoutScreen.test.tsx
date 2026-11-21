import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutScreen from '../booking/CheckoutScreen';

describe('CheckoutScreen Duplicate Submission Prevention', () => {
  it('prevents multiple checkout submissions when clicked repeatedly', async () => {
    const mockConfirm = jest.fn().mockResolvedValue('BK-999');
    const mockSuccess = jest.fn();

    render(
      <CheckoutScreen
        onConfirmBooking={mockConfirm}
        onBookingSuccess={mockSuccess}
      />
    );

    const button = screen.getByRole('button', { name: /Confirm & Pay/i });

    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith('BK-999');
    });

    expect(screen.getByText('Booking Confirmed')).toBeInTheDocument();
  });
});
