import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, PixelRatio, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';

const Signup = () => {
  const { width, height } = Dimensions.get('window');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOTP = () => {
    if (!name || !email || !phoneNumber || phoneNumber.length < 10) {
      setErrorMessage("Please fill out all fields correctly.");
      return;
    }
    Keyboard.dismiss();
    console.log('Sending OTP to', phoneNumber);
  };

  const handleSignUp = () => {
    console.log('Navigate to Signup screen');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.mainContainer} keyboardShouldPersistTaps='handled'>
        <Image
          source={require("./../assets/images/logo_small.png")}
          style={styles.image}
          accessible={true}
          accessibilityLabel="Brand Logo"
          accessibilityHint="Tap to open the home page"
        />

        <View style={[styles.container, { height: height * 0.65 }]}>
          <Text style={styles.loginText}>SignUp</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.registeredText}>FULL NAME</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter your full name"
              value={name}
              onChangeText={(text) => setName(text)}
              accessible={true}
              accessibilityLabel="Name Input"
              accessibilityHint="Enter your full name"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.registeredText}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              accessible={true}
              accessibilityLabel="Email Input"
              accessibilityHint="Enter your email address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.registeredText}>REGISTERED PHONE NUMBER</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
              accessible={true}
              accessibilityLabel="Phone Number Input"
              accessibilityHint="Enter your phone number to receive OTP"
            />
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleSendOTP} accessible={true} accessibilityLabel="Send OTP Button">
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an Account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupLink}>signup</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#FFF'
  },
  image: {
    position: 'absolute',
    top: '1.5%',
    width: '77%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.black,
    borderTopLeftRadius: 49,
    borderTopRightRadius: 49,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  loginText: {
    color: Colors.primary,
    fontFamily: 'poppins_medium',
    fontSize: PixelRatio.getFontScale() * 40,
    marginTop: 5,
  },
  inputWrapper: {
    width: '90%',
    marginTop: 20,
  },
  registeredText: {
    color: Colors.white,
    fontFamily: 'poppins_medium',
    fontSize: 16,
    marginBottom: 10,
  },
  inputBox: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.77)',
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: Colors.white,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'poppins_regular',
    marginTop: 5,
  },
  button: {
    width: '65%',
    height: 50,
    backgroundColor: Colors.primary,
    paddingTop: '2%',
    paddingBottom: '2%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
    marginBottom: '5%',
  },
  buttonText: {
    color: Colors.black,
    fontSize: 30,
    fontFamily: 'poppins_medium',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: Colors.white,
    fontSize: 14,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 14,
    fontFamily: 'poppins_medium',
  },
});

export default Signup;
