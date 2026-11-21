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

  it('disables confirmation button and prevents duplicate submissions on repeat actions', () => {
    const onViewDashboard = jest.fn();
    render(
      <BookingConfirmationScreen
        bookingId="12345"
        itinerary={sampleItinerary}
        paymentStatus="confirmed"
        totalAmount="$450.00"
        transactionHash="abc123def456"
        onViewDashboard={onViewDashboard}
      />
    );

    const button = screen.getByRole('button', { name: /Go to Dashboard/i });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(onViewDashboard).toHaveBeenCalledTimes(1);

    // Verify idempotent/repeated confirmation actions are prevented (button disabled or blocked)
    fireEvent.click(button);
    expect(onViewDashboard).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
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
