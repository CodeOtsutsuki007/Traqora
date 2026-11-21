import { recoverPassengerForm, PassengerFormData } from '../booking/PassengerFormErrorRecovery';

describe('PassengerFormErrorRecovery', () => {
  it('keeps valid entered values when server validation fails', () => {
    const currentValues: PassengerFormData = {
      firstName: 'Jane',
      lastName: '',
      email: 'jane@example.com',
      passportNumber: '',
    };

    const serverErrors = {
      lastName: 'Last name is required',
      passportNumber: 'Invalid passport number',
    };

    const result = recoverPassengerForm(currentValues, serverErrors);

    expect(result.values.firstName).toBe('Jane');
    expect(result.values.email).toBe('jane@example.com');
    expect(result.errors.lastName).toBe('Last name is required');
    expect(result.firstActionableField).toBe('lastName');
  });
});
