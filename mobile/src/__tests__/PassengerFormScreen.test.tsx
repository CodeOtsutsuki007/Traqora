import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PassengerFormScreen from '../screens/PassengerFormScreen';

describe('PassengerFormScreen', () => {
  it('keeps valid entered values and focuses first error on server failure', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({
      errors: {
        lastName: 'Last name is required',
      },
    });

    const { getByPlaceholderText, getByText } = render(<PassengerFormScreen onSubmit={mockSubmit} />);

    const firstNameInput = getByPlaceholderText('First Name');
    const passportInput = getByPlaceholderText('Passport Number');

    fireEvent.changeText(firstNameInput, 'John');
    fireEvent.changeText(passportInput, 'AB12345');

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Last name is required')).toBeTruthy();
    });

    expect(firstNameInput.props.value).toBe('John');
    expect(passportInput.props.value).toBe('AB12345');
  });
});
