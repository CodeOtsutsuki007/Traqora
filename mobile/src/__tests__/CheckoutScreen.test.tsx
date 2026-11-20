import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CheckoutScreen from '../screens/CheckoutScreen';

describe('CheckoutScreen Duplicate Submission Prevention', () => {
  it('renders correctly with initial state', () => {
    const { getByText, getByTestId } = render(<CheckoutScreen totalAmount="$150.00" />);
    expect(getByText('Secure Checkout')).toBeTruthy();
    expect(getByText('Amount Due: $150.00')).toBeTruthy();
    expect(getByTestId('checkout-submit-button')).toBeTruthy();
    expect(getByTestId('idempotency-token-label')).toBeTruthy();
  });

  it('handles normal successful checkout submission', async () => {
    const onSuccess = jest.fn();
    const { getByTestId, findByText } = render(
      <CheckoutScreen totalAmount="$200.00" onSuccess={onSuccess} />
    );

    const submitButton = getByTestId('checkout-submit-button');
    fireEvent.press(submitButton);

    const completedText = await findByText('Payment Processed');
    expect(completedText).toBeTruthy();
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith(expect.any(String));
  });

  it('prevents duplicate submissions on rapid double-tapping / repeated confirmation actions', async () => {
    const onSuccess = jest.fn();
    const { getByTestId, findByText } = render(
      <CheckoutScreen totalAmount="$350.00" onSuccess={onSuccess} />
    );

    const submitButton = getByTestId('checkout-submit-button');
    
    // Simulate rapid double tap
    fireEvent.press(submitButton);
    fireEvent.press(submitButton);

    const completedText = await findByText('Payment Processed');
    expect(completedText).toBeTruthy();
    // onSuccess must be called exactly once despite multiple press events
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('maintains idempotency token stability and prevents re-submission once completed', async () => {
    const onSuccess = jest.fn();
    const { getByTestId, findByText, queryByTestId } = render(
      <CheckoutScreen totalAmount="$50.00" onSuccess={onSuccess} />
    );

    const tokenLabel = getByTestId('idempotency-token-label').props.children;
    
    const submitButton = getByTestId('checkout-submit-button');
    fireEvent.press(submitButton);

    await findByText('Payment Processed');

    // Button should be replaced by completed state container, preventing further clicks
    expect(queryByTestId('checkout-submit-button')).toBeNull();
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
