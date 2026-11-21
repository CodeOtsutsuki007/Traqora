import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');

describe('CheckoutScreen Quote Expiry', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders normally when quote is fresh', () => {
    const futureTime = Date.now() + 10 * 60 * 1000;
    const quote = { id: 'q1', amount: 150, expiresAt: futureTime };
    const onConfirm = jest.fn();

    const { queryByTestId, getByTestId } = render(
      <CheckoutScreen quote={quote} onConfirmPayment={onConfirm} />
    );

    expect(queryByTestId('quote-expiry-warning')).toBeNull();
    expect(queryByTestId('quote-expired-error')).toBeNull();

    fireEvent.press(getByTestId('confirm-payment-button'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('warns the traveler when quote is close to expiry', () => {
    const nearExpiryTime = Date.now() + 30 * 1000; // 30 seconds left
    const quote = { id: 'q2', amount: 200, expiresAt: nearExpiryTime };
    const onConfirm = jest.fn();

    const { getByTestId } = render(
      <CheckoutScreen quote={quote} onConfirmPayment={onConfirm} />
    );

    expect(getByTestId('quote-expiry-warning')).toBeTruthy();
    fireEvent.press(getByTestId('confirm-payment-button'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('prevents stale authorization and disables payment when quote has expired', () => {
    const expiredTime = Date.now() - 1000; // already expired
    const quote = { id: 'q3', amount: 250, expiresAt: expiredTime };
    const onConfirm = jest.fn();

    const { getByTestId } = render(
      <CheckoutScreen quote={quote} onConfirmPayment={onConfirm} />
    );

    expect(getByTestId('quote-expired-error')).toBeTruthy();
    const button = getByTestId('confirm-payment-button');
    expect(button.props.accessibilityState?.disabled || button.props.disabled).toBeTruthy();

    fireEvent.press(button);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Quote Expired',
      'The accepted quote has expired. Please refresh your quote to proceed.'
    );
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
