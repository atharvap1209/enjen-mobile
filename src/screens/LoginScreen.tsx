import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { isInsideAllowedRegion, FACTORY_GEOFENCE } from '../utils/geofence';

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [organisationId, setOrganisationId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [hasRequestedOtp, setHasRequestedOtp] = useState(false);

  const validateOrgId = (): boolean => {
    return organisationId.trim().length > 0;
  };

  const validatePhoneNumber = (): boolean => {
    return phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);
  };

  const handleGetOtp = async () => {
    // Validate inputs
    if (!validateOrgId()) {
      Alert.alert('Validation Error', 'Please enter Organisation ID');
      return;
    }

    if (!validatePhoneNumber()) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      // Check geofence
      // TODO: Replace with real GPS geofence check
      // This will call expo-location to get current coordinates
      // and verify device is within FACTORY_GEOFENCE radius
      const isInside = await isInsideAllowedRegion(FACTORY_GEOFENCE);

      if (!isInside) {
        Alert.alert(
          'Location Restricted',
          'You are not inside factory area. Please come to factory and try again.'
        );
        return;
      }

      // Show success message
      Alert.alert(
        'OTP Sent',
        'OTP sent to your mobile (demo: use 1234).',
        [{ text: 'OK' }]
      );
      setHasRequestedOtp(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
      console.error('Get OTP error:', error);
    }
  };

  const handleVerifyAndLogin = async () => {
    // Validate all fields
    if (!validateOrgId()) {
      Alert.alert('Validation Error', 'Please enter Organisation ID');
      return;
    }

    if (!validatePhoneNumber()) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (otp.length !== 4 || !/^\d+$/.test(otp)) {
      Alert.alert('Validation Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    try {
      // TODO: Replace with actual OTP API call
      // This will call the backend API to verify OTP
      // Backend will validate OTP against the phone number and organisation ID
      await login({
        organisationId: organisationId.trim(),
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim(),
      });
      // Navigation is handled by AppNavigator based on auth state
    } catch (error) {
      Alert.alert('Login Failed', 'Wrong OTP. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Factory App Login</Text>
        <Text style={styles.instructions}>
          Enter Org ID and Mobile number. You will get OTP.
        </Text>

        {/* Organisation ID Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Organisation ID</Text>
          <TextInput
            style={styles.input}
            value={organisationId}
            onChangeText={setOrganisationId}
            placeholder="Enter Organisation ID"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        {/* Mobile Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => {
              // Only allow digits and limit to 10 characters
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
              setPhoneNumber(numericText);
            }}
            placeholder="Enter 10-digit mobile number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={10}
            editable={!isLoading}
          />
        </View>

        {/* OTP Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>OTP</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={(text) => {
              // Only allow digits and limit to 4 characters
              const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
              setOtp(numericText);
            }}
            placeholder="Enter 4-digit OTP"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={4}
            editable={!isLoading && hasRequestedOtp}
          />
        </View>

        {/* Get OTP Button */}
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleGetOtp}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Get OTP</Text>
          )}
        </TouchableOpacity>

        {/* Verify & Login Button */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonPrimary,
            (!hasRequestedOtp || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleVerifyAndLogin}
          disabled={!hasRequestedOtp || isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Verify & Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: '#111827',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 56,
  },
  buttonPrimary: {
    backgroundColor: '#3B82F6',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

