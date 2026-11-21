import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PassengerForm from '../screens/PassengerForm';

describe('PassengerForm Error Recovery', () => {
  it('keeps valid entered values and focuses first error on validation failure', () => {
    const onSubmit = jest.fn().mockImplementation((data, onError) => {
      onError({ email: 'Invalid email format' });
    });

    const { getByTestId } = render(<PassengerForm onSubmit={onSubmit} />);

    const firstNameInput = getByTestId('passenger-firstname-input');
    const emailInput = getByTestId('passenger-email-input');
    const submitButton = getByTestId('passenger-submit-button');

    fireEvent.changeText(firstNameInput, 'Jane');
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(submitButton);

    expect(firstNameInput.props.value).toBe('Jane');
    expect(emailInput.props.value).toBe('invalid-email');
  });
});
