import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CheckoutScreen } from '../../booking/CheckoutScreen';

describe('CheckoutScreen Quote Expiry', () => {
  const mockComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders normally when quote is fresh', () => {
    const quote = { id: 'q-1', expiresAt: Date.now() + 120000, amount: 100 };
    const { queryByTestId, getByText } = render(
      <CheckoutScreen quote={quote} currentTime={Date.now()} onCompleteCheckout={mockComplete} />
    );

    expect(queryByTestId('quote-expiry-warning')).toBeNull();
    expect(queryByTestId('quote-expired-error')).toBeNull();
    expect(getByText('Complete Checkout')).toBeTruthy();
  });

  it('warns the traveler when the quote is close to expiry', () => {
    const now = 1000000;
    const quote = { id: 'q-2', expiresAt: now + 30000, amount: 150 }; // 30s remaining
    const { getByTestId } = render(
      <CheckoutScreen quote={quote} currentTime={now} onCompleteCheckout={mockComplete} />
    );

    const warning = getByTestId('quote-expiry-warning');
    expect(warning).toBeTruthy();
  });

  it('prevents checkout and displays stale error when quote is expired', () => {
    const now = 1000000;
    const quote = { id: 'q-3', expiresAt: now - 1000, amount: 200 }; // already expired
    const { getByTestId } = render(
      <CheckoutScreen quote={quote} currentTime={now} onCompleteCheckout={mockComplete} />
    );

    const errorText = getByTestId('quote-expired-error');
    expect(errorText).toBeTruthy();
  });
});
