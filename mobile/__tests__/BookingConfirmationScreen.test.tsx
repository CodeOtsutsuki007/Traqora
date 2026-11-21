import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingConfirmationScreen from '../BookingConfirmationScreen';

describe('BookingConfirmationScreen', () => {
  const sampleItinerary = [
    {
      flightNumber: 'TRQ101',
      fromAirport: 'JFK',
      toAirport: 'LAX',
      departureTime: '2025-06-01 10:00',
    },
  ];

  it('prevents duplicate confirmation actions and handles submission state safely', async () => {
    const onConfirm = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(
      <BookingConfirmationScreen
        bookingId="12345"
        itinerary={sampleItinerary}
        paymentStatus="pending"
        totalAmount="$450.00"
        onConfirm={onConfirm}
      />
    );
    const confirmButton = screen.getByRole('button', { name: /confirm booking/i });
    confirmButton.click();
    confirmButton.click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirmButton).toBeDisabled();
  });

  it('renders booking confirmation details correctly', () => {
    render(
      <BookingConfirmationScreen
        bookingId="12345"
        itinerary={sampleItinerary}
        paymentStatus="confirmed"
        totalAmount="$450.00"
        transactionHash="abc123def456"
      />
    );

    expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
    expect(screen.getByText('Reference: TRAQ-12345')).toBeInTheDocument();
    expect(screen.getByText('confirmed')).toBeInTheDocument();
    expect(screen.getByText('$450.00')).toBeInTheDocument();
    expect(screen.getByText('Flight TRQ101')).toBeInTheDocument();
    expect(screen.getByText('JFK → LAX')).toBeInTheDocument();
    expect(screen.getByText('abc123def456')).toBeInTheDocument();
  });
});
