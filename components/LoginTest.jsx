// Basic Signup Page using React Native Firebase for Phone Authentication

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const PhoneAuthScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('Code Sent', 'Please enter the code sent to your phone.');
    } catch (error) {
      console.error('Phone authentication failed:', error);
      Alert.alert('Error', error.message);
    }
  };

  const confirmCode = async () => {
    if (!confirm) return;
    try {
      await confirm.confirm(code);
      Alert.alert('Success', 'Phone number authenticated!');
    } catch (error) {
      console.error('Invalid code:', error);
      Alert.alert('Error', 'Invalid code. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Phone Authentication
      </Text>
      {!confirm ? (
        <>
          <TextInput
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderRadius: 5 }}
          />
          <Button title="Send Code" onPress={signInWithPhoneNumber} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderRadius: 5 }}
          />
          <Button title="Verify Code" onPress={confirmCode} />
        </>
      )}
    </View>
  );
};

export default PhoneAuthScreen;
