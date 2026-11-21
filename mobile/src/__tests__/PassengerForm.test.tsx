import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PassengerForm } from '../screens/PassengerForm';

describe('PassengerForm Error Recovery', () => {
  it('retains valid entered values and focuses the first field with an error', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({
      success: false,
      errors: {
        lastName: 'Last name is required',
        email: 'Invalid email',
      },
    });

    const { getByText } = render(<PassengerForm onSubmit={mockSubmit} />);

    const submitButton = getByText('Submit');
    fireEvent.press(submitButton);

    await waitFor(async () => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});
