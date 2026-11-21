import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';

export interface PassengerFormData {
  firstName: string;
  lastName: string;
  email: string;
  passportNumber: string;
}

interface PassengerFormProps {
  initialValues?: PassengerFormData;
  onSubmit: (values: PassengerFormData) => Promise<{ success: boolean; errors?: Partial<Record<keyof PassengerFormData, string>> }>;
}

export const PassengerForm: React.FC<PassengerFormProps> = ({
  initialValues = { firstName: '', lastName: '', email: '', passportNumber: '' },
  onSubmit,
}) => {
  const [values, setValues] = useState<PassengerFormData>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof PassengerFormData, string>>>({});

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passportRef = useRef<TextInput>(null);

  const handleChange = (field: keyof PassengerFormData, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, field: undefined }));
    }
  };

  const handleSubmit = async () => {
    const result = await onSubmit(values);
    if (!result.success && result.errors) {
      setErrors(result.errors);
      const firstErrorField = Object.keys(result.errors)[0] as keyof PassengerFormData;
      if (firstErrorField) {
        if (firstErrorField === 'firstName' && firstNameRef.current) {
          firstNameRef.current.focus();
        } else if (firstErrorField === 'lastName' && lastNameRef.current) {
          lastNameRef.current.focus();
        } else if (firstErrorField === 'email' && emailRef.current) {
          emailRef.current.focus();
        } else if (firstErrorField === 'passportNumber' && passportRef.current) {
          passportRef.current.focus();
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={firstNameRef}
        testID="firstNameInput"
        placeholder="First Name"
        value={values.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
      />
      {errors.firstName && <Text testID="firstNameError" style={styles.error}>{errors.firstName}</Text>}

      <TextInput
        ref={lastNameRef}
        testID="lastNameInput"
        placeholder="Last Name"
        value={values.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
      />
      {errors.lastName && <Text testID="lastNameError" style={styles.error}>{errors.lastName}</Text>}

      <TextInput
        ref={emailRef}
        testID="emailInput"
        placeholder="Email"
        value={values.email}
        onChangeText={(text) => handleChange('email', text)}
      />
      {errors.email && <Text testID="emailError" style={styles.error}>{errors.email}</Text>}

      <TextInput
        ref={passportRef}
        testID="passportInput"
        placeholder="Passport Number"
        value={values.passportNumber}
        onChangeText={(text) => handleChange('passportNumber', text)}
      />
      {errors.passportNumber && <Text testID="passportError" style={styles.error}>{errors.passportNumber}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  error: { color: 'red', marginBottom: 8 },
});
