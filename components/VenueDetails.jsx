import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';

export default function VenueDetailsForm() {
  const [formData, setFormData] = useState({
    venueName: "",
    contactNumber: "",
    ownerName: "",
    ownerAadhar: "",
    sportsAvailable: "",
    noOfCourtyards: "",
    location: "",
    googleMapsLink: "",
    openingTime: "",
    closingTime: "",
    matchDuration: "",
    priceWeekdays: "",
    priceWeekends: "",
  });

  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const sportsList = [
    "Cricket",
    "Football",
    "Badminton",
    "Tennis",
    "Kabaddi",
    "Basketball",
    "Hockey",
    "Volleyball",
    "Table Tennis",
    "Chess",
    "Athletics",
    "Swimming",
    "Boxing",
    "Wrestling",
    "Shooting",
    "Weightlifting",
    "Archery",
    "Cycling",
    "Gymnastics",
    "Golf",
    "Judo",
    "Taekwondo",
    "Karate",
    "Squash",
    "Polo",
    "Snooker",
    "Billiards",
    "Rugby",
    "Kho-Kho",
    "Kalaripayattu",
    "Mallakhamb",
    "Handball",
    "Rowing",
    "Skating",
    "Surfing",
    "Horse Riding",
    "Fencing",
    "Sepak Takraw",
    "Sailing",
    "Kayaking",
    "Canoeing",
    "Rock Climbing",
    "Paragliding",
    "Yachting",
    "Motorsport",
    "Esports",
    "Softball",
    "Baseball",
    "Darts",
    "Ultimate Frisbee"
  ];

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, 'venues'), formData);
      const venueId = docRef.id;
      console.log("Venue details successfully saved with ID: ", venueId);
      Alert.alert("Success", "Venue details successfully saved!");

      // Navigate to CourtImages screen with the venueId
      navigation.navigate('CourtImages', { venueId });
    } catch (error) {
      console.error("Error saving venue details: ", error);
      Alert.alert("Error", "Failed to save venue details. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Venue Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Venue Name"
        placeholderTextColor="#888"
        onChangeText={(text) => handleChange("venueName", text)}
        value={formData.venueName}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange("contactNumber", text)}
        value={formData.contactNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Owner Name"
        placeholderTextColor="#888"
        onChangeText={(text) => handleChange("ownerName", text)}
        value={formData.ownerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Owner Aadhar Card No."
        placeholderTextColor="#888"
        keyboardType="numeric"
        onChangeText={(text) => handleChange("ownerAadhar", text)}
        value={formData.ownerAadhar}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.sportsAvailable}
          style={styles.picker}
          onValueChange={(itemValue) => handleChange("sportsAvailable", itemValue)}
        >
          <Picker.Item label="Select Sports" value="" />
          {sportsList.map((sport, index) => (
            <Picker.Item key={index} label={sport} value={sport} />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="No. of Courtyards"
        placeholderTextColor="#888"
        keyboardType="numeric"
        onChangeText={(text) => handleChange("noOfCourtyards", text)}
        value={formData.noOfCourtyards}
      />
      <TextInput
        style={styles.input}
        placeholder="Location (Detailed)"
        placeholderTextColor="#888"
        onChangeText={(text) => handleChange("location", text)}
        value={formData.location}
      />
      <TextInput
        style={styles.input}
        placeholder="Google Maps Link"
        placeholderTextColor="#888"
        onChangeText={(text) => handleChange("googleMapsLink", text)}
        value={formData.googleMapsLink}
      />
      <TextInput
        style={styles.input}
        placeholder="Opening Time (e.g. 09:00 AM)"
        placeholderTextColor="#888"
        onChangeText={(text) => handleChange("openingTime", text)}
        value={formData.openingTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Closing Time (e.g. 10:00 PM)"
        placeholderTextColor="#888"
        onChangeText={(text) => handleChange("closingTime", text)}
        value={formData.closingTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Match Duration (in minutes)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        onChangeText={(text) => handleChange("matchDuration", text)}
        value={formData.matchDuration}
      />
      <TextInput
        style={styles.input}
        placeholder="Price on Week-Days (Mon-Fri)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        onChangeText={(text) => handleChange("priceWeekdays", text)}
        value={formData.priceWeekdays}
      />
      <TextInput
        style={styles.input}
        placeholder="Price on Weekend (Sat-Sun)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        onChangeText={(text) => handleChange("priceWeekends", text)}
        value={formData.priceWeekends}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#fff",
    backgroundColor: "#222",
  },
  pickerContainer: {
    width: "100%",
    height: 50,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#222",
    justifyContent: "center",
  },
  picker: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
});
