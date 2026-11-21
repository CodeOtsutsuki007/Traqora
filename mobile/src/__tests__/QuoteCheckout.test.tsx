import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuoteCheckout } from '../../booking/QuoteCheckout';

describe('QuoteCheckout Expiry & Staleness', () => {
  it('renders normally when quote is fresh', () => {
    const now = 1000000;
    const expiresAt = now + 120000; // 2 minutes remaining
    const onAuthorize = jest.fn();

    const { queryByTestId, getByTestId } = render(
      <QuoteCheckout
        quoteId="123"
        createdAt={now}
        expiresAt={expiresAt}
        currentTime={now}
        onAuthorize={onAuthorize}
      />
    );

    expect(queryByTestId('quote-expiry-warning')).toBeNull();
    expect(queryByTestId('quote-expired-error')).toBeNull();

    const button = getByTestId('authorize-button');
    expect(button.props.accessibilityState?.disabled).toBeFalsy();
    fireEvent.press(button);
    expect(onAuthorize).toHaveBeenCalledTimes(1);
  });

  it('shows warning when quote is close to expiry (< 60s)', () => {
    const now = 1000000;
    const expiresAt = now + 30000; // 30 seconds remaining
    const onAuthorize = jest.fn();

    const { getByTestId } = render(
      <QuoteCheckout
        quoteId="123"
        createdAt={now}
        expiresAt={expiresAt}
        currentTime={now}
        onAuthorize={onAuthorize}
      />
    );

    const warning = getByTestId('quote-expiry-warning');
    expect(warning).toBeTruthy();

    const button = getByTestId('authorize-button');
    fireEvent.press(button);
    expect(onAuthorize).toHaveBeenCalledTimes(1);
  });

  it('prevents stale authorization when quote has expired', () => {
    const now = 1000000;
    const expiresAt = now - 1000; // already expired
    const onAuthorize = jest.fn();

    const { getByTestId, queryByTestId } = render(
      <QuoteCheckout
        quoteId="123"
        createdAt={now - 60000}
        expiresAt={expiresAt}
        currentTime={now}
        onAuthorize={onAuthorize}
      />
    );

    expect(getByTestId('quote-expired-error')).toBeTruthy();
    expect(queryByTestId('authorize-button')).toBeNull();
  });
});
