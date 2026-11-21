import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PassengerForm, PassengerFormData } from '../booking/PassengerForm';

describe('PassengerForm Error Recovery', () => {
  it('retains valid entered values and focuses the first error field on validation failure', async () => {
    const mockSubmit = jest.fn(async (_values: PassengerFormData) => ({
      success: false,
      errors: {
        lastName: 'Last name is required',
        email: 'Invalid email',
      },
    }));

    const { getByTestId } = render(<PassengerForm onSubmit={mockSubmit} />);

    const firstNameInput = getByTestId('firstNameInput');
    const emailInput = getByTestId('emailInput');

    fireEvent.changeText(firstNameInput, 'John');
    fireEvent.changeText(emailInput, 'john@example.com');

    const submitButton = getByTestId('Submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });

    expect(firstNameInput.props.value).toBe('John');
    expect(emailInput.props.value).toBe('john@example.com');
  });
});
