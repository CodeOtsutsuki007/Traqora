import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutScreen from '../../booking/checkout';
import PassengerScreen from '../../booking/passenger';

describe('Duplicate Checkout & Passenger Submission Prevention', () => {
  beforeEach(() => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  });

  it('prevents multiple confirmation button clicks on checkout', async () => {
    let resolveConfirm: (value: void) => void = () => {};
    const confirmPromise = new Promise<void>((resolve) => {
      resolveConfirm = resolve;
    });
    const mockOnConfirm = jest.fn().mockReturnValue(confirmPromise);

    render(<CheckoutScreen bookingId="999" onConfirmCheckout={mockOnConfirm} />);

    const button = screen.getByRole('button', { name: /Confirm & Pay/i });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText('Processing...')).toBeInTheDocument();

    // Attempt duplicate click while processing
    fireEvent.click(button);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);

    resolveConfirm();
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('maintains idempotency key across re-renders / browser refresh simulation', () => {
    const bookingId = '888';
    const keyStorageKey = `traqora_checkout_idempotency_${bookingId}`;

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(keyStorageKey, 'existing_test_idemp_key');
    }

    const mockOnConfirm = jest.fn().mockResolvedValue(undefined);
    const { rerender } = render(
      <CheckoutScreen bookingId={bookingId} onConfirmCheckout={mockOnConfirm} />
    );

    rerender(<CheckoutScreen bookingId={bookingId} onConfirmCheckout={mockOnConfirm} />);

    const button = screen.getByRole('button', { name: /Confirm & Pay/i });
    fireEvent.click(button);

    expect(mockOnConfirm).toHaveBeenCalledWith(bookingId, 'existing_test_idemp_key');
  });

  it('prevents duplicate passenger details submissions', async () => {
    let resolveSubmit: (value: void) => void = () => {};
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
    const mockOnSubmit = jest.fn().mockReturnValue(submitPromise);

    render(<PassengerScreen bookingId="777" onSubmitPassengerDetails={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Full Legal Name');
    fireEvent.change(input, { target: { value: 'Jane Doe' } });

    const submitButton = screen.getByRole('button', { name: /Save & Continue/i });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(input).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);

    resolveSubmit();
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
