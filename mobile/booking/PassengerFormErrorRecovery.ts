export interface PassengerFormData {
  firstName: string;
  lastName: string;
  email: string;
  passportNumber: string;
}

export interface FormErrorState {
  errors: Record<keyof PassengerFormData, string>;
  values: PassengerFormData;
  firstActionableField?: keyof PassengerFormData;
}

export function recoverPassengerForm(currentValues: PassengerFormData, serverErrors: Partial<Record<keyof PassengerFormData, string>>): FormErrorState {
  const errors: Record<keyof PassengerFormData, string> = {
    firstName: serverErrors.firstName || '',
    lastName: serverErrors.lastName || '',
    email: serverErrors.email || '',
    passportNumber: serverErrors.passportNumber || '',
  };

  const fieldOrder: (keyof PassengerFormData)[] = ['firstName', 'lastName', 'email', 'passportNumber'];
  const firstActionableField = fieldOrder.find(field => Boolean(errors[field]));

  return {
    errors,
    values: currentValues,
    firstActionableField,
  };
}
