import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { db } from "../firebaseConfig"; // Import Firestore
import { collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook


const { height } = Dimensions.get("window");

const Signup = () => {
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(""); // Added email
  const [password, setPassword] = useState(""); // Added password
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const validateAadhaar = useCallback((aadhaar) => /^[A-Za-z0-9]{12}$/.test(aadhaar), []);
  const validatePhoneNumber = useCallback((phone) => /^[0-9]{10}$/.test(phone), []);
  const validateEmail = useCallback((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), []);
  const validatePassword = useCallback((password) => password.length >= 6, []);
  const navigation = useNavigation(); 
  const handleSendOTP = async () => {
    if (!name || !validateAadhaar(aadhaar) || !validatePhoneNumber(phoneNumber) || !validateEmail(email) || !validatePassword(password)) {
      setErrorMessage(
        "Please provide valid details: Name, Aadhaar (12 alphanumeric), Phone Number, Email, and Password (min 6 characters)."
      );
      setIsModalVisible(true);
      return;
    }
    const fullPhoneNumber = `91${phoneNumber}`;

    try {
      const docRef = await addDoc(collection(db, "users"), {
        name,
        aadhaar,
        phoneNumber:fullPhoneNumber,
        email,
        password, // Store securely (hash in production)
        createdAt: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
      alert("Signup successful!");
      navigation.navigate("VenueOptions");
      setName("");
      setAadhaar("");
      setPhoneNumber("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error saving data. Please try again.");
    }
  };

  const handleLogin = () => {
    console.log("Navigate to Login screen");
  };

  const closeModal = () => setIsModalVisible(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.mainContainer}>
          {/* Fixed logo */}
          {/* <Image
            source={require("./../assets/images/logo_small.png")}
            style={styles.image}
            accessible={true}
            accessibilityLabel="Brand Logo"
          /> */}

          <View style={styles.blackContainer}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.signupText}>Please Enter your Details</Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.registeredText}>FULL NAME</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.registeredText}>AADHAAR NUMBER</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your Aadhaar number"
                  value={aadhaar}
                  onChangeText={setAadhaar}
                  maxLength={12}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.registeredText}>PHONE NUMBER</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.registeredText}>EMAIL</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.registeredText}>PASSWORD</Text>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>

              {/* <View style={styles.signupContainer}>
                <Text style={styles.loginText}>Already have an Account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.signupLink}>Login</Text>
                </TouchableOpacity>
              </View> */}
            </ScrollView>
          </View>
        </View>

        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{errorMessage}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: "#000000", // Black background
    },
    image: {
      width: 120,
      height: 100,
      alignSelf: "center",
      marginVertical: 20,
    },
    blackContainer: {
      flex: 1,
      backgroundColor: "#000000", // Black background
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    signupText: {
      color: "#ffff00", 
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    inputWrapper: {
      marginBottom: 15,
    },
    registeredText: {
      color: "#FFFFFF", // White text
      fontSize: 14,
      marginBottom: 5,
    },
    inputBox: {
      backgroundColor: "#1C1C1C", // Dark Gray for input box background
      borderRadius: 10,
      padding: 10,
      fontSize: 14,
      color: "#FFFFFF", // White text
    },
    button: {
      backgroundColor: "#ffff00", // White button
      borderRadius: 10,
      padding: 15,
      alignItems: "center",
      marginVertical: 20,
    },
    buttonText: {
      color: "#000000", // Black text
      fontSize: 16,
      fontWeight: "bold",
    },
    signupContainer: {
      flexDirection: "row",
      justifyContent: "center",
    },
    loginText: {
      color: "#FFFFFF", // White text
      fontSize: 14,
    },
    signupLink: {
      color: "#FFFFFF", // White link
      fontSize: 14,
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    },
    modalContent: {
      backgroundColor: "#1C1C1C", // Dark Gray for modal background
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    modalText: {
      color: "#FFFFFF", // White modal text
      fontSize: 16,
      marginBottom: 20,
      textAlign: "center",
    },
    modalButton: {
      backgroundColor: "#FFFFFF", // White button
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    modalButtonText: {
      color: "#000000", // Black text
      fontSize: 16,
    },
  });
  

// export default Signup;

export default Signup;
