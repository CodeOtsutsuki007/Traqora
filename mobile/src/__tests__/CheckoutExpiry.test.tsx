import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CheckoutScreen } from '../screens/CheckoutScreen';

describe('Checkout Quote Expiry', () => {
  it('renders normally when quote is fresh', () => {
    const futureTime = Date.now() + 120000;
    const { queryByTestId, getByText } = render(
      <CheckoutScreen
        quoteExpiresAt={futureTime}
        currentTime={Date.now()}
        onCompleteCheckout={() => {}}
      />
    );
    expect(queryByTestId('expiry-warning')).toBeNull();
    expect(queryByTestId('stale-warning')).toBeNull();
    expect(getByText('Complete Checkout')).toBeTruthy();
  });

  it('warns when quote is close to expiry', () => {
    const now = 1000000;
    const expiresAt = now + 30000; // 30 seconds left (< 60s threshold)
    const { getByTestId } = render(
      <CheckoutScreen
        quoteExpiresAt={expiresAt}
        currentTime={now}
        onCompleteCheckout={() => {}}
      />
    );
    expect(getByTestId('expiry-warning')).toBeTruthy();
  });

  it('prevents checkout when quote is stale', () => {
    const now = 1000000;
    const expiresAt = now - 1000; // already expired
    const handleCheckout = jest.fn();
    const { getByTestId, getByText } = render(
      <CheckoutScreen
        quoteExpiresAt={expiresAt}
        currentTime={now}
        onCompleteCheckout={handleCheckout}
      />
    );
    expect(getByTestId('stale-warning')).toBeTruthy();
    const button = getByText('Complete Checkout');
    fireEvent.press(button);
    expect(handleCheckout).not.toHaveBeenCalled();
  });
});
