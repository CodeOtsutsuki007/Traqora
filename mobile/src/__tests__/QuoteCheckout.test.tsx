import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { QuoteCheckout } from '../../booking/QuoteCheckout';

describe('QuoteCheckout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders normal state when quote is fresh', () => {
    const now = Math.floor(Date.now() / 1000);
    const { getByTestId } = render(
      <QuoteCheckout quoteTimestamp={now} expiryDurationSeconds={300} onAuthorize={() => {}} />
    );

    const info = getByTestId('quote-time-info');
    expect(info).toBeTruthy();
  });

  it('shows expiry warning when time is close to expiry (<= 60s)', () => {
    const now = Math.floor(Date.now() / 1000) - 250; // 50 seconds remaining
    const { getByTestId } = render(
      <QuoteCheckout quoteTimestamp={now} expiryDurationSeconds={300} onAuthorize={() => {}} />
    );

    const warning = getByTestId('quote-expiry-warning');
    expect(warning).toBeTruthy();
  });

  it('prevents stale authorization when quote is expired', () => {
    const now = Math.floor(Date.now() / 1000) - 350; // Expired by 50 seconds
    const handleAuthorize = jest.fn();
    const { getByTestId } = render(
      <QuoteCheckout quoteTimestamp={now} expiryDurationSeconds={300} onAuthorize={handleAuthorize} />
    );

    const errorText = getByTestId('quote-expired-error');
    expect(errorText).toBeTruthy();

    const button = getByTestId('authorize-button');
    expect(button.props.accessibilityState?.disabled || button.props.disabled).toBe(true);

    fireEvent.press(button);
    expect(handleAuthorize).not.toHaveBeenCalled();
  });
});
