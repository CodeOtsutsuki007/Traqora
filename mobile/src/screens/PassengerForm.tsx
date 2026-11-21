import React, { useState, useRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PassengerFormProps {
  onSubmit: (data: { firstName: string; email: string }, onError: (errors: Record<string, string>) => void) => void;
}

export default function PassengerForm({ onSubmit }: PassengerFormProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emailRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    onSubmit({ firstName, email }, (serverErrors) => {
      setErrors(serverErrors);
      if (serverErrors.email) {
        emailRef.current?.focus();
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        testID="passenger-firstname-input"
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      {errors.firstName && <Text>{errors.firstName}</Text>}

      <TextInput
        ref={emailRef}
        testID="passenger-email-input"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text>{errors.email}</Text>}

      <TouchableOpacity testID="passenger-submit-button" onPress={handleSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
