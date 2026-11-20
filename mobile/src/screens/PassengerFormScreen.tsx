import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';

interface PassengerFormData {
  firstName: string;
  lastName: string;
  passportNumber: string;
}

export default function PassengerFormScreen({ onSubmit }: { onSubmit: (data: PassengerFormData) => Promise<{ errors?: Record<string, string> }> }) {
  const [formData, setFormData] = useState<PassengerFormData>({
    firstName: '',
    lastName: '',
    passportNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const passportRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    const response = await onSubmit(formData);
    if (response && response.errors) {
      setErrors(response.errors);
      if (response.errors.firstName) {
        firstNameRef.current?.focus();
      } else if (response.errors.lastName) {
        lastNameRef.current?.focus();
      } else if (response.errors.passportNumber) {
        passportRef.current?.focus();
      }
    } else {
      setErrors({});
    }
  };

  return (
    <View>
      <TextInput
        ref={firstNameRef}
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
      />
      {errors.firstName && <Text testID="error-firstName">{errors.firstName}</Text>}

      <TextInput
        ref={lastNameRef}
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
      />
      {errors.lastName && <Text testID="error-lastName">{errors.lastName}</Text>}

      <TextInput
        ref={passportRef}
        placeholder="Passport Number"
        value={formData.passportNumber}
        onChangeText={(text) => setFormData({ ...formData, passportNumber: text })}
      />
      {errors.passportNumber && <Text testID="error-passportNumber">{errors.passportNumber}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
