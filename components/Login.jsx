//signup 

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  PixelRatio,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import Recaptcha from 'react-native-recaptcha-that-works';

import { getAuth, signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider } from '@firebase/auth';
import { firebaseConfig } from '../firebaseConfig';
import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const { width, height } = Dimensions.get('window');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [otp, setOtp] = useState('');
  const recaptchaVerifier = useRef(null);
  const auth = getAuth();
  const navigation = useNavigation();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    try {
      Keyboard.dismiss();
      const confirmation = await signInWithPhoneNumber(auth, `+${phoneNumber}`, recaptchaVerifier.current);
      setVerificationId(confirmation.verificationId);
      console.log('Verification ID:', confirmation.verificationId);
      Alert.alert('Success', 'OTP has been sent!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || !verificationId) {
      Alert.alert('Error', 'Please enter the OTP received.');
      return;
    }

    try {
      console.log('Verification ID:', verificationId);
      console.log('OTP:', otp);
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      Alert.alert('Success', 'Phone number verified successfully!');
      navigation.navigate('Signup'); // Ensure you have `useNavigation` from `@react-navigation/native` properly set up
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig || DEFAULT_FIREBASE_CONFIG}
      />
      <View style={styles.mainContainer}>
        <Image
          source={require("./../assets/images/logo_small.png")}
          style={styles.image}
          accessible={true}
          accessibilityLabel="Brand Logo"
          accessibilityHint="Tap to open the home page"
        />

        <View style={[styles.container, { height: height * 0.65 }]}>
          <Text style={styles.loginText}>Sign Up</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.registeredText}>REGISTERED PHONE NUMBER               (with Country Code)</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber} 
            />
          </View>

          {verificationId ? (
            <>
              <View style={styles.inputWrapper}>
                <Text style={styles.registeredText}>ENTER OTP</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter OTP"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          )}

          {/* <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don’t have an Account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>signup</Text>
            </TouchableOpacity>
          </View> */}
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
    backgroundColor: '#FFF',
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
    marginTop: 30,
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
  button: {
    width: '65%',
    height: '15%',
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

export default Login;
