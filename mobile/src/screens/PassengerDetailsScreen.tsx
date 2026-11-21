import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface PassengerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber: string;
}

interface ValidationError {
  field: keyof PassengerFormData;
  message: string;
}

interface PassengerDetailsScreenProps {
  initialData?: Partial<PassengerFormData>;
  onSubmit: (data: PassengerFormData) => Promise<{ success: boolean; errors?: ValidationError[] }>;
}

export const PassengerDetailsScreen: React.FC<PassengerDetailsScreenProps> = ({
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PassengerFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    passportNumber: initialData?.passportNumber || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passportRef = useRef<TextInput>(null);

  const fieldRefs: Record<keyof PassengerFormData, React.RefObject<TextInput>> = {
    firstName: firstNameRef,
    lastName: lastNameRef,
    email: emailRef,
    phone: phoneRef,
    passportNumber: passportRef,
  };

  const handleChange = (field: keyof PassengerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await onSubmit(formData);
      if (!result.success && result.errors) {
        const newErrors: Record<string, string> = {};
        let firstErrorField: keyof PassengerFormData | null = null;

        result.errors.forEach((err) => {
          newErrors[err.field] = err.message;
          if (!firstErrorField) {
            firstErrorField = err.field;
          }
        });

        setErrors(newErrors);

        if (firstErrorField && fieldRefs[firstErrorField]?.current) {
          fieldRefs[firstErrorField].current?.focus();
        }
      }
    } catch (e) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Passenger Details</Text>
        {errors.general ? <Text style={styles.errorText}>{errors.general}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            ref={firstNameRef}
            style={[styles.input, errors.firstName ? styles.inputError : null]}
            value={formData.firstName}
            onChangeText={(val) => handleChange('firstName', val)}
            placeholder="Enter first name"
            accessibilityLabel="First Name"
          />
          {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            ref={lastNameRef}
            style={[styles.input, errors.lastName ? styles.inputError : null]}
            value={formData.lastName}
            onChangeText={(val) => handleChange('lastName', val)}
            placeholder="Enter last name"
            accessibilityLabel="Last Name"
          />
          {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            ref={emailRef}
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={formData.email}
            onChangeText={(val) => handleChange('email', val)}
            placeholder="Enter email"
            keyboardType="email-address"
            accessibilityLabel="Email"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            ref={phoneRef}
            style={[styles.input, errors.phone ? styles.inputError : null]}
            value={formData.phone}
            onChangeText={(val) => handleChange('phone', val)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            accessibilityLabel="Phone Number"
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Passport Number</Text>
          <TextInput
            ref={passportRef}
            style={[styles.input, errors.passportNumber ? styles.inputError : null]}
            value={formData.passportNumber}
            onChangeText={(val) => handleChange('passportNumber', val)}
            placeholder="Enter passport number"
            accessibilityLabel="Passport Number"
          />
          {errors.passportNumber ? <Text style={styles.errorText}>{errors.passportNumber}</Text> : null}
        </View>

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          accessibilityLabel="Submit Passenger Details"
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Submitting...' : 'Continue'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007aff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#99c2ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
