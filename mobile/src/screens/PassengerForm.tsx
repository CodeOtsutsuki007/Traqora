import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';

export interface PassengerFormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PassengerFormProps {
  initialValues?: PassengerFormData;
  onSubmit: (values: PassengerFormData) => Promise<{ success: boolean; errors?: Record<string, string> }>;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({
  initialValues = { firstName: '', lastName: '', email: '' },
  onSubmit,
}) => {
  const [values, setValues] = useState<PassengerFormData>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    const res = await onSubmit(values);
    if (!res.success && res.errors) {
      setErrors(res.errors);
      if (res.errors.firstName && firstNameRef.current) {
        firstNameRef.current.focus();
      } else if (res.errors.lastName && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (res.errors.email && emailRef.current) {
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
        value={values.firstName}
        onChangeText={(text) => setValues({ ...values, firstName: text })}
      />
      {errors.firstName && <Text testID="firstNameError">{errors.firstName}</Text>}

      <TextInput
        ref={lastNameRef}
        testID="lastNameInput"
        placeholder="Last Name"
        value={values.lastName}
        onChangeText={(text) => setValues({ ...values, lastName: text })}
      />
      {errors.lastName && <Text testID="lastNameError">{errors.lastName}</Text>}

      <TextInput
        ref={emailRef}
        testID="emailInput"
        placeholder="Email"
        value={values.email}
        onChangeText={(text) => setValues({ ...values, email: text })}
      />
      {errors.email && <Text testID="emailError">{errors.email}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};
