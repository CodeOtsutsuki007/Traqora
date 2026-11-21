import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface PassengerFormProps {
  onSubmit: (values: { firstName: string; lastName: string; email: string }) => Promise<{ success: boolean; errors?: { firstName?: string; lastName?: string; email?: string } }>;
  initialValues?: { firstName?: string; lastName?: string; email?: string };
}

export const PassengerForm: React.FC<PassengerFormProps> = ({ onSubmit, initialValues }) => {
  const [firstName, setFirstName] = useState(initialValues?.firstName || '');
  const [lastName, setLastName] = useState(initialValues?.lastName || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    setErrors({});
    const result = await onSubmit({ firstName, lastName, email });
    if (!result.success && result.errors) {
      setErrors(result.errors);
      if (result.errors.firstName) {
        firstNameRef.current?.focus();
      } else if (result.errors.lastName) {
        lastNameRef.current?.focus();
      } else if (result.errors.email) {
        emailRef.current?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Passenger Details</Text>
      <TextInput
        ref={firstNameRef}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        testID="first-name-input"
      />
      {errors.firstName && <Text testID="first-name-error" style={styles.error}>{errors.firstName}</Text>}

      <TextInput
        ref={lastNameRef}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        testID="last-name-input"
      />
      {errors.lastName && <Text testID="last-name-error" style={styles.error}>{errors.lastName}</Text>}

      <TextInput
        ref={emailRef}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        testID="email-input"
      />
      {errors.email && <Text testID="email-error" style={styles.error}>{errors.email}</Text>}

      <Button title="Submit" onPress={handleSubmit} testID="submit-button" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  error: { color: 'red', marginBottom: 8 },
});
