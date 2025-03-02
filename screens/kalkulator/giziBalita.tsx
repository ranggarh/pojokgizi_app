import React, { useState, useEffect } from "react";
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
  SelectContent,
  VStack,
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
import ZScoreCalculator from "../../components/rumus/zscoreCalculatorBalita";


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
  const [isOpen, setIsOpen] = useState(false);
  const [kondisi, setKondisi] = useState("Kritis");
  const [kategoriKritis, setKategoriKritis] = useState("");
  const [BMR, setBMR] = useState(0);
  const [TEE, setTEE] = useState(0);
  const [metode, setMetode] = useState("");
  const [dataInput, setDataInput] = useState(0);
  const [proteinGram, setProteinGram] = useState(0);
  const [proteinKkal, setProteinKkal] = useState(0);
  const [persenLemak, setPersenLemak] = useState(0);
  const [lemakKkal, setLemakKkal] = useState(0);
  const [lemakGram, setLemakGram] = useState(0);
  const [metodeKarbo, setMetodeKarbo] = useState("");
  const [persenKarbo, setPersenKarbo] = useState(0);
  const [karboKkal, setKarboKkal] = useState(0);
  const [karboGram, setKarboGram] = useState(0);


  const navigation = useNavigation();

  const calculateCorrectedHeight = (pos: string) => {
    let correctedValue = 0;
    
    // Hitung selisih usia dalam bulan
    const diff = new Date(measurementDate - birthDate);
    const years = diff.getUTCFullYear() - 1970; // Hitung tahun
    const months = diff.getUTCMonth(); // Hitung bulan
    const totalMonths = years * 12 + months; // Total bulan

    // Tentukan nilai yang digunakan berdasarkan usia
    if (totalMonths < 24) {
        // Usia kurang dari 2 tahun: gunakan Panjang Badan
        correctedValue = parseFloat(panjangBadan) || 0;
        setCorrectedPanjangBadan(correctedValue.toFixed(2)); // Simpan hasil koreksi panjang badan
        setCorrectedHeight("-"); // Set TB Koreksi ke "-"
        
        // Logika untuk posisi pengukuran
        if (pos === "Berdiri") {
            correctedValue += 0.7; // Tambah 0.7 cm jika berdiri
        }
    } else {
        // Usia 2 tahun atau lebih: gunakan Tinggi Badan
        correctedValue = parseFloat(height) || 0;
        setCorrectedHeight(correctedValue.toFixed(2)); // Simpan hasil koreksi tinggi badan
        setCorrectedPanjangBadan("-"); // Set PB Koreksi ke "-"
        
        // Logika untuk posisi pengukuran
        if (pos === "Terlentang") {
            correctedValue -= 0.7; // Kurangi 0.7 cm jika terlentang
        }
    }

    // Update nilai koreksi berdasarkan usia
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
        valid = false;
      }
    } else {
      // Usia >= 2 Tahun: Validasi Tinggi Badan saja
      if (!height) {
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
      navigation.navigate('Hasil Perhitungan Balita', { posisiPengukuran, name, age: Number(ageInDays), ageInYears: age, gender, weight: parseFloat(weight), height: parseFloat(correctedHeight), panjangBadan: parseFloat(correctedPanjangBadan)});
    }
  };

  const cekKategoriKritis = () => {
    let kategori = "";

  if (kondisi === "Kritis") {
      if (ageInDays >= 0 && ageInDays <= 1094) { // 5 - 9 tahun (60 - 108 bulan)
        kategori = `Kritis ${gender} 0 - 2 tahun`;
      } else if (ageInDays > 1095 && ageInDays <= 1825) { // 10 - 18 tahun (108 - 216 bulan)
        kategori = `Kritis ${gender} 3 - 5 tahun`;
      } else {
        kategori = "Usia tidak termasuk dalam kategori kritis";
      }
    } else {
      if (ageInDays >= 0 && ageInDays <= 1094) { // 5 - 9 tahun (60 - 108 bulan)
        kategori = `Tidak Kritis ${gender} 0 - 2 tahun`;
      } else if (ageInDays > 1095 && ageInDays <= 1825) { // 10 - 18 tahun (108 - 216 bulan)
        kategori = `Tidak Kritis ${gender} 3 - 5 tahun`;
      } else {
        kategori = "Usia tidak termasuk dalam kategori tidak kritis";
      }
    }  
    setKategoriKritis(kategori);
  };

  useEffect(() => {
      cekKategoriKritis();
    }, [ageInDays, gender, kondisi])

  const hitungBMRdanTEE = (kategori, weight, correctedHeight, correctedPanjangBadan) => {
      let BMR = 0;
      let TEE = 0;
    
      switch (kategori) {
        case "Kritis Laki Laki 3 - 5 tahun":
          BMR = (19.6 * weight) + (1.30 * correctedHeight) + 414.9;
          TEE = BMR + 40;
          break;
        case "Tidak Kritis Laki Laki 3 - 5 tahun":
          BMR = (22.706 * weight) + 504.3;
          TEE = BMR + 40;
          break;
        case "Kritis Laki Laki 0 - 2 tahun":
          BMR = (0.167 * weight) + (15.17 * correctedHeight) + 617,6;
          TEE = BMR + 40;
          break;
        case "Tidak Kritis Laki Laki 0 - 2 tahun":
          BMR = (59.51 * weight) + 30.33;
          TEE = BMR + 40;
          break;
        case "Kritis Perempuan 0 - 2 tahun":
          BMR = (16.25 * weight) + (15.17 * correctedPanjangBadan) + 371.2;
          TEE = BMR + 40;
          break;
        case "Tidak Kritis Perempuan 0 - 2 tahun":
          BMR = (58.31 * weight) + 31.07;
          TEE = BMR + 40;
          break;
        case "Kritis Perempuan 3 - 5 tahun":
          BMR = (16.97 * weight) + (1.61 * correctedHeight) + 371.2;
          TEE = BMR + 40;
          break;
        case "Tidak Kritis Perempuan 10 - 18 tahun":
          BMR = (20.315 * weight) + 485.9;
          TEE = BMR + 40;
          break;
        default:
          BMR = 0;
          TEE = 0;
      }
    
      return { BMR, TEE };
    };
    
    useEffect(() => {
      const { BMR, TEE } = hitungBMRdanTEE(kategoriKritis, weight, height);
      setBMR(BMR);
      setTEE(TEE);
    }, [kategoriKritis, weight, height]);

    const hitungProtein = (metode, dataInput, weight, TEE) => {
        console.log(`Metode: ${metode}, Input: ${dataInput}, Weight: ${weight}, TEE: ${TEE}`);
        let proteinGram = 0;
        let proteinKkal = 0;
      
        if (!isNaN(dataInput)) {
          if (metode === "gram protein") {
            proteinGram = dataInput * weight;
            proteinKkal = proteinGram * 4;
          } else if (metode === "persentase") {
            proteinKkal = TEE * (dataInput / 100);
            proteinGram = proteinKkal / 4;
          }
        }
    
        console.log(`Protein (g): ${proteinGram}, Protein (kkal): ${proteinKkal}`);
      
        return { proteinGram, proteinKkal };
      };
      
      useEffect(() => {
        const { proteinGram, proteinKkal } = hitungProtein(metode, dataInput, weight, TEE);
        setProteinGram(proteinGram);
        setProteinKkal(proteinKkal);
      }, [metode, dataInput, weight, TEE]);
    
      const hitungLemak = (persenLemak, TEE) => {
        let lemakGram = 0;
        let lemakKkal = 0;
      
        if (!isNaN(persenLemak)) {
          lemakKkal = TEE * (persenLemak / 100);
          lemakGram = lemakKkal / 9;
        }
      
        return {lemakKkal, lemakGram};
      };
    
      useEffect(() => {
        const { lemakGram, lemakKkal } = hitungLemak(persenLemak, TEE);
        setLemakGram(lemakGram);
        setLemakKkal(lemakKkal);
      }, [persenLemak, TEE]);
    
      const hitungKarbohidrat = (metodeKarbo, TEE, proteinKkal, lemakKkal, persenKarbo) => {
        let karboKkal = 0;
        let karboGram = 0;
      
        if (metodeKarbo === "sisa") {
          karboKkal = TEE - (proteinKkal + lemakKkal);
          karboGram = karboKkal / 4;
        } else if (metodeKarbo === "persentase") {
          if (!isNaN(persenKarbo)) {
            karboKkal = (persenKarbo / 100) * TEE;
            karboGram = karboKkal / 4;
          }
        }
      
        console.log(`${persenKarbo} Karbo (g): ${karboGram}, Karbo (kkal): ${karboKkal}`);
        return { karboGram, karboKkal };
      };
      
      useEffect(() => {
        const { karboGram, karboKkal } = hitungKarbohidrat(metodeKarbo, TEE, proteinKkal, lemakKkal, persenKarbo);
        setKarboGram(karboGram);
        setKarboKkal(karboKkal);
      }, [metodeKarbo, TEE, proteinKkal, lemakKkal, persenKarbo]);
    


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

        <Box mb="$4" mb={"$20"}>
            <Pressable onPress={() => setIsOpen(!isOpen)}>
              <Box bg="#23b160" w="$full" h="$12"  justifyContent="space-between" flexDirection="row" borderRadius={5} >
                <Text color="white" fontWeight="$bold" my="$3" ml="$4">{isOpen ? "Kebutuhan Energi" : "Kebutuhan Energi"} (Opsional)</Text>
                <Box my="$3" mr="$4">
                  <Ionicons name="chevron-down" size={24} color="white" />
                </Box>
              </Box>
            </Pressable>
            {/* Form (tampil hanya jika isOpen true) */}
            {isOpen && (
              <Box bg="white" softShadow={"4"}> 
                <Box ml="$4" minWidth="$8" borderRadius="$sm" alignSelf="flex-start" px="$4" h="$8" mt="$4" justifyContent="center" bg="#F98D3A"><Text color="white" fontWeight="$bold" fontSize="$sm">Kebutuhan Energi</Text></Box>
                <Box mx="$4">
                <Box marginBottom={"$4"} my={"$4"}>
                  <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                    Kondisi Fisik
                  </Text>
                  <RadioGroup value={kondisi} onChange={setKondisi}>
                    <HStack space="2xl">
                      <Radio value="Kritis">
                        <RadioIndicator mr="$2">
                          <RadioIcon as={CircleIcon} color="#23b160" />
                        </RadioIndicator>
                        <RadioLabel>Kritis</RadioLabel>
                      </Radio>
                      <Radio value="Tidak Kritis">
                        <RadioIndicator mr="$2">
                          <RadioIcon as={CircleIcon} color="#23b160" />
                        </RadioIndicator>
                        <RadioLabel>Tidak Kritis</RadioLabel>
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </Box>
                  {kategoriKritis && (
                    <Box>
                      <Input isDisabled={true} padding="$2" width="100%" backgroundColor="gray.100">
                      <Text fontSize="$md" fontWeight="$bold" color="red.600">
                        {kategoriKritis}
                      </Text>
                      </Input>
                      <HStack justifyContent="space-between" mb={"$4"}>
                        <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            BMR
                          </Text>
                          <Input isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                          <Text fontSize="$md" fontWeight="$bold" color="red.600">
                            {BMR}
                            </Text>
                          </Input>
                        </Box>
                        <Box marginBottom={4} my={"$4"} width="50%">
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            TEE
                          </Text>
                          <Input isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
                          <Text fontSize="$md" fontWeight="$bold" color="red.600">
                            {TEE}
                          </Text>
                          </Input>
                        </Box>
                      </HStack>
                    </Box>              
                  )}
                </Box>

                {/* Kebutuhan Protein */}
                <Box ml="$4" minWidth="$8" borderRadius="$sm" alignSelf="flex-start" px="$4" h="$8" justifyContent="center" bg="#F98D3A">
                  <Text color="white" fontSize="$sm" fontWeight="$bold">Kebutuhan Protein</Text>
                </Box>
                <Box mx="$4">
                  <Box marginBottom={"$4"} my={"$4"}>
                    <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                      Metode
                    </Text>
                    <RadioGroup value={metode} onChange={setMetode}>
                      <HStack space="2xl">
                        <Radio value="gram protein">
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} color="#23b160" />
                          </RadioIndicator>
                          <RadioLabel>Gram x BB Aktual</RadioLabel>
                        </Radio>
                        <Radio value="persentase">
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} color="#23b160" />
                          </RadioIndicator>
                          <RadioLabel>Persentase TEE</RadioLabel>
                        </Radio>
                      </HStack>
                    </RadioGroup>
                  </Box>
                  {kategoriKritis && (
                    <Box mb={"$4"}>
                      <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                        {metode === "gram protein" ? "Gram Protein" : "Persentase Protein"}
                      </Text>
                      <Box flexDirection="row">
                        <Input padding="$2" width="85%" backgroundColor="gray.100">
                          <InputField
                            keyboardType="numeric"
                            placeholder="Enter Text here"
                            onChangeText={(text) => {
                              const value = parseFloat(text);
                              setDataInput(isNaN(value) ? 0 : value); // Set to 0 if NaN
                            }}
                          />
                        </Input>
                        <Text my={"$2"} ml={"$2"} fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">{metode === "gram protein" ? "gram" : "%"}</Text>
                      </Box>
                      <HStack justifyContent="space-between" mb={"$4"}>
                        <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Protein (g)
                          </Text>
                          <Input isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                            <Text fontSize="$md" fontWeight="$bold" color="red.600">
                              {proteinGram}
                            </Text>
                          </Input>
                        </Box>
                        <Box marginBottom={4} my={"$4"} width="50%">
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Protein (kkal)
                          </Text>
                          <Input isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
                            <Text fontSize="$md" fontWeight="$bold" color="red.600">
                              {proteinKkal}
                            </Text>
                          </Input>
                        </Box>
                      </HStack>
                    </Box>
                  )}
                </Box>
                
                {/* Kebutuhan Lemak */}
                <Box ml="$4" minWidth="$8" borderRadius="$sm" alignSelf="flex-start" px="$4" h="$8" justifyContent="center" bg="#F98D3A">
                  <Text color="white" fontSize="$sm" fontWeight="$bold">Kebutuhan Lemak</Text>
                </Box>
                <Box mx="$4" my={"$4"}>               
                  {kategoriKritis && (
                    <Box mb={"$4"}>
                      <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                        Persentase Lemak
                      </Text>
                      <Box flexDirection="row">
                        <Input padding="$2" width="85%" backgroundColor="gray.100">
                          <InputField
                            keyboardType="numeric"
                            placeholder="Enter Text here"
                            onChangeText={(text) => {
                              const value = parseFloat(text);
                              setPersenLemak(isNaN(value) ? 0 : value); // Set to 0 if NaN
                            }}
                          />
                        </Input>
                        <Text my={"$2"} ml={"$2"} fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">%</Text>
                      </Box>
                      <HStack justifyContent="space-between" mb={"$4"}>
                        <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            lemak (g)
                          </Text>
                          <Input isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                            <Text fontSize="$md" fontWeight="$bold" color="red.600">
                              {lemakGram}
                            </Text>
                          </Input>
                        </Box>
                        <Box marginBottom={4} my={"$4"} width="50%">
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Lemak (kkal)
                          </Text>
                          <Input isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
                            <Text fontSize="$md" fontWeight="$bold" color="red.600">
                              {lemakKkal}
                            </Text>
                          </Input>
                        </Box>
                      </HStack>
                    </Box>
                  )}
                </Box>

                {/* Kebutuhan Karbohidrat */}
                <Box ml="$4" minWidth="$8" borderRadius="$sm" alignSelf="flex-start" px="$4" h="$8" justifyContent="center" bg="#F98D3A">
                  <Text color="white" fontSize="$sm" fontWeight="$bold">Kebutuhan Karbohidrat</Text>
                </Box>
                <Box mx="$4">
                  <Box marginBottom={"$4"} my={"$4"}>
                    <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                      Metode Karbohidrat
                    </Text>
                    <RadioGroup value={metodeKarbo} onChange={setMetodeKarbo}>
                      <VStack space="2xl">
                        <Radio value="sisa">
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} color="#23b160" />
                          </RadioIndicator>
                          <RadioLabel>Sisa dari Kebutuhan Lemak dan Protein</RadioLabel>
                        </Radio>
                        <Radio value="persentase">
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} color="#23b160" />
                          </RadioIndicator>
                          <RadioLabel>Persentase TEE</RadioLabel>
                        </Radio>
                      </VStack>
                    </RadioGroup>
                  </Box>
                  {kategoriKritis && (
                    <Box mb={"$4"}>
                      <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                        {metodeKarbo === "sisa" ? "Sisa dari Kebutuhan Lemak dan Protein" : "Persentase TEE"}
                      </Text>
                      {metodeKarbo === "persentase" && (
                        <Input padding="$2" width="100%" backgroundColor="gray.100">
                          <InputField
                            keyboardType="numeric"
                            placeholder="Enter Percentage here"
                            onChangeText={(text) => {
                              const value = parseFloat(text);
                              setPersenKarbo(isNaN(value) ? 0 : value); // Set to 0 if NaN
                            }}
                          />
                        </Input>
                      )}
                      <HStack justifyContent="space-between" mb={"$4"}>
                        <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Karbohidrat (g)
                          </Text>
                          <Input isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                            <Text fontSize="$md" fontWeight="$bold" color="red.600">
                              {karboGram}
                            </Text>
                          </Input>
                        </Box>
                        <Box marginBottom={4} my={"$4"} width="50%">
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Karbohidrat (kkal)
                          </Text>
                          <Input isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
                            <Text fontSize="$md" fontWeight="$bold" color="red.600">
                              {karboKkal}
                            </Text>
                          </Input>
                        </Box>
                      </HStack>
                    </Box>
                  )}
                </Box>
              </Box>
              
            )}
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
        onPress={handleSubmit} >
        <Text textAlign="center" my={"$4"} color="white">Simpan Pengukuran</Text>
      </Pressable>
      
     
    </Box>
  );
};

export default GiziBalita;
