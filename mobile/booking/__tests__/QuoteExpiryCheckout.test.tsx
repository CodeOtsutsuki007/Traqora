import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuoteExpiryCheckout } from '../QuoteExpiryCheckout';

describe('QuoteExpiryCheckout', () => {
  it('renders normal path when quote is fresh', () => {
    const onConfirm = jest.fn();
    const onExpired = jest.fn();
    const now = 1000;

    const { getByTestId, getByText } = render(
      <QuoteExpiryCheckout
        quoteTimestamp={now}
        expiryDurationSeconds={300}
        onConfirmCheckout={onConfirm}
        onQuoteExpired={onExpired}
        currentTimeOverride={now + 10}
      />
    );

    expect(getByTestId('expiry-ok')).toBeTruthy();
    const btn = getByText('Confirm Payment');
    fireEvent.press(btn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onExpired).not.toHaveBeenCalled();
  });

  it('warns traveler when quote is close to expiry (<= 60s remaining)', () => {
    const onConfirm = jest.fn();
    const onExpired = jest.fn();
    const now = 1000;

    const { getByTestId } = render(
      <QuoteExpiryCheckout
        quoteTimestamp={now}
        expiryDurationSeconds={300}
        onConfirmCheckout={onConfirm}
        onQuoteExpired={onExpired}
        currentTimeOverride={now + 250}
      />
    );

    expect(getByTestId('expiry-warning')).toBeTruthy();
  });

  it('prevents stale authorization when quote is expired', () => {
    const onConfirm = jest.fn();
    const onExpired = jest.fn();
    const now = 1000;

    const { getByTestId, getByText } = render(
      <QuoteExpiryCheckout
        quoteTimestamp={now}
        expiryDurationSeconds={300}
        onConfirmCheckout={onConfirm}
        onQuoteExpired={onExpired}
        currentTimeOverride={now + 301}
      />
    );

    expect(getByTestId('expired-warning')).toBeTruthy();
    expect(onExpired).toHaveBeenCalledTimes(1);

    const btn = getByText('Confirm Payment');
    fireEvent.press(btn);
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
