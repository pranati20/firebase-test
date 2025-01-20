import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, StatusBar, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function SelectCourtEx() {
  const [courts, setCourts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'venues'));
        const courtsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().venueName,
          price: doc.data().priceWeekdays, // or priceWeekends, depending on what you want to display
          location: doc.data().location,
          image: doc.data().images ? doc.data().images[0] : 'https://via.placeholder.com/300x150', // Assuming the first image is the main image
        }));
        setCourts(courtsData);
      } catch (error) {
        console.error("Error fetching courts: ", error);
      }
    };

    fetchCourts();
  }, []);

  const handleManagePress = (venueId) => {
    navigation.navigate('SlotManage', { venueId });
  };

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
          <TouchableOpacity style={styles.manageButton} onPress={() => handleManagePress(item.id)}>
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
  courtDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  courtDetailsLeft: {
    flex: 1,
  },
  courtDetailsRight: {
    alignItems: 'flex-end',
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  courtPrice: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  courtLocation: {
    fontSize: 14,
    color: '#fff',
  },
  manageButton: {
    backgroundColor: '#FFEB00',
    paddingVertical: 10,
    paddingHorizontal: 15,
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
