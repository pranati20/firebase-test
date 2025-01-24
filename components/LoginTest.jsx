import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const PhoneAuthScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const sendVerificationCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setVerificationId(confirmation.verificationId);
      setIsCodeSent(true);
      Alert.alert('Code Sent', 'Please check your phone for the verification code.');
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', error.message);
    }
  };

  const confirmVerificationCode = async () => {
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await auth().signInWithCredential(credential);
      Alert.alert('Success', 'Phone number successfully verified!');
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Phone Authentication</Text>

      {!isCodeSent ? (
        <>
          <TextInput
            placeholder="Enter phone number (e.g., +919876543210)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
          />
          <Button title="Send Code" onPress={sendVerificationCode} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
          />
          <Button title="Verify Code" onPress={confirmVerificationCode} />
        </>
      )}
    </View>
  );
};

export default PhoneAuthScreen;
