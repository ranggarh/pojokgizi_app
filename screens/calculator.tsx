import React, { useState, useEffect } from "react";
import {
  Box,
  ScrollView,
  Text,
  Button,
  Pressable,
  Image,
  Input,
  InputField,
  InputSlot,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';


type RouteParamList = {
  "Tambah Pengukuran": { measurement?: Measurement };
  "Data Pengukuran": { measurement: Measurement };
};

type NavigationProps = NativeStackNavigationProp<RouteParamList>;


interface Measurement {
  id: number;
  name: string;
  date: string;
  description: string;
}

const AntroCalc = () => {
  const navigation = useNavigation<NavigationProps>();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState(""); // State untuk tanggal pencarian
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // State untuk menampilkan DatePicker

  useEffect(() => {
    const loadMeasurements = async () => {
      try {
        const storedMeasurements = await AsyncStorage.getItem('measurements');
        if (storedMeasurements) {
          const parsedData = JSON.parse(storedMeasurements);
          setMeasurements(parsedData);
          console.log('Data loaded successfully:', parsedData);
        } else {
          console.log('No data found');
        }
      } catch (error) {
        console.error('Failed to load measurements:', error);
      }
    };
  
    loadMeasurements();
  }, []);
  // Filter measurements berdasarkan query pencarian dan tanggal
  const filteredMeasurements = measurements.filter((measurement) =>
    measurement.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    measurement.date.includes(searchDate)
  );

  const navigateToForm = (measurement?: Measurement) => {
    navigation.navigate("Tambah Pengukuran", { measurement });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setShowDatePicker(false);
      setSearchDate(currentDate.toISOString().split("T")[0]);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSearchDate("");
  };

  const deleteMeasurement = async (id: number) => {
    const updatedMeasurements = measurements.filter(measurement => measurement.id !== id);
    setMeasurements(updatedMeasurements);
    await AsyncStorage.setItem('measurements', JSON.stringify(updatedMeasurements));
  };

  return (
    <Box flex={1} bg="#cbf5df">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box flex={1} padding={4}>
          {/* Search Bar, Date Picker, and Reset Button */}
          <Box flexDirection="row" mb={4} alignItems="center">
            <Input bg="#efad4d" flex={1} marginRight="$1">
              <InputField
                placeholderTextColor="black"
                placeholder="Search..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
              <InputSlot pl="$3" mx="$2">
                <Ionicons name="search-sharp" size={24} color="black" />
              </InputSlot>
            </Input>

            <Pressable onPress={() => setShowDatePicker(true)}>
              <Image
                source={require("../assets/settings.png")}
                alt="settings"
                style={{ width: 35, height: 30 }}
              />
            </Pressable>

            <Pressable onPress={resetFilters}>
              <Ionicons name="refresh" size={25} color="black" style={{ marginLeft: 10 }} />
            </Pressable>
          </Box>

          {showDatePicker && (
            <DateTimePicker
              value={searchDate ? new Date(searchDate) : new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Kondisi Jika Tidak Ada Data */}
          {measurements.length === 0 ? (
            <Box flex={1} justifyContent="center" alignItems="center">
              <Image
                source={require("../assets/empty-box (2).png")}
                alt="Tambah Data Icon"
                style={{ width: 100, height: 100, marginBottom: 16 }}
              />
              <Text fontSize={"$lg"} textAlign="center" marginBottom={4}>
                Tidak ada pengukuran tersedia.
              </Text>
              <Button bg="#efad4d" my={10} onPress={() => navigateToForm()}
              >
                <Text>Tambah Data</Text>
              </Button>
            </Box>
          ) : (
            // Menampilkan Data yang Difilter
            filteredMeasurements.map((measurement) => (
              <Pressable
                key={measurement.id}
                onPress={() => navigation.navigate("Data Pengukuran", { measurement })}
              >
                <Box
                  padding={"$4"}
                  marginBottom={4}
                  backgroundColor="white"
                  borderRadius={8}
                  
                >
                  <Box justifyContent="space-between"  flexDirection="row">
                    <Box width={"$3/4"}>
                      <Text fontSize={"$lg"}  fontWeight={"bold"}>
                        {measurement.name}
                      </Text>
                      <Text fontSize={"$sm"} flexWrap="wrap" my={"$2"} fontWeight={"regular"}>
                        {measurement.description}
                      </Text>
                    </Box>

                    <Box flexDirection="column">
                      <Text
                        color="white"
                        fontWeight={"bold"}
                        textAlign="center"
                        fontSize={"$xs"}
                        justifyContent="flex-start"
                        h={"$8"}
                        p={"$2"}
                        bg={"#23b160"}
                        borderRadius={8}
                      >
                        {measurement.date}
                      </Text>
                      <Box my={"$2"} flexDirection="row" gap={"$4"}>
                        <Pressable onPress={() => navigateToForm(measurement)}>
                          <Ionicons size={30} color={"#efad4d"} name="create" />
                        </Pressable>
                        <Pressable onPress={() => deleteMeasurement(measurement.id)}>
                          <Ionicons size={30} color={"red"} name="trash" />
                        </Pressable>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Pressable>
            ))
          )}
        </Box>
      </ScrollView>

      <Pressable
        onPress={() => navigateToForm()}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
        }}
      >
        <Box
          backgroundColor="#23b160"
          borderRadius={10}
          width={60}
          height={60}
          justifyContent="center"
          alignItems="center"
        >
          <Ionicons name="add" size={30} color="white" />
        </Box>
      </Pressable>
    </Box>
  );
};

export default AntroCalc;