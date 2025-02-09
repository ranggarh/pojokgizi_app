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
  Radio,
  RadioGroup,
  RadioIcon,
  RadioLabel,
  RadioIndicator, 
  CircleIcon,
  ChevronDownIcon,
  SelectContent
} from "@gluestack-ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Select } from "@gluestack-ui/themed";
import { SelectTrigger } from "@gluestack-ui/themed";
import { SelectInput } from "@gluestack-ui/themed";
import { SelectIcon } from "@gluestack-ui/themed";
import { Icon } from "@gluestack-ui/themed";
import { SelectPortal } from "@gluestack-ui/themed";
import { SelectBackdrop } from "@gluestack-ui/themed";
import { SelectDragIndicatorWrapper } from "@gluestack-ui/themed";
import { SelectDragIndicator } from "@gluestack-ui/themed";
import { SelectItem } from "@gluestack-ui/themed";
import ZScoreCalculator from "../../components/rumus/zscoreCalculator";


interface navigation {
  navigate: (screen: string) => void;
}

const GiziBalita = () => {
  const [measurementDate, setMeasurementDate] = useState(new Date());
  const [birthDate, setBirthDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ type: "", visible: false });
  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Laki Laki");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [panjangBadan, setPanjangBadan] = useState("");
  const [errors, setErrors] = useState({ name: '', gender: '', weight: '', height: '', panjangBadan:'',  birthDate: '', measurementDate: '' });  
  const [isHeightDisabled, setIsHeightDisabled] = useState(false);
  const [isPanjangBadanDisabled, setIsPanjangBadanDisabled] = useState(false);
  const [posisiPengukuran, setPosisiPengukuran] = useState("Terlentang");
  const [correctedHeight, setCorrectedHeight] = useState(""); 
  const [correctedPanjangBadan, setCorrectedPanjangBadan] = useState("");
  const [ageInDays, setAgeInDays] = useState(0);
  const [submitted, setSubmitted] = useState(false);


  const navigation = useNavigation();

  const calculateCorrectedHeight = (pos: string) => {
    let correctedValue = 0;

    // Determine which value to use based on age
    const diff = new Date(measurementDate - birthDate);
    const years = diff.getUTCFullYear() - 1970; // Calculate years
    const months = diff.getUTCMonth(); // Calculate months
    const totalMonths = years * 12 + months; // Total months

    if (totalMonths < 24) {
        // Under 2 years: use Panjang Badan
        correctedValue = parseFloat(panjangBadan) || 0;
        setCorrectedPanjangBadan(correctedValue.toFixed(2)); // Simpan hasil koreksi panjang badan
        setCorrectedHeight("-"); // Set TB Koreksi ke "-"
    } else {
        // 2 years and older: use Tinggi Badan
        correctedValue = parseFloat(height) || 0;
        setCorrectedHeight(correctedValue.toFixed(2)); // Simpan hasil koreksi tinggi badan
        setCorrectedPanjangBadan("-"); // Set PB Koreksi ke "-"
    }

    // If standing, add 0.70 cm
    if (pos === "Berdiri") {
        correctedValue += 0.7;
    }

    // Update the corrected height or panjang badan based on position
    if (totalMonths < 24) {
        setCorrectedPanjangBadan(correctedValue.toFixed(2));
    } else {
        setCorrectedHeight(correctedValue.toFixed(2));
    }
  };

