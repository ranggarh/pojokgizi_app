import React, { useState } from "react";
import {
  Box,
  Input,
  ScrollView,
  Text,
  Button,
  InputField,
  InputSlot,
  Pressable,
  Image,
  HStack,
} from "@gluestack-ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface navigation {
  navigate: (screen: string) => void;
}

const FormKalkulator = () => {
  const [measurementDate, setMeasurementDate] = useState(new Date());
  const [birthDate, setBirthDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ type: "", visible: false });
  const [age, setAge] = useState("");
  const navigation = useNavigation();

  const calculateAge = () => {
    const diff = new Date(measurementDate - birthDate);
    const years = diff.getUTCFullYear() - 1970; // Tahun sejak epoch (1970)
    const months = diff.getUTCMonth(); // Bulan (0-11)
    setAge(`${years} Tahun ${months} Bulan`);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const type = showPicker.type;
      setShowPicker({ type: "", visible: false });
      if (type === "measurement") {
        setMeasurementDate(selectedDate);
      } else if (type === "birth") {
        setBirthDate(selectedDate);
      }
    } else {
      setShowPicker({ type: "", visible: false });
    }
    calculateAge(); // Recalculate age after date selection
  };

  const formattedDate = (date: Date) =>
    `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  return (
    <Box flex={1} justifyContent="space-between">
    <Box width="100%" h={120} bg={"#23b160"} flexDirection="row" justifyContent="space-between">
        <Box width={"$48"} >
            <Image 
            source={require("../assets/math.png")} 
            alt="Pantau Tumbuh Kembang Anak Secara Berkala" 
            width={150} // Set the specific width for the image
            height={150} // Set the specific height for the image
            ml={"$3"}
            />
        </Box>
        <Box width={"$64"} ml={"-$10"}>
            <Text fontSize={"$lg"} m={"$4"} fontWeight={"$bold"} color={"white"}>Kalkulator Status Gizi</Text>
            <Text fontSize={"$sm"}  maxWidth={"$56"} ml={"$4"} mt={"-$2"} color={"white"}>Hitung Data Pengukuran Status Gizi Anda di sini Bersama PojokGizi Indonesia.</Text>
        </Box>
        
        
    </Box>
      <ScrollView
        backgroundColor="white"
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      >
        <Box>
        <HStack >
          {/* Tanggal Lahir */}     
          <Box marginBottom={4} ml={"-$0.5"} mr={"$1"} my={"$2"} width={"50%"} borderTopStartRadius={5} borderTopEndRadius={5}>
            <Text fontWeight={"$semibold"} fontSize={"$md"} marginBottom={"$2"} color="gray.600">
              Tanggal Lahir
            </Text>
            <Pressable onPress={() => setShowPicker({ type: "birth", visible: true })}>
                <Input width="100%" backgroundColor="gray.100" isReadOnly>
                <InputSlot pl="$3">
                    <Ionicons name="calendar-outline" size={20} color="gray.600" />
                </InputSlot>
                  <Text my={"$2"} mx={"$3"}>{formattedDate(birthDate)}</Text>
                </Input>
              </Pressable>
          </Box>
          {/* Tanggal Pengukuran */}
          <Box marginBottom={4} my={"$2"}  width={"50%"} borderTopStartRadius={5} borderTopEndRadius={5}>
            <Text fontWeight={"$semibold"} fontSize={"$md"} marginBottom={"$2"} color="gray.600">
              Tanggal Pengukuran
            </Text>
            <Pressable onPress={() => setShowPicker({ type: "measurement", visible: true })}>
                <Input width="100%" backgroundColor="gray.100" isReadOnly>
                <InputSlot pl="$3">
                    <Ionicons name="calendar-outline" size={20} color="gray.600" />
                </InputSlot>                  
                <Text my={"$2"} mx={"$3"}>{formattedDate(measurementDate)}</Text>
                </Input>
            </Pressable>
          </Box>
          
        </HStack>
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Usia (Bulan)
            </Text>
            <Input isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
              <Text>{age || "Belum dihitung"}</Text>
            </Input>
          </Box>
          {/* Nama Pengukuran */}
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Nama Lengkap
            </Text>
            <Input padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField placeholder="Enter Text here" />
            </Input>
          </Box>
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Jenis Kelamin
            </Text>
            <Input  padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField placeholder="Enter Text here" />
            </Input>
          </Box>
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Berat Badan
            </Text>
            <Input padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField placeholder="Enter Text here" />
            </Input>
          </Box>
          {/* Deskripsi Pengukuran */}
          <HStack justifyContent="space-between">
          <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Panjang Badan
            </Text>
            <Input width="100%" padding={"$2"} backgroundColor="gray.100">
              <InputField p={"$5"} multiline={true} placeholder="Enter Text here" />
            </Input>
          </Box>
          <Box marginBottom={4} my={"$4"} width="50%">
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Tinggi Badan
            </Text>
            <Input width="100%" padding={"$2"} backgroundColor="gray.100">
              <InputField p={"$5"} multiline={true} placeholder="Enter Text here" />
            </Input>
          </Box>
          </HStack>

          <Box marginBottom={"$20"} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Berat Badan
            </Text>
            <Input padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField placeholder="Enter Text here" />
            </Input>
          </Box>
        </Box>
      </ScrollView>
      {/* DateTimePicker */}
      {showPicker.visible && (
        <DateTimePicker
          value={showPicker.type === "measurement" ? measurementDate : birthDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}
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
        onPress={() =>{navigation.navigate('AntroCalc');}}
      >
        <Text textAlign="center" my={"$4"} color="white">Simpan Pengukuran</Text>
      </Pressable>
    </Box>
  );
};

export default FormKalkulator;
