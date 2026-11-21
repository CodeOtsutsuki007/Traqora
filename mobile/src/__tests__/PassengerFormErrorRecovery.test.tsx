import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PassengerFormErrorRecovery } from '../../booking/PassengerFormErrorRecovery';

describe('PassengerFormErrorRecovery', () => {
  it('keeps valid entered values when server validation fails and focuses first error field', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({
      success: false,
      errors: {
        lastName: 'Last name is required',
      },
    });

    const { getByTestId } = render(
      <PassengerFormErrorRecovery
        initialData={{ firstName: 'John', lastName: '', passportNumber: 'AB12345' }}
        onSubmit={mockSubmit}
      />
    );

    const firstNameInput = getByTestId('firstNameInput');
    const passportInput = getByTestId('passportInput');

    expect(firstNameInput.props.value).toBe('John');
    expect(passportInput.props.value).toBe('AB12345');

    const submitButton = getByTestId('firstNameInput'); // Anchor action via submit button
    // Trigger submit via interacting with component
    const { getByText } = render(
      <PassengerFormErrorRecovery
        initialData={{ firstName: 'John', lastName: '', passportNumber: 'AB12345' }}
        onSubmit={mockSubmit}
      />
    );

    // Press button
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: '',
        passportNumber: 'AB12345',
      });
      expect(getByTestId('lastNameError')).toBeTruthy();
    });
  });
});
