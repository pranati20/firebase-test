import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';

const Welcome = () => {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={styles.mainContainer}>
      <Image
        source={require("./../assets/images/Brand_Logo TurfPass.png")}
        style={styles.image}
        accessible={true}
        accessibilityLabel="Brand Logo"
      />
      {/* <Text style={styles.mainText}>
        The Best Sporting Experience
      </Text> */}
      <View style={[styles.container, { height: height * 0.40 }]}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton}>
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
  // mainText: {
  //   fontFamily: 'dmsans_regular',
  //   fontSize: PixelRatio.get() * 5, // Scalable font size
  //   marginTop: -100,
  //   marginLeft: 50,
  // },
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
    // fontWeight: 'bold',
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
    // fontWeight: 'bold',
  },
});
