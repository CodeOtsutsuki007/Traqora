import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { QuoteCheckout } from '../booking/QuoteCheckout';

describe('QuoteCheckout Expiry Warning & Stale Auth Prevention', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders normal state when quote is fresh', () => {
    const now = 1000;
    jest.setSystemTime(now * 1000);

    const { getByTestId, getByText } = render(
      <QuoteCheckout
        quoteTimestamp={now}
        expiryDurationSeconds={300}
        warningThresholdSeconds={60}
        onCompleteCheckout={jest.fn()}
        onQuoteExpired={jest.fn()}
      />
    );

    expect(getByTestId('quote-valid-banner')).toBeTruthy();
    expect(getByText('Complete Booking').props.accessibilityState?.disabled).toBeFalsy();
  });

  it('shows warning banner when quote is close to expiry', () => {
    const now = 1000;
    jest.setSystemTime(now * 1000);

    // 250 seconds elapsed, 50 seconds remaining (within 60s warning threshold)
    const quoteTime = now - 250;

    const { getByTestId } = render(
      <QuoteCheckout
        quoteTimestamp={quoteTime}
        expiryDurationSeconds={300}
        warningThresholdSeconds={60}
        onCompleteCheckout={jest.fn()}
        onQuoteExpired={jest.fn()}
      />
    );

    expect(getByTestId('quote-warning-banner')).toBeTruthy();
  });

  it('prevents checkout and triggers callback when quote expires', () => {
    const now = 1000;
    jest.setSystemTime(now * 1000);

    const quoteTime = now - 300;
    const onQuoteExpired = jest.fn();
    const onCompleteCheckout = jest.fn();

    const { getByTestId, getByText } = render(
      <QuoteCheckout
        quoteTimestamp={quoteTime}
        expiryDurationSeconds={300}
        warningThresholdSeconds={60}
        onCompleteCheckout={onCompleteCheckout}
        onQuoteExpired={onQuoteExpired}
      />
    );

    expect(getByTestId('quote-expired-banner')).toBeTruthy();
    expect(onQuoteExpired).toHaveBeenCalled();

    const button = getByText('Complete Booking');
    fireEvent.press(button);
    expect(onCompleteCheckout).not.toHaveBeenCalled();
  });
});
