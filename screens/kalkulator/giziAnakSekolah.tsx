import React, { useState } from "react";
import {
  Box,
  Input,
  InputSlot,
  InputField,
  ScrollView,
  Text,
  Pressable,
  Image,
  HStack,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioLabel,
  RadioIndicator,
  CircleIcon,
} from "@gluestack-ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ZScoreCalculator from "../../components/rumus/zscoreCalculatorAnakRemaja";

const GiziAnakSekolah = () => {
  const [measurementDate, setMeasurementDate] = useState(new Date());
  const [birthDate, setBirthDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ type: "", visible: false });
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Laki Laki");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [errors, setErrors] = useState({ name: '', gender: '', weight: '', height: '', birthDate: '', measurementDate: '' });
  const [imt, setImt] = useState<number | null>(null); // State untuk IMT
  const [age, setAge] = useState("");
  const [ageInMonth, setAgeInMonth] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  

  const navigation = useNavigation();

  

  const calculateAge = () => {
    const diff = measurementDate.getTime() - birthDate.getTime();
    const totalMonths = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)); // 30.44 hari dalam 1 bulan rata-rata
  
    const years = Math.floor(totalMonths / 12);
    const months = years * 12;
  
    setAge(`${years} Tahun ${months} Bulan`);
    setAgeInMonth(totalMonths);
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

  const handleSubmit = () => {
    // Reset errors
    setErrors({ name: '', gender: '', weight: '', height: '', birthDate: '', measurementDate: '' });

    // Validation
    let valid = true;
    if (!name) {
      setErrors(prev => ({ ...prev, name: 'Nama Lengkap tidak boleh kosong' }));
      valid = false;
    }
    if (!gender) {
      setErrors(prev => ({ ...prev, gender: 'Jenis Kelamin tidak boleh kosong' }));
      valid = false;
    }
    if (!weight || isNaN(parseFloat(weight))) {
      setErrors(prev => ({ ...prev, weight: 'Berat Badan harus berupa angka' }));
      valid = false;
    }
    if (!height || isNaN(parseFloat(height))) {
      setErrors(prev => ({ ...prev, height: 'Tinggi Badan harus berupa angka' }));
      valid = false;
    }

    // Validation for dates
    const today = new Date();
    if (birthDate > today) {
      setErrors(prev => ({ ...prev, birthDate: 'Tanggal Lahir tidak boleh lebih dari hari ini' }));
      valid = false;
    }

    if (measurementDate < birthDate) {
      setErrors(prev => ({ ...prev, measurementDate: 'Tanggal Pengukuran tidak boleh lebih kecil dari Tanggal Lahir' }));
      valid = false;
    }

    if (measurementDate > today) {
      setErrors(prev => ({ ...prev, measurementDate: 'Tanggal Pengukuran tidak boleh lebih dari hari ini' }));
      valid = false;
    }

    if (valid) {
      setSubmitted(true);  // Show the results after submission
    }
  };
  return (
    <Box flex={1} justifyContent="space-between">
      <Box width="100%" h={120} bg={"#23b160"} flexDirection="row" justifyContent="space-between">
        <Box width={"$48"}>
          <Image 
            source={require("../../assets/math.png")} 
            alt="Pantau Tumbuh Kembang Anak Secara Berkala" 
            width={150} 
            height={150} 
            ml={"$3"}
          />
        </Box>
        <Box width={"$64"} ml={"-$10"}>
          <Text fontSize={"$lg"} m={"$4"} fontWeight={"$bold"} color={"white"}>Kalkulator Status Gizi</Text>
          <Text fontSize={"$sm"} maxWidth={"$56"} ml={"$4"} mt={"-$2"} color={"white"}>Hitung Data Pengukuran Status Gizi Anda di sini Bersama PojokGizi Indonesia.</Text>
        </Box>
      </Box>
      <ScrollView
        backgroundColor="white"
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      >
        <Box>
          {/* Nama Pengukuran */}
          <Box marginBottom={"$2"} my={"$2"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Nama Lengkap
            </Text>
            <Input padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField placeholder="Enter Text here" onChangeText={text => setName(text)} />
            </Input>
            {errors.name ? <Text color="red" fontSize="$sm">{errors.name}</Text> : null}
          </Box>
          <HStack>
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
              {errors.birthDate ? <Text color="red" fontSize="$sm">{errors.birthDate}</Text> : null}
            </Box>
            {/* Tanggal Pengukuran */}
            <Box marginBottom={4} my={"$2"} width={"50%"} borderTopStartRadius={5} borderTopEndRadius={5}>
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
              {errors.measurementDate ? <Text color="red" fontSize="$sm">{errors.measurementDate}</Text> : null}
            </Box>
          </HStack>
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Usia (Bulan)
            </Text>
            <Input isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
              <Text>{age} ({ageInMonth} Bulan)</Text>
            </Input>
          </Box>
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Jenis Kelamin
            </Text>
            <RadioGroup value={gender} onChange={setGender}>
              <HStack space="2xl">
                <Radio value="Laki Laki">
                  <RadioIndicator mr="$2">
                    <RadioIcon as={CircleIcon} color="#23b160" />
                  </RadioIndicator>
                  <RadioLabel>Laki Laki</RadioLabel>
                </Radio>
                <Radio value="Perempuan">
                  <RadioIndicator mr="$2">
                    <RadioIcon as={CircleIcon} color="#23b160" />
                  </RadioIndicator>
                  <RadioLabel>Perempuan</RadioLabel>
                </Radio>
              </HStack>
            </RadioGroup>
            {errors.gender ? <Text color="red" fontSize="$sm">{errors.gender}</Text> : null}
          </Box>
          {/* Deskripsi Pengukuran */}
          <HStack justifyContent="space-between">
            <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
              <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                Berat Badan (kg)
              </Text>
              <Input padding={"$2"} width="100%" backgroundColor="gray.100">
                <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                  setWeight(text);
                }} />
              </Input>
              {errors.weight ? <Text color="red" fontSize="$sm">{errors.weight}</Text> : null}
            </Box>
            <Box marginBottom={4} my={"$4"} width="50%">
              <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                Tinggi Badan (cm)
              </Text>
              <Input width="100%" padding={"$2"} backgroundColor="gray.100">
                <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                  setHeight(text);
                }} />
              </Input>
              {errors.height ? <Text color="red" fontSize="$sm">{errors.height}</Text> : null}
            </Box>
          </HStack>
          {/* <HStack justifyContent="space-between">
            <Box marginBottom={"$20"} my={"$4"} width="$full">
              <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                Indeks Massa Tubuh (IMT) 
              </Text>
              <Input width="100%" padding={"$2"} backgroundColor="gray.100" isDisabled={true}>
                <InputField p={"$5"} multiline={true} value={imt !== null ? imt.toFixed(2) : "0"}  />
              </Input>
            </Box>
          </HStack> */}
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
        onPress={handleSubmit}
      >
        <Text textAlign="center" my={"$4"} color="white">Simpan Pengukuran</Text>
      </Pressable>

      {submitted && (
      <>
        {console.log("Memanggil ZScoreCalculator dengan data:", {
          age: ageInMonth,
          weight: parseFloat(weight),
          height: parseFloat(height),
          gender: gender
        })}
        <ZScoreCalculator 
          age={ageInMonth} 
          weight={parseFloat(weight)} 
          height={parseFloat(height) || null}
          gender={gender}
        />
      </>
    )}

    </Box>
  );
};

export default GiziAnakSekolah;