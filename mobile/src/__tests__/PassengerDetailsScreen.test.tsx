import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PassengerDetailsScreen } from '../screens/PassengerDetailsScreen';

describe('PassengerDetailsScreen Error Recovery', () => {
  it('keeps valid entered values when server validation fails and focuses the first actionable error', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({
      success: false,
      errors: [
        { field: 'email', message: 'Invalid email address' },
        { field: 'passportNumber', message: 'Passport required' },
      ],
    });

    const { getByLabelText } = render(
      <PassengerDetailsScreen
        initialData={{ firstName: 'John', lastName: 'Doe' }}
        onSubmit={mockSubmit}
      />
    );

    const firstNameInput = getByLabelText('First Name');
    const lastNameInput = getByLabelText('Last Name');
    const emailInput = getByLabelText('Email');
    const passportInput = getByLabelText('Passport Number');

    // Verify initial values are retained
    expect(firstNameInput.props.value).toBe('John');
    expect(lastNameInput.props.value).toBe('Doe');

    // Type some new values
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passportInput, '');

    const submitButton = getByLabelText('Submit Passenger Details');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    // Check that valid entered values are preserved despite server validation failure
    expect(firstNameInput.props.value).toBe('John');
    expect(lastNameInput.props.value).toBe('Doe');
    expect(emailInput.props.value).toBe('invalid-email');

    // Verify first actionable error field received focus (email is first error)
    expect(emailInput).toBeFocused();
  });
});
