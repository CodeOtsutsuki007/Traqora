import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Button } from 'react-native';

interface PassengerFormProps {
  initialValues?: { firstName?: string; lastName?: string; email?: string };
  onSubmit: (values: { firstName: string; lastName: string; email: string }) => Promise<{ success: boolean; errors?: { firstName?: string; lastName?: string; email?: string } }>;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({ initialValues, onSubmit }) => {
  const [firstName, setFirstName] = useState(initialValues?.firstName || '');
  const [lastName, setLastName] = useState(initialValues?.lastName || '');
  const [email, setEmail] = useState(initialValues?.email || '');

  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    const result = await onSubmit({ firstName, lastName, email });
    if (!result.success && result.errors) {
      setErrors(result.errors);
      if (result.errors.firstName && firstNameRef.current) {
        firstNameRef.current.focus();
      } else if (result.errors.lastName && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (result.errors.email && emailRef.current) {
        emailRef.current.focus();
      }
    } else {
      setErrors({});
    }
  };

  return (
    <View>
      <TextInput
        ref={firstNameRef}
        testID="firstNameInput"
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      {errors.firstName && <Text testID="firstNameError">{errors.firstName}</Text>}

      <TextInput
        ref={lastNameRef}
        testID="lastNameInput"
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      {errors.lastName && <Text testID="lastNameError">{errors.lastName}</Text>}

      <TextInput
        ref={emailRef}
        testID="emailInput"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text testID="emailError">{errors.email}</Text>}

      <Button title="Submit" onPress={handleSubmit} testID="submitButton" />
    </View>
  );
};
