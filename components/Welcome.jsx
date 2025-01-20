import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("./../assets/images/Brand_Logo TurfPass.png")}
        style={styles.image}
        accessible={true}
        accessibilityLabel="Brand Logo"
      />
      <View style={[styles.container, { height: height * 0.40 }]}>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('LoginInitial')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '48%', // Use percentages to make it responsive
    resizeMode: 'contain',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.Black,
    borderTopLeftRadius: 49,
    borderTopRightRadius: 49,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  loginButton: {
    height: 71,
    width: '70%', // Use percentage to make it responsive
    backgroundColor: '#FFFF00',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  loginButtonText: {
    color: 'black',
    fontFamily: 'poppins_medium',
    fontSize: PixelRatio.get() * 10, // Scalable font size
  },
  signUpButton: {
    height: 71,
    width: '70%', // Use percentage to make it responsive
    backgroundColor: '#000',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFF00',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  signUpButtonText: {
    color: '#FFFF00',
    fontFamily: 'poppins_medium',
    fontSize: PixelRatio.get() * 10, // Scalable font size
  },
});
