import React from 'react';
import { render } from '@testing-library/react-native';
import { QuoteCheckout } from '../../booking/QuoteCheckout';

describe('QuoteCheckout Quote Expiry', () => {
  it('renders normal state when quote is far from expiry', () => {
    const now = 1000;
    const expiresAt = now + 500;
    const { getByTestId } = render(
      <QuoteCheckout
        quoteExpiresAt={expiresAt}
        currentTime={now}
        onCompleteCheckout={() => {}}
        onQuoteExpired={() => {}}
      />
    );
    expect(getByTestId('quote-valid')).toBeTruthy();
  });

  it('warns the traveler when quote is close to expiry', () => {
    const now = 1000;
    const expiresAt = now + 30;
    const { getByTestId } = render(
      <QuoteCheckout
        quoteExpiresAt={expiresAt}
        currentTime={now}
        onCompleteCheckout={() => {}}
        onQuoteExpired={() => {}}
      />
    );
    expect(getByTestId('quote-expiry-warning')).toBeTruthy();
  });

  it('prevents stale authorization when quote has expired', () => {
    const now = 1000;
    const expiresAt = now - 10;
    const handleExpired = jest.fn();
    const handleComplete = jest.fn();

    const { getByTestId } = render(
      <QuoteCheckout
        quoteExpiresAt={expiresAt}
        currentTime={now}
        onCompleteCheckout={handleComplete}
        onQuoteExpired={handleExpired}
      />
    );

    expect(getByTestId('quote-stale-error')).toBeTruthy();
    expect(handleExpired).toHaveBeenCalled();

    const btn = getByTestId('complete-checkout-btn');
    expect(btn.props.accessibilityState?.disabled || btn.props.disabled).toBeTruthy();
  });
});
