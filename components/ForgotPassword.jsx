import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  Image
} from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from '@firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from '@firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';
import { Colors } from '@/constants/Colors';
import { PixelRatio } from 'react-native';



const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const recaptchaVerifier = useRef(null);
  const auth = getAuth();
  const firestore = getFirestore();

  const handleCheckPhoneAndSendOTP = async () => {
  if (!phoneNumber || phoneNumber.length < 10) {
    Alert.alert('Error', 'Please enter a valid phone number.');
    return;
  }

  // Clean the phone number to remove any non-numeric characters (like spaces, +, etc.)
  let cleanedPhoneNumber = phoneNumber.replace(/\D+/g, ''); // Removes all non-digit characters
  console.log('Cleaned phone number:', cleanedPhoneNumber);

  // Ensure phone number is exactly 10 digits
  if (cleanedPhoneNumber.length !== 10) {
    console.error('Phone number is not in the correct format. Length:', cleanedPhoneNumber.length);
    Alert.alert('Error', 'Phone number must be exactly 10 digits.');
    return;
  }

  const formattedPhoneNumber = `+91${cleanedPhoneNumber}`; // Format phone number with +91
  console.log('Formatted phone number for Firebase:', formattedPhoneNumber);

  // For Firestore query, use the number without +91
  const firestorePhoneNumber = `91${cleanedPhoneNumber}`;
  console.log('Phone number for Firestore query:', firestorePhoneNumber);

  try {
    // Check if the phone number is registered in Firestore (search without +91)
    const usersCollection = collection(firestore, 'users');
    const phoneQuery = query(usersCollection, where('phoneNumber', '==', firestorePhoneNumber));
    const querySnapshot = await getDocs(phoneQuery);

    console.log('Query snapshot size:', querySnapshot.size);  // Debugging log

    if (querySnapshot.empty) {
      Alert.alert('Error', 'Phone number not registered. Please sign up.');
      return;
    }

    // Proceed with OTP verification
    Keyboard.dismiss();
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(formattedPhoneNumber, recaptchaVerifier.current);
    setVerificationId(verificationId);
    Alert.alert('Success', 'OTP has been sent!');
  } catch (error) {
    console.error('Error sending OTP:', error);
    Alert.alert('Error', error.message);
  }
};

  

  const handleVerifyOTP = async () => {
    if (!otp || !verificationId) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      Alert.alert('Success', 'Phone number verified. Please enter a new password.');
      setVerificationId(null);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid OTP.');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }
  
    try {
      const cleanedPhoneNumber = phoneNumber.replace(/\D+/g, ''); // Clean phone number
      const firestorePhoneNumber = `91${cleanedPhoneNumber}`; // Ensure it has the 91 prefix
  
      console.log('Firestore phone number for query:', firestorePhoneNumber); // Log to ensure correct format
  
      const usersCollection = collection(firestore, 'users');
      const phoneQuery = query(usersCollection, where('phoneNumber', '==', firestorePhoneNumber));
      const querySnapshot = await getDocs(phoneQuery);
      console.log('Query snapshot size:', querySnapshot.size);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        console.log('User document ID:', userDoc.id);
        const userDocRef = doc(firestore, 'users', userDoc.id);
        await updateDoc(userDocRef, {
          password: newPassword,
        });
        Alert.alert('Success', 'Password updated successfully!');
      } else {
        Alert.alert('Error', 'User document not found.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', error.message);
    }
  };
  
  return (
    <View style={styles.mainContainer}>
    {/* Add the logo or decorative image */}
    <Image
              source={require("./../assets/images/logo_small.png")}
              style={styles.image}
              
            />
    
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
    
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        placeholderTextColor="rgba(255, 255, 255, 0.6)" 
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleCheckPhoneAndSendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      {verificationId && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            placeholderTextColor="rgba(255, 255, 255, 0.6)" 

            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {!verificationId && (
        <>
          <TextInput
            style={styles.input}
            placeholderTextColor="rgba(255, 255, 255, 0.6)" 

            placeholder="Enter new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
    </View>
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
    top: '-0.7%',
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
  title: {
    color: Colors.primary,
    fontFamily: 'poppins_medium',
    fontSize: PixelRatio.getFontScale() * 30,
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'rgb(255, 255, 255)',
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
    fontSize: 20,
    fontFamily: 'poppins_medium',
  },
});


export default ForgotPassword;