const calculateAge = () => {
  const diff = measurementDate.getTime() - birthDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Hitung hari
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  const months = Math.floor(remainingDays / 30);
  const extraDays = remainingDays % 30; // Sisa hari setelah bulan dihitung

  setAge(`${years} Tahun ${months} Bulan`);
  setAgeInDays(days); // Simpan usia dalam satuan hari

  if (years < 2) {
    setIsHeightDisabled(true);
    setIsPanjangBadanDisabled(false);
  } else {
    setIsHeightDisabled(false);
    setIsPanjangBadanDisabled(true);
  }
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
    setErrors({ name: '', gender: '', weight: '', height: '', panjangBadan:'', birthDate: '',measurementDate: ''  });

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
    if (!weight) {
      setErrors(prev => ({ ...prev, weight: 'Berat Badan tidak boleh kosong' }));
      valid = false;
    }
    // Validasi Usia dan Kolom Aktif
    const diff = new Date(measurementDate - birthDate);
    const years = diff.getUTCFullYear() - 1970;
    const months = years * 12 + diff.getUTCMonth(); // Total bulan usia anak

    if (months < 24) {
      // Usia < 2 Tahun: Validasi Panjang Badan saja
      if (!panjangBadan) {
        setErrors(prev => ({ ...prev, panjangBadan: 'Panjang Badan tidak boleh kosong' }));
        valid = false;
      }
    } else {
      // Usia >= 2 Tahun: Validasi Tinggi Badan saja
      if (!height) {
        setErrors(prev => ({ ...prev, height: 'Tinggi Badan tidak boleh kosong' }));
        valid = false;
      }
    }

    // Validasi Tanggal Lahir
    const today = new Date();
    // Validasi Tanggal Lahir
    if (birthDate > today) {
      setErrors(prev => ({ ...prev, birthDate: 'Tanggal Lahir tidak boleh lebih dari hari ini' }));
      valid = false;
    }

    // Validasi Tanggal Pengukuran
    if (measurementDate < birthDate) {
      setErrors(prev => ({ ...prev, measurementDate: 'Tanggal Pengukuran tidak boleh lebih kecil dari Tanggal Lahir' }));
      valid = false;
    }

    if (measurementDate > today) {
      setErrors(prev => ({ ...prev, measurementDate: 'Tanggal Pengukuran tidak boleh lebih dari hari ini' }));
      valid = false;
    }

    if (valid) {
      // Navigate to the next screen if all validations pass
      navigation.navigate('Data Pengukuran');
    }
  };

  return (
    <Box flex={1} justifyContent="space-between">
    <Box width="100%" h={120} bg={"#23b160"} flexDirection="row" justifyContent="space-between">
        <Box width={"$48"} >
            <Image 
            source={require("../../assets/math.png")} 
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
        {/* Nama Pengukuran */}
        <Box marginBottom={"$2"} my={"$2"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Nama Lengkap
            </Text>
            <Input padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField placeholder="Enter Text here" onChangeText={text => setName(text)}  />
            </Input>
            {errors.name ? <Text color="red" fontSize="$sm">{errors.name}</Text> : null}
          </Box>
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
              {errors.birthDate ? <Text color="red" fontSize="$sm">{errors.birthDate}</Text> : null}

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
            {errors.measurementDate ? <Text color="red" fontSize="$sm">{errors.measurementDate}</Text> : null}

          </Box>
          
        </HStack>
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Usia (Bulan) 
            </Text>
            <Input isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
              <Text>{age} ({ageInDays} Hari)</Text>
            </Input>
          </Box>
          
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Jenis Kelamin
            </Text>
            <RadioGroup value={gender} onChange={setGender}>
                <HStack space="2xl">
                    <Radio value="Laki Laki">
                    <RadioIndicator mr="$2" >
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
          <Box marginBottom={4} my={"$4"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Berat Badan (kg)
            </Text>
            <Input padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => setWeight(text)} />
            </Input>
            {errors.weight ? <Text color="red" fontSize="$sm">{errors.weight}</Text> : null}

          </Box>
          {/* Deskripsi Pengukuran */}
          <HStack justifyContent="space-between">
          <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Panjang Badan (cm)
            </Text>
            <Input width="100%" padding={"$2"} backgroundColor="gray.100" isDisabled={isPanjangBadanDisabled} >
              <InputField keyboardType="numeric" p={"$5"} multiline={true} placeholder="Enter Text here" onChangeText={text => setPanjangBadan(text)} />
            </Input>
            {errors.panjangBadan ? <Text color="red" fontSize="$sm">{errors.panjangBadan}</Text> : null}
          </Box>
          <Box marginBottom={"$20"} my={"$4"} width="50%">
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Tinggi Badan (cm)
            </Text>
            <Input width="100%" padding={"$2"} backgroundColor="gray.100" isDisabled={isHeightDisabled}>
              <InputField keyboardType="numeric" p={"$5"} multiline={true} placeholder="Enter Text here" onChangeText={text => setHeight(text)} />
            </Input>
            {errors.height ? <Text color="red" fontSize="$sm">{errors.height}</Text> : null}

          </Box>
          </HStack>

          <HStack justifyContent="space-between" mt={"-$20"}>
          <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
              Cara Ukur
            </Text>
            <Select selectedValue={posisiPengukuran} onValueChange={(value) => {
                setPosisiPengukuran(value);
                calculateCorrectedHeight(value); // Call the function to calculate corrected height
            }}>
                <SelectTrigger width="100%" backgroundColor="gray.100">
                    <SelectInput placeholder="Pilih Posisi" />
                    <SelectIcon>
                        <ChevronDownIcon />
                    </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                        <SelectItem label="Berdiri" value="Berdiri" />
                        <SelectItem label="Terlentang" value="Terlentang" />
                    </SelectContent>
                </SelectPortal>
            </Select>
            {errors.panjangBadan ? <Text color="red" fontSize="$sm">{errors.panjangBadan}</Text> : null}
          </Box>
          <Box marginBottom={"$20"} my={"$4"} width="50%">
            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                TB/PB Koreksi (cm)
            </Text>
            <Input width="100%" padding={"$2"} backgroundColor="gray.100" isDisabled={true}>
                <InputField p={"$5"} multiline={true} value={correctedHeight || "0"} />
            </Input>
        </Box>
          </HStack>
          <HStack justifyContent="space-between" mt={"-$20"}>
        <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
            Panjang Badan Koreksi (cm)
          </Text>
          <Input width="100%" padding={"$2"} backgroundColor="gray.100" isDisabled={true}>
            <InputField p={"$5"} multiline={true} value={correctedPanjangBadan} />
          </Input>
        </Box>
        <Box marginBottom={"$20"} my={"$4"} width="50%">
          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
            Tinggi Badan Koreksi (cm)
          </Text>
          <Input width="100%" padding={"$2"} backgroundColor="gray.100" isDisabled={true}>
            <InputField p={"$5"} multiline={true} value={correctedHeight} />
          </Input>
        </Box>
      </HStack>
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
        onPress={() => setSubmitted(true)}      >
        <Text textAlign="center" my={"$4"} color="white">Simpan Pengukuran</Text>
      </Pressable>
      
      {submitted && (
        <>
          
          <ZScoreCalculator 
            age={ageInDays} 
            weight={parseFloat(weight)} 
            height={parseFloat(correctedHeight ) || null}
            panjangBadan={parseFloat(correctedPanjangBadan) || null}
            gender={gender}
          />
          {console.log("Data yang dikirim ke ZScoreCalculator:", {
            age: ageInDays,
            weight: parseFloat(weight),
            height: parseFloat(correctedHeight),
            panjangBadan: parseFloat(correctedPanjangBadan),
            gender: gender
          })}
        </>
      )}

    </Box>
  );
};

export default GiziBalita;
