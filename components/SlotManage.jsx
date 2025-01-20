import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from '../firebaseConfig'; 
import { collection, getDocs, query, where, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Colors } from "@/constants/Colors";
import { useNavigation } from '@react-navigation/native';


const { width, height } = Dimensions.get("window");


// Dummy Data for Opening Time, Closing Time, and Session Duration
const openingTime = "09:00"; // Opening time (dummy)
const closingTime = "17:00"; // Closing time (dummy)
const sessionDuration = 30; // Session duration in minutes (dummy)

// List of months
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Function to get the number of days in a month
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

// Function to generate time slots
const generateTimeSlots = (start, end, duration) => {
  const timeSlots = [];
  const startTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (startTime < endTime) {
    const timeString = startTime.toTimeString().slice(0, 5);
    timeSlots.push({ time: timeString, status: "available" });

    // Increment the time by the session duration
    startTime.setMinutes(startTime.getMinutes() + duration);
  }

  return timeSlots;
};

const SlotManagement = ({ route }) => {
  const navigation = useNavigation(); 
  const { venueId } = route.params;
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Current week, month, and year
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentWeekStart, setCurrentWeekStart] = useState(13); // Start at "13 March"

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const selectedDate = new Date(currentYear, currentMonth, currentWeekStart + selectedDateIndex).toISOString().split('T')[0];
        const q = query(collection(db, 'slots'), where('venueId', '==', venueId), where('date', '==', selectedDate));
        const querySnapshot = await getDocs(q);
        const slotsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        if (slotsData.length === 0) {
          const generatedSlots = generateTimeSlots(openingTime, closingTime, sessionDuration).map(slot => ({
            ...slot,
            venueId,
            date: selectedDate,
            bookingDate: '' // Placeholder for booking date
          }));
          const batch = writeBatch(db);
          generatedSlots.forEach(slot => {
            const slotRef = doc(collection(db, 'slots'));
            batch.set(slotRef, slot);
          });
          await batch.commit();
          setTimeSlots(generatedSlots);
        } else {
          setTimeSlots(slotsData);
        }
      } catch (error) {
        console.error("Error fetching slots: ", error);
      }
    };
  
    fetchSlots();
  }, [venueId, currentMonth, currentYear, currentWeekStart, selectedDateIndex]);
  

  const handleDateSelect = (index) => {
    setSelectedDateIndex(index);
    setTimeSlots([]); // Clear previous slots before fetching new ones
  };
  
  const handleSlotPress = (index) => {
    setSelectedSlotIndex(index);
    setModalVisible(true);
  };

  const handleOptionSelect = async (option) => {
    const updatedSlots = [...timeSlots];
    if (option === "cancel") {
      setModalVisible(false);
      return;
    }
  
    const selectedDate = new Date(currentYear, currentMonth, currentWeekStart + selectedDateIndex).toISOString().split('T')[0];
    updatedSlots[selectedSlotIndex].status = option;
    updatedSlots[selectedSlotIndex].date = selectedDate;  // Set correct date
    updatedSlots[selectedSlotIndex].bookingDate = new Date().toISOString().split('T')[0];  // Set booking date
    setTimeSlots(updatedSlots);
    setModalVisible(false);
  
    const slotDocRef = doc(db, 'slots', updatedSlots[selectedSlotIndex].id);
    await updateDoc(slotDocRef, {
      status: option,
      date: selectedDate,  // Store date
      bookingDate: updatedSlots[selectedSlotIndex].bookingDate,
    });
  };
  

  const changeWeek = (direction) => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);

    if (direction === "next") {
      if (currentWeekStart + 7 > daysInMonth) {
        // Move to the next month
        if (currentMonth === 11) {
          // Move to the next year
          setCurrentYear((prev) => prev + 1);
          setCurrentMonth(0);
        } else {
          setCurrentMonth((prev) => prev + 1);
        }
        setCurrentWeekStart((currentWeekStart + 7) - daysInMonth); // Remaining days in the new month
      } else {
        setCurrentWeekStart((prev) => prev + 7); // Increment week
      }
    } else if (direction === "prev") {
      if (currentWeekStart - 7 < 1) {
        // Move to the previous month
        if (currentMonth === 0) {
          // Move to the previous year
          setCurrentYear((prev) => prev - 1);
          setCurrentMonth(11);
        } else {
          setCurrentMonth((prev) => prev - 1);
        }
        const daysInPrevMonth = getDaysInMonth(
          currentMonth === 0 ? 11 : currentMonth - 1,
          currentMonth === 0 ? currentYear - 1 : currentYear
        );
        setCurrentWeekStart(daysInPrevMonth - (7 - currentWeekStart)); // Calculate the start of the week
      } else {
        setCurrentWeekStart((prev) => prev - 7); // Decrement week
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/images/logo_black_bg.jpg")} style={styles.logo} />
      </View>
      <Text style={styles.title}>Slot Management</Text>

      <View style={styles.monthContainer}>
        <TouchableOpacity onPress={() => changeWeek("prev")}>
          <Text style={styles.arrow}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{months[currentMonth].toUpperCase()} {currentYear}</Text>
        <TouchableOpacity onPress={() => changeWeek("next")}>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateNavigation}>
        {Array.from({ length: 7 }, (_, i) => {
          const day = currentWeekStart + i;
          const daysInMonth = getDaysInMonth(currentMonth, currentYear);
          const displayDay = day > daysInMonth ? day - daysInMonth : day;
          const displayMonth = day > daysInMonth ? (currentMonth + 1) % 12 : currentMonth;
          const displayYear = day > daysInMonth && currentMonth === 11 ? currentYear + 1 : currentYear;

          return (
            <TouchableOpacity
              key={i}
              style={[styles.dateButton, selectedDateIndex === i && styles.selectedDate]}
              onPress={() => handleDateSelect(i)}
            >
              <Text style={[styles.dateText, selectedDateIndex === i && styles.selectedDateText]}>{displayDay}</Text>
              <Text style={[styles.dayText, selectedDateIndex === i && styles.selectedDateText]}>{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][i]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Available Time Slots</Text>
      <FlatList
        data={timeSlots}
        keyExtractor={(_, index) => index.toString()}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.slotButton,
              item.status === "available" && styles.availableSlot,
              item.status === "freezable" && styles.freezableSlot,
              item.status === "under-maintenance" && styles.maintenanceSlot,
            ]}
            onPress={() => handleSlotPress(index)}
          >
            <Text style={styles.slotText}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('VenueOptions')}>
          <Ionicons name="home" size={width * 0.1} color="white" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select an Option</Text>
            <TouchableOpacity style={[styles.optionButton, { backgroundColor: "green" }]} onPress={() => handleOptionSelect("available")}>
              <Text style={styles.optionText}>Free Slot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, { backgroundColor: "red" }]} onPress={() => handleOptionSelect("freezable")}>
              <Text style={styles.optionText}>Freeze Slot</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, { backgroundColor: "grey" }]} onPress={() => handleOptionSelect("under-maintenance")}>
              <Text style={styles.optionText}>Under Maintenance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, { backgroundColor: "transparent" }]} onPress={() => handleOptionSelect("cancel")}>
              <Text style={[styles.optionText, { color: "black" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: width * 0.05,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: height * 0.02,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.2,
    resizeMode: "contain",
  },
  title: {
    color: "white",
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  monthContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  arrow: {
    color: "white",
    fontSize: width * 0.1,
  },
  monthText: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  dateNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  dateButton: {
    padding: width * 0.02,
    backgroundColor: "black",
    borderRadius: 5,
    alignItems: "center",
    margin: width * 0.01,
  },
  selectedDate: {
    backgroundColor: "yellow",
  },
  selectedDateText:{
    color:"black"
  },
  dateText: {
    color: "white",
    fontSize: width * 0.04,
  },
  dayText: {
    color: "white",
    fontSize: width * 0.02,
  },
  sectionTitle: {
    color: "white",
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  slotButton: {
    width: "22%",
    paddingVertical: height * 0.015,
    marginVertical: height * 0.01,
    marginHorizontal: width*0.01,
    borderRadius: 5,
    alignItems: "center",
    width: (width - width * 0.2) / 4, // Adjust to fit 4 columns
  },
  slotText: {
    color: "black",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  availableSlot: {
    backgroundColor: "green",
  },
  unavailableSlot: {
    backgroundColor: "grey",
  },
  freezableSlot: {
    backgroundColor: "red",
  },
  maintenanceSlot: {
    backgroundColor: "grey",
  },
  footer: {
    // position: "absolute",
    // bottom: height * 0.03,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: width * 0.05,
    borderRadius: 5,
    alignItems: "center",
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  optionButton: {
    padding: width * 0.05,
    marginVertical: height * 0.01,
    width: width * 0.7,
    borderRadius: 5,
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: width * 0.04,
  },
});

export default SlotManagement;
