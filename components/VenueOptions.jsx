import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { auth } from '../firebaseConfig';
import { Colors } from '../constants/Colors'; // Adjust the import path

const HomeScreen = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Image
        source={require('./../assets/images/logo_small.png')}
        style={styles.logo}
        accessible={true}
        accessibilityLabel="TurfPass Logo"
      />
      <Text style={styles.title}>Your venue options</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('VenueDetails')}
      >
        <Text style={styles.buttonText}>Add Court</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.manageButton}
        onPress={() => navigation.navigate('SelectCourtEx')}
      >
        <Text style={styles.buttonText}>Manage Court</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  logo: {
    width: '60%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'poppins_medium',
    marginBottom: 30,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#FFDD00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  manageButton: {
    backgroundColor: Colors.black,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'poppins_medium',
    color: '#FFF',
  },
});

export default HomeScreen;
