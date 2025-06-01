// trading-post-mobile/src/Auth/RegisterForm.tsx

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { spacing, typography, colors, radii, shadows } from '../theme';

const RegisterForm: React.FC = () => {
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    if (!fullName || !email || !password) {
      setError('Name, email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await authService.register({
        full_name: fullName,
        email,
        password,
        address,
      });
      await signIn(token, user);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor={colors.textSecondary}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Address (optional)"
        placeholderTextColor={colors.textSecondary}
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color={colors.background} />
          : <Text style={styles.buttonText}>Register</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
  },
  input: {
    height: 48,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.medium,
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.small,
    fontFamily: typography.body,
    fontSize: typography.size.medium,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.medium,
    paddingVertical: spacing.small,
    alignItems: 'center',
    marginTop: spacing.small,
    ...shadows.medium,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    fontFamily: typography.heading,
    fontSize: typography.size.medium,
    color: colors.background,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.body,
    marginBottom: spacing.small,
    textAlign: 'center',
  },
});

export default RegisterForm;
