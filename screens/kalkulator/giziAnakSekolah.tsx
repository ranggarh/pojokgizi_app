import React, { useState, useEffect } from "react";
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
import { VStack } from "@gluestack-ui/themed";

const GiziAnakSekolah = () => {
  const [measurementDate, setMeasurementDate] = useState(new Date());
  const [birthDate, setBirthDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ type: "", visible: false });
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Laki Laki");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [errors, setErrors] = useState({ name: '', gender: '', weight: '', height: '', birthDate: '', measurementDate: '' });
  const [age, setAge] = useState("");
  const [ageInMonth, setAgeInMonth] = useState(0);
  const [selectedForm, setSelectedForm] = useState<"kalkulator" | "asupan">("kalkulator"); // State untuk memilih form
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
      navigation.navigate("Hasil Perhitungan Anak Remaja", { name, gender, weight: parseFloat(weight), height: parseFloat(height), age: (ageInMonth), ageInYears: age });
    }
  };

  const cekKategoriKritis = () => {
    let kategori = "";

    if (kondisi === "Kritis") {
      if (ageInMonth >= 60 && ageInMonth <= 108) { // 5 - 9 tahun (60 - 108 bulan)
        kategori = `Kritis ${gender} 5 - 9 tahun`;
      } else if (ageInMonth > 108 && ageInMonth <= 216) { // 10 - 18 tahun (108 - 216 bulan)
        kategori = `Kritis ${gender} 10 - 18 tahun`;
      } else {
        kategori = "Usia tidak termasuk dalam kategori kritis";
      }
    } else {
      if (ageInMonth >= 60 && ageInMonth <= 108) { // 5 - 9 tahun (60 - 108 bulan)
        kategori = `Tidak Kritis ${gender} 5 - 9 tahun`;
      } else if (ageInMonth > 108 && ageInMonth <= 216) { // 10 - 18 tahun (108 - 216 bulan)
        kategori = `Tidak Kritis ${gender} 10 - 18 tahun`;
      } else {
        kategori = "Usia tidak termasuk dalam kategori tidak kritis";
      }
    }
    setKategoriKritis(kategori);
  };

  useEffect(() => {
    cekKategoriKritis();
  }, [ageInMonth, gender, kondisi])

  const hitungBMRdanTEE = (kategori, weight, height) => {
    let BMR = 0;
    let TEE = 0;

    switch (kategori) {
      case "Kritis Laki Laki 5 - 9 tahun":
        BMR = (19.6 * weight) + (1.30 * height) + 414.9;
        TEE = BMR + 40;
        break;
      case "Tidak Kritis Laki Laki 5 - 9 tahun":
        BMR = (22.706 * weight) + 504.3;
        TEE = BMR + 40;
        break;
      case "Kritis Laki Laki 10 - 18 tahun":
        BMR = (16.25 * weight) + (1.372 * height) + 515.5;
        TEE = BMR + 40;
        break;
      case "Tidak Kritis Laki Laki 10 - 18 tahun":
        BMR = (13.384 * weight) + 692.6;
        TEE = BMR + 40;
        break;
      case "Kritis Perempuan 5 - 9 tahun":
        BMR = (16.97 * weight) + (1.61 * height) + 371.2;
        TEE = BMR + 40;
        break;
      case "Tidak Kritis Perempuan 5 - 9 tahun":
        BMR = (20.315 * weight) + 485.9;
        TEE = BMR + 40;
        break;
      case "Kritis Perempuan 10 - 18 tahun":
        BMR = (8.365 * weight) + (4.65 * height) + 200;
        TEE = BMR + 40;
        break;
      case "Tidak Kritis Perempuan 10 - 18 tahun":
        BMR = (17.686 * weight) + 658.2;
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

    return { lemakKkal, lemakGram };
  }

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
        <Box width={"$35%"}>
          <Image
            source={require("../../assets/math.png")}
            alt="Pantau Tumbuh Kembang Anak Secara Berkala"
            width={160}
            height={150}
            ml={"$2"}
          />
        </Box>
        <Box width={"$65%"} mx={"$2"}>
          <Text fontSize={"$lg"} m={"$4"} fontWeight={"$bold"} color={"white"}>Kalkulator Status Gizi</Text>
          <Text fontSize={"$sm"} m={"$4"} mt={"-$2"} color={"white"}>Hitung Data Pengukuran Status Gizi Anda di sini Bersama PojokGizi Indonesia.</Text>
        </Box>
      </Box>
      <ScrollView
        backgroundColor="white"
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
      >
        {/* <HStack alignSelf="center">
          <Button
            width={"$50%"}
            h={"$12"}
            bg={selectedForm === "kalkulator" ? "#23b160" : "#E0E0E0"} // Warna berubah saat dipilih
            onPress={() => setSelectedForm("kalkulator")}
            borderStartStartRadius={50}
            borderStartEndRadius={50}
            borderTopEndRadius={0}
            borderBottomEndRadius={0}
          >
            <Text color={selectedForm === "kalkulator" ? "white" : "black"} fontWeight={"$bold"}>Kalkulator Gizi</Text>
          </Button>
          <Button
            width={"$50%"}
            h={"$12"}
            bg={selectedForm === "asupan" ? "#23b160" : "#E0E0E0"} // Warna berubah saat dipilih
            onPress={() => setSelectedForm("asupan")}
            borderTopStartRadius={0}
            borderBottomStartRadius={0}
            borderEndStartRadius={50}
            borderEndEndRadius={50}
          >
            <Text color={selectedForm === "asupan" ? "white" : "black"} fontWeight={"$bold"}>Kebutuhan Asupan</Text>
          </Button>
        </HStack> */}
        {selectedForm === "kalkulator" ? (
          <Box>
            {/* Nama Pengukuran */}
            <Box marginBottom={"$2"} my={"$2"}>
              <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                Nama Lengkap
              </Text>
              <Input padding={"$2"} width="100%" backgroundColor="white" borderColor="#F98D3A">
                <InputField placeholder="Masukkan Nama Lengkap" onChangeText={text => setName(text)} />
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
                  <Input borderColor="#F98D3A" width="100%" backgroundColor="gray.100" isReadOnly>
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
                  <Input borderColor="#F98D3A" width="100%" backgroundColor="gray.100" isReadOnly>
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
              <Input borderColor="#F98D3A" isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
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
            <HStack justifyContent="space-between" mb={"$4"}>
              <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                  Berat Badan (kg)
                </Text>
                <Input borderColor="#F98D3A" padding={"$2"} width="100%" backgroundColor="gray.100">
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
                <Input borderColor="#F98D3A" width="100%" padding={"$2"} backgroundColor="gray.100">
                  <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                    setHeight(text);
                  }} />
                </Input>
                {errors.height ? <Text color="red" fontSize="$sm">{errors.height}</Text> : null}
              </Box>
            </HStack>

            <Box mb="$4" mb={"$20"}>
              <Pressable onPress={() => setIsOpen(!isOpen)}>
                <Box bg="#23b160" w="$full" h="$12" justifyContent="space-between" flexDirection="row" borderRadius={5} >
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
                        <Input borderColor="#F98D3A" isDisabled={true} padding="$2" width="100%" backgroundColor="gray.100">
                          <Text fontSize="$md" fontWeight="$bold" color="red.600">
                            {kategoriKritis}
                          </Text>
                        </Input>
                        <HStack justifyContent="space-between" mb={"$4"}>
                          <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                              BMR
                            </Text>
                            <Input borderColor="#F98D3A" isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                              <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                {BMR}
                              </Text>
                            </Input>
                          </Box>
                          <Box marginBottom={4} my={"$4"} width="50%">
                            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                              TEE
                            </Text>
                            <Input borderColor="#F98D3A" isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
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
                          <Input borderColor="#F98D3A" padding="$2" width="85%" backgroundColor="gray.100">
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
                            <Input borderColor="#F98D3A" isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                              <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                {proteinGram}
                              </Text>
                            </Input>
                          </Box>
                          <Box marginBottom={4} my={"$4"} width="50%">
                            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                              Protein (kkal)
                            </Text>
                            <Input borderColor="#F98D3A" isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
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
                          <Input borderColor="#F98D3A" padding="$2" width="85%" backgroundColor="gray.100">
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
                            <Input borderColor="#F98D3A" isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                              <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                {lemakGram}
                              </Text>
                            </Input>
                          </Box>
                          <Box marginBottom={4} my={"$4"} width="50%">
                            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                              Lemak (kkal)
                            </Text>
                            <Input borderColor="#F98D3A" isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
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
                          <Input borderColor="#F98D3A" padding="$2" width="100%" backgroundColor="gray.100">
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
                            <Input borderColor="#F98D3A" isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                              <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                {karboGram}
                              </Text>
                            </Input>
                          </Box>
                          <Box marginBottom={4} my={"$4"} width="50%">
                            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                              Karbohidrat (kkal)
                            </Text>
                            <Input borderColor="#F98D3A" isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
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


        ) : (
          <Box>
            <Text fontSize={"$md"} fontWeight={"$semibold"} my={"$4"} color="gray.600">
              Form Kebutuhan Asupan
            </Text>
            <Input padding={"$2"} width="100%" backgroundColor="gray.100">
              <InputField placeholder="Berat Badan (kg)" />
            </Input>
            <Input padding={"$2"} width="100%" backgroundColor="gray.100" mt={"$2"}>
              <InputField placeholder="Tinggi Badan (cm)" />
            </Input>
          </Box>
        )}
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



    </Box>
  );
};

export default GiziAnakSekolah;