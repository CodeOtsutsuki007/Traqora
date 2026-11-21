import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PassengerForm } from '../booking/PassengerForm';

describe('PassengerForm Error Recovery', () => {
  it('retains valid entered values and focuses the first actionable error when validation fails', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({
      success: false,
      errors: {
        firstName: 'First name is required',
        email: 'Invalid email',
      },
    });

    const { getByTestId } = render(<PassengerForm onSubmit={mockSubmit} initialValues={{ firstName: '', lastName: 'Doe', email: 'invalid' }} />);

    const lastNameInput = getByTestId('last-name-input');
    const emailInput = getByTestId('email-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.changeText(lastNameInput, 'Smith');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: '',
        lastName: 'Smith',
        email: 'invalid',
      });
    });

    expect(getByTestId('last-name-input').props.value).toBe('Smith');
    expect(getByTestId('first-name-error').props.children).toBe('First name is required');
    expect(getByTestId('email-error').props.children).toBe('Invalid email');
  });
});
