import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BookingIndex from '../booking/index';

describe('BookingFlow Duplicate Submission Prevention', () => {
  it('prevents duplicate submissions on rapid clicks', async () => {
    let resolveBooking: (() => void) | undefined;
    const mockComplete = jest.fn().mockImplementation(() => {
      return new Promise<void>((resolve) => {
        resolveBooking = resolve;
      });
    });

    const { getByText } = render(<BookingIndex onCompleteBooking={mockComplete} />);

    const button = getByText('Confirm Checkout');

    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    expect(mockComplete).toHaveBeenCalledTimes(1);

    if (resolveBooking) {
      resolveBooking();
    }

    await waitFor(() => {
      expect(getByText('Confirmed')).toBeTruthy();
    });
  });
});
