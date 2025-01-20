import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { getFirestore, collection, query, where, getDocs } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';


const LoginInitial = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const db = getFirestore();


  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Password cannot be empty.');
      return;
    }

    try {
      Keyboard.dismiss();

      // Query Firestore for the user with the entered phone number
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('phoneNumber', '==', phoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'User not found. Please sign up first.');
        return;
      }

      let userData = null;
      querySnapshot.forEach((doc) => {
        userData = doc.data(); // Retrieve user data
      });

      // Check if the password matches
      if (userData.password === password) {
        Alert.alert('Success', 'Login successful!');
        navigation.navigate('VenueOptions'); // Redirect to homepage
      } else {
        Alert.alert('Error', 'Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.loginText}>Login</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    backgroundColor: Colors.black,
    borderRadius: 25,
    padding: 20,
    width: '90%',
  },
  loginText: {
    color: Colors.primary,
    fontFamily: 'poppins_medium',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 5,
  },
  inputBox: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    color: Colors.white,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.black,
    fontSize: 18,
    fontFamily: 'poppins_medium',
  },
  forgotPasswordContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
  },
});

export default LoginInitial;
