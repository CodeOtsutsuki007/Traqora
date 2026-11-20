import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PassengerForm } from '../booking/PassengerForm';

describe('PassengerForm Error Recovery', () => {
  it('retains valid entered values and focuses the first actionable error on failure', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({
      success: false,
      errors: {
        lastName: 'Last name is required',
        email: 'Invalid email',
      },
    });

    const { getByTestId } = render(<PassengerForm onSubmit={mockSubmit} />);

    const firstNameInput = getByTestId('firstNameInput');
    const lastNameInput = getByTestId('lastNameInput');
    const emailInput = getByTestId('emailInput');
    const submitButton = getByTestId('submitButton');

    fireEvent.changeText(firstNameInput, 'John');
    fireEvent.changeText(lastNameInput, '');
    fireEvent.changeText(emailInput, 'bad-email');

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: '',
        email: 'bad-email',
      });
    });

    expect(firstNameInput.props.value).toBe('John');
    expect(getByTestId('lastNameError')).toBeTruthy();
    expect(getByTestId('emailError')).toBeTruthy();
  });
});
