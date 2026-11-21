import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

interface PassengerFormData {
  firstName: string;
  lastName: string;
  passportNumber: string;
}

interface PassengerFormErrorRecoveryProps {
  initialData?: PassengerFormData;
  onSubmit: (data: PassengerFormData) => Promise<{ success: boolean; errors?: Partial<Record<keyof PassengerFormData, string>> }>;
}

export const PassengerFormErrorRecovery: React.FC<PassengerFormErrorRecoveryProps> = ({
  initialData = { firstName: '', lastName: '', passportNumber: '' },
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PassengerFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof PassengerFormData, string>>>({});

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const passportRef = useRef<TextInput>(null);

  const handleChange = (field: keyof PassengerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const result = await onSubmit(formData);
    if (!result.success && result.errors) {
      setErrors(result.errors);
      if (result.errors.firstName && firstNameRef.current) {
        firstNameRef.current.focus();
      } else if (result.errors.lastName && lastNameRef.current) {
        lastNameRef.current.focus();
      } else if (result.errors.passportNumber && passportRef.current) {
        passportRef.current.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        ref={firstNameRef}
        testID="firstNameInput"
        style={styles.input}
        value={formData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
      />
      {errors.firstName && <Text style={styles.errorText} testID="firstNameError">{errors.firstName}</Text>}

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        ref={lastNameRef}
        testID="lastNameInput"
        style={styles.input}
        value={formData.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
      />
      {errors.lastName && <Text style={styles.errorText} testID="lastNameError">{errors.lastName}</Text>}

      <Text style={styles.label}>Passport Number</Text>
      <TextInput
        ref={passportRef}
        testID="passportInput"
        style={styles.input}
        value={formData.passportNumber}
        onChangeText={(text) => handleChange('passportNumber', text)}
      />
      {errors.passportNumber && <Text style={styles.errorText} testID="passportError">{errors.passportNumber}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 14, marginBottom: 4, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
});
