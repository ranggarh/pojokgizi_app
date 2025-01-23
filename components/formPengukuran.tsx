import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  ScrollView,
  Text,
  InputField,
  InputSlot,
  Pressable,
  Image,
} from "@gluestack-ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormPengukuran = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { measurement } = route.params || {}; // Get measurement data if available

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [measurementName, setMeasurementName] = useState(measurement ? measurement.name : '');
  const [measurementDescription, setMeasurementDescription] = useState(measurement ? measurement.description : '');
  const [errors, setErrors] = useState({ name: '', description: '' });

  useEffect(() => {
    if (measurement && measurement.date) {
      // If editing, set the date from the measurement
      const dateParts = measurement.date.split('/'); // Ensure measurement.date is a string
      if (dateParts.length === 3) {
        const [day, month, year] = dateParts;
        setDate(new Date(`${year}-${month}-${day}`)); // Set date to the measurement date
      }
    }
  }, [measurement]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const validateInputs = () => {
    let valid = true;
    let newErrors = { name: '', description: '' };

    if (!measurementName) {
      newErrors.name = 'Nama Pengukuran tidak boleh kosong.';
      valid = false;
    }

    if (!measurementDescription) {
      newErrors.description = 'Deskripsi Pengukuran tidak boleh kosong.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const saveData = async () => {
    if (!validateInputs()) {
      return; // Stop execution if validation fails
    }
  
    const measurementData = {
      id: measurement && measurement.id ? measurement.id : Date.now().toString(), // Generate a new ID if creating a new measurement
      date: formattedDate,
      name: measurementName,
      description: measurementDescription,
    };
  
    console.log('Measurement Data:', measurementData); // Log the measurement data
  
    try {
      const existingMeasurements = await AsyncStorage.getItem('measurements');
      const updatedMeasurements = existingMeasurements ? JSON.parse(existingMeasurements) : [];
  
      if (measurement && measurement.id) {
        // Update existing measurement
        const index = updatedMeasurements.findIndex(m => m.id === measurement.id);
        if (index !== -1) {
          updatedMeasurements[index] = measurementData; // Update the measurement
        }
      } else {
        // Add new measurement
        updatedMeasurements.push(measurementData);
      }
  
      await AsyncStorage.setItem('measurements', JSON.stringify(updatedMeasurements));
      console.log('Data saved successfully:', measurementData);
      Alert.alert("Data Tersimpan", "Pengukuran telah disimpan dengan sukses.", [
        { text: "OK", onPress: () => navigation.navigate('Pengukuran Status Gizi') },
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  return (
    <Box flex={1} justifyContent="space-between">
      <Box width="100%" h={120} bg={"#23b160"} flexDirection="row" justifyContent="space-between">
        <Box width={"$64"}>
          <Text fontSize={"$lg"} m={"$4"} fontWeight={"$bold"} color={"white"}>Data Pengukuran</Text>
          <Text fontSize={"$sm"} ml={"$4"} mt={"-$2"} color={"white"}>Buat Data Pengukuran Terlebih dahulu agar pengukuran lebih terstruktur.</Text>
        </Box>
        <Box width={"$48"} ml={"-$10"}>
          <Image 
            source={require("../assets/microscope.png")} 
            alt="Pantau Tumbuh Kembang Anak Secara Berkala" 
            width={150} 
            height={150} 
            my={"$2"} 
            ml={"$3"}
          />
        </Box>
      </Box>
      <ScrollView
        backgroundColor="white"
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      >
        <Box>
          {/* Tanggal Pengukuran */}
          <Box marginBottom={4} my={"$2"} borderTopStartRadius={5} borderTopEndRadius={5}>
            <Text fontWeight={"$semibold"} fontSize={"$md"} marginBottom={"$2"} color="gray.600">
              Tanggal Pengukuran
            </Text>
            <Pressable onPress={() => setShowPicker(true)}>
              <Input
                width="100%"
                backgroundColor="gray.100"
                isReadOnly={true}
              >
                <InputSlot pl="$3">
                  <Ionicons name="calendar-outline" size={20} color="gray.600" />
                </InputSlot>
                <InputField value={formattedDate} placeholder="MM/DD/YYYY" isDisabled />
              </Input>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
              />
            )}
          </Box>
          {/* Nama Pengukuran */}
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Nama Pengukuran
            </Text>
            <Input height={"$fit"} padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField 
                placeholder="Enter Text here" 
                value={measurementName} 
                onChangeText={setMeasurementName} 
              />
            </Input>
            {errors.name ? <Text color="red" fontSize={"$sm"}>{errors.name}</Text> : null}
          </Box>
          {/* Deskripsi Pengukuran */}
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Deskripsi Pengukuran
            </Text>
            <Input width="100%" height={"$fit"} padding={"$2"} backgroundColor="gray.100">
              <InputField 
                p={"$5"} 
                multiline={true} 
                placeholder="Enter Text here" 
                value={measurementDescription} 
                onChangeText={setMeasurementDescription} 
              />
            </Input>
            {errors.description ? <Text color="red" fontSize={"$sm"}>{ errors.description}</Text> : null}
          </Box>
        </Box>
      </ScrollView>
      {/* Tombol Simpan */}
      <Pressable
        bg="#23b160"
        py={3}
        height={60}
        alignSelf="center"
        width="100%"
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        onPress={saveData} // Call saveData on press
      >
        <Text textAlign="center" my={"$4"} color="white">Simpan Pengukuran</Text>
      </Pressable>
    </Box>
  );
};

export default FormPengukuran;