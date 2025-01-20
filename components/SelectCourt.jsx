import { Colors } from '@/constants/Colors';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, StatusBar, Platform } from 'react-native';

export default function SelectCourt() {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    // Fetch courts data from backend
    fetch('https://your-backend-api.com/courts') // Replace with your API URL
      .then((response) => response.json())
      .then((data) => setCourts(data))
      .catch((error) => console.error('Error fetching courts:', error));
  }, []);

  const renderCourt = ({ item }) => (
    <View style={styles.courtCard}>
      <Image source={{ uri: item.image }} style={styles.courtImage} />
      <View style={styles.courtDetailsContainer}>
        <View style={styles.courtDetailsLeft}>
          <Text style={styles.courtName}>{item.name}</Text>
          <Text style={styles.courtLocation}>{item.location}</Text>
        </View>
        <View style={styles.courtDetailsRight}>
          <Text style={styles.courtPrice}>₹ {item.price} Per Hour</Text>
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo_black_bg.jpg')} // Replace with your logo path
          style={styles.logo}
        />
      </View>

      <Text style={styles.heading}>Select Court</Text>

      <FlatList
        data={courts}
        renderItem={renderCourt}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.courtsList}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton}>
          <Text style={styles.homeButtonText}>HOME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
    marginHorizontal: 30,
    borderRadius: 30,
    backgroundColor: Colors.Black,
    padding: 10,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#000',
  },
  courtsList: {
    paddingHorizontal: 10,
  },
  courtCard: {
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  courtImage: {
    width: '100%',
    height: 150,
  },
  courtInfo: {
    padding: 10,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  courtPrice: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
  courtLocation: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  manageButton: {
    backgroundColor: '#FFEB00',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
  },
  homeButton: {
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
