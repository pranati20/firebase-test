import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { storage, db } from '../firebaseConfig'; // Ensure firebaseConfig exports storage and db
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const CourtImages = ({ route }) => {
  const { venueId } = route.params;
  const [images, setImages] = useState([null, null, null, null, null, null]);
  const navigation = useNavigation();

  const pickImage = async (index, fromCamera) => {
    let permissionResult;

    if (fromCamera) {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    } else {
      permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    }

    if (!permissionResult.granted) {
      alert('Permission to access camera or media library is required!');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      const newImages = [...images];
      newImages[index] = selectedUri;
      setImages(newImages);
    }
  };

  const handleImageSelection = (index) => {
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => pickImage(index, true) },
        { text: 'Gallery', onPress: () => pickImage(index, false) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    try {
      // Upload images to Firebase Storage and get the URLs
      const imageUrls = await Promise.all(images.map(async (image, index) => {
        if (image) {
          const response = await fetch(image);
          const blob = await response.blob();
          const storageRef = ref(storage, `courtImages/image_${index + Date.now()}.jpg`);
          await uploadBytes(storageRef, blob);
          const downloadUrl = await getDownloadURL(storageRef);
          return downloadUrl;
        }
        return null;
      }));

      // Save image URLs to Firestore under the same venue document
      const venueDocRef = doc(db, 'venues', venueId);
      await updateDoc(venueDocRef, {
        images: imageUrls.filter(url => url !== null),
      });

      Alert.alert("Success", "Images uploaded successfully!");
      navigation.navigate('SelectCourtEx', { venueId });
    } catch (error) {
      console.error("Error uploading images: ", error);
      Alert.alert("Error", "Failed to upload images. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Venue Details</Text>
      <Text style={styles.subtitle}>Add Court Images</Text>

      <View style={styles.imageGrid}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageWrapper}
            onPress={() => handleImageSelection(index)}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.placeholderWrapper}>
                <AntDesign name="plus" size={24} color="gray" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'yellow',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    margin: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  placeholderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  nextButton: {
    backgroundColor: 'yellow',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  nextButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CourtImages;
