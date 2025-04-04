import { Box, Radio, RadioIcon, RadioIndicator, InputSlot, HStack, InputField, RadioGroup, RadioLabel, Pressable, Input,Image, ScrollView, Text, CircleIcon, VStack, Select, Icon,  ChevronDownIcon, SelectPortal, SelectItem, SelectInput, SelectTrigger, SelectIcon, SelectBackdrop, SelectDragIndicatorWrapper, SelectDragIndicator, SelectContent } from "@gluestack-ui/themed"
import { Platform } from "react-native";
import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";



type RootStackParamList = {
  "Hasil Perhitungan Anak Remaja": {
    name: string;
    gender: string;
    weight: number;
    height: number;
    age: number;
    ageInYears: number;
  };
};

const PasienDM = () => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [measurementDate, setMeasurementDate] = useState(new Date());
    const [birthDate, setBirthDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState({ type: "", visible: false });
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [lila, setLila] = useState<number>(0);
    const [tinggiLutut, setTinggiLutut] = useState<number>(0);
    const [panjangUlna, setPanjangUlna] = useState<number>(0);
    const [oedema, setOedema] = useState(0);
    const [asites, setAsites] = useState(0);
    const [faktorAktivitas, setFaktorAktivitas] = useState("");
    const [faktorStress, setFaktorStress] = useState("");
    const [age, setAge] = useState<number>(0);
    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState<{ name: string; gender: string; weight: string; height: string; birthDate: string; measurementDate: string; }>({
      name: '',
      gender: '',
      weight: '',
      height: '',
      birthDate: '',
      measurementDate: ''
    });
    const [kondisi, setKondisi] = useState("Kritis");
    const [kategoriKritis, setKategoriKritis] = useState("");
    const [BMR, setBMR] = useState<number>(0);
    const [dataInput, setDataInput] = useState<number>(0);
    const [ageInMonth, setAgeInMonth] = useState<number>(0);
    const [statusKEK, setStatusKEK] = useState("");
    const [ketHamil, setKetHamil] = useState<number>(0);
    const [TEE, setTEE] = useState<number>(0);
    const [metode, setMetode] = useState("");
    const [proteinGram, setProteinGram] = useState(0);
    const [proteinKkal, setProteinKkal] = useState(0);
    const [persenLemak, setPersenLemak] = useState(0);
    const [lemakKkal, setLemakKkal] = useState(0);
    const [lemakGram, setLemakGram] = useState(0);
    const [metodeKarbo, setMetodeKarbo] = useState("");
    const [persenKarbo, setPersenKarbo] = useState(0);
    const [karboKkal, setKarboKkal] = useState(0);
    const [karboGram, setKarboGram] = useState(0);
    const [method, setMethod] = useState(""); // Default method
    const [bbKoreksi, setBbKoreksi] = useState<number | null>(null);
    const [bbi, setBBI] = useState<number>(0); // State untuk hasil BBI
    const [bbAdj, setBbAdj] = useState(0); // Hasil BB Adj
    const [selectedRumus, setSelectedRumus] = useState(""); // RUMUS 1 atau 2 otomatis
    const [selectedBB, setSelectedBB] = useState(''); // State untuk menyimpan pilihan BB
    const [faktorUsia, setFaktorUsia] = useState(0);
    const [IMT, setIMT] = useState(0);
    const [klasifikasiIMT, setKlasifikasiIMT] = useState('');
    const [sliderValue, setSliderValue] = useState(0);
    const [faktorBB, setFaktorBB] = useState(0);




    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

      const calculateAge = () => {
          const diff = measurementDate.getTime() - birthDate.getTime();
          const totalMonths = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)); // 30.44 hari dalam 1 bulan rata-rata  
          const years = Math.floor(totalMonths / 12);
          const months = years * 12;
        
          setAge(years);
          setAgeInMonth(totalMonths);

          let Fu = 0;
            if (years >= 70) {
                Fu = 0.2;
            } else if (years >= 60) {
                Fu = 0.1;
            } else if (years > 40) {
                Fu = 0.05;
            } else {
                Fu = 0;
            }
            setFaktorUsia(Fu);                   
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
        if (!weight) {
          setErrors(prev => ({ ...prev, weight: 'Berat Badan harus berupa angka' }));
          valid = false;
        }
        if (!height) {
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
          navigation.navigate("Hasil Perhitungan Anak Remaja", {name, gender, weight, height, age: (ageInMonth), ageInYears: age});
        }
      };
      
        const hitungProtein = (metode: string, dataInput: number, weight: number, TEE: number) => {
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
      
        const hitungLemak = (persenLemak: number, TEE: number) => {
          let lemakGram = 0;
          let lemakKkal = 0;
        
          if (!isNaN(persenLemak)) {
            lemakKkal = TEE * (persenLemak / 100);
            lemakGram = lemakKkal / 9;
          }
        
          return {lemakKkal, lemakGram};
        }
      
        useEffect(() => {
          const { lemakGram, lemakKkal } = hitungLemak(persenLemak, TEE);
          setLemakGram(lemakGram);
          setLemakKkal(lemakKkal);
        }, [persenLemak, TEE]);
      
        const hitungKarbohidrat = (metodeKarbo: string, TEE:number, proteinKkal:number, lemakKkal:number, persenKarbo:number) => {
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

        const nutrisiKehamilan: Record<string, { E: number; P: number; L: number; KH: number }> = {
          "0": { E: 0, P: 0, L: 0, KH: 0 },
          "1": { E: 300, P: 1, L: 2.3, KH: 25 },
          "2": { E: 300, P: 10, L: 2.3, KH: 40 },
          "3": { E: 300, P: 30, L: 2.3, KH: 40 },
          "4": { E: 330, P: 20, L: 2.2, KH: 45 },
          "5": { E: 400, P: 15, L: 2.2, KH: 55 }
        };

        const pilihanOedema: Record<string, { value: number;}> = {
          "0": { value: 0 },
          "1": { value: 1 },
          "2": { value: 5 },
          "3": { value: 10 },
        };

        const pilihanFaktorAktivitas: Record<string, { value: number;}> = {
          "0": { value: 1.1 },
          "1": { value: 1.2 },
          "2": { value: 1.3 },
          "3": { value: 1.4 },
          "4": { value: 1.5 },

        };
        const pilihanFaktorStress: Record<string, { value: number;}> = {
          "0": { value: 1 },
          "1": { value: 1.1 },
          "2": { value: 1.2 },
          "3": { value: 1.3 },
          "4": { value: 1.4 },

        };

        const pilihanAsites: Record<string, { value: number;}> = {
          "0": { value: 0 },
          "1": { value: 2.2 },
          "2": { value: 6 },
          "3": { value: 14 },
        };

        useEffect(() => {
          if (weight !== null) {
            const koreksi =
              weight - (pilihanOedema[oedema].value + pilihanAsites[asites].value);
            setBbKoreksi(parseFloat(koreksi.toFixed(3))); // Batas 3 angka di belakang koma
          }
        }, [weight, oedema, asites]);

        

        const bbFinal = selectedBB === "0" ? weight 
              : selectedBB === "1" ? bbi 
              : selectedBB === "2" ? bbAdj 
              : 0;

// ✅ Tambahkan debugging
        console.log("bbFinal Calculation:", { selectedBB, weight, bbi, bbAdj, bbFinal });

        const calculateBMR = (bbFinal: number, height: number, age: number, gender: string) => {
          console.log("Calculating BMR with:", { bbFinal, height, age, gender });

          if (!bbFinal || !height || !age || !gender) {
            console.log("Invalid input, returning default BMR: 0");
            return 0;
          }

          let bmr = gender === "Laki Laki" ? bbFinal * 30 : bbFinal * 25;

          console.log("Calculated BMR:", bmr);
          return bmr;
        };

        const calculateTEE = (
          BMR: number, 
          pilihanFaktorAktivitas: number, 
          pilihanFaktorStress: number, 
          gender: string, 
          ketHamil: string, 
          klasifikasiIMT: string,
          faktorBB: number,
          faktorUsia: number // ✅ Tambahkan faktorBB sebagai parameter
        ) => {
          console.log("Calculating TEE with:", {
            BMR, pilihanFaktorAktivitas, faktorUsia,pilihanFaktorStress, gender, ketHamil, klasifikasiIMT, faktorBB
          });

          if (!BMR || !pilihanFaktorAktivitas || !pilihanFaktorStress) {
            console.log("Invalid input, returning default TEE: 0");
            return 0;
          }

          let faktorBBNumber = Number(faktorBB) > 1 ? Number(faktorBB) / 100 : Number(faktorBB);
          let faktorBBOperator = 0;

          if (klasifikasiIMT === "BB Kurang") {
            faktorBBOperator = +(faktorBBNumber * BMR);
          } else if (klasifikasiIMT === "BB Lebih") {
            faktorBBOperator = -(faktorBBNumber * BMR);
          }

          let TEE = (BMR * pilihanFaktorAktivitas * pilihanFaktorStress) - (faktorUsia * BMR) + faktorBBOperator;

          if (gender === "Perempuan" && nutrisiKehamilan[ketHamil]) {
            TEE += nutrisiKehamilan[ketHamil].E;
          }

          
          console.log("TEE Breakdown:", {
            step1: BMR * pilihanFaktorAktivitas * pilihanFaktorStress,
            step2: faktorUsia * BMR,
            step3: faktorBBOperator,
            final: (BMR * pilihanFaktorAktivitas * pilihanFaktorStress) - (faktorUsia * BMR) + faktorBBOperator
          });
          console.log("Returning TEE:", TEE);
          return TEE;
        };

        useEffect(() => {
          console.log("Weight:", weight, "Height:", height, "Age:", age, "Gender:", gender, "Method:", method);

          if (!weight || !height || !age || !gender) {
            console.log("Invalid input detected, skipping BMR calculation.");
            return;
          }

          const newBMR = calculateBMR(bbFinal, height, age, gender);
          setBMR(newBMR);

          const faktorAktivitasValue = pilihanFaktorAktivitas[faktorAktivitas]?.value || 1;
          const faktorStressValue = pilihanFaktorStress[faktorStress]?.value || 1;

          setTEE(calculateTEE(newBMR, faktorAktivitasValue, faktorStressValue, gender, Number(ketHamil), klasifikasiIMT, Number(faktorBB), faktorUsia));
        }, [weight, height, age, gender, method, faktorAktivitas, faktorStress, ketHamil, klasifikasiIMT, faktorBB]);

              const getStatusKEK = (gender: string, lila: number) => {
          if (gender === "Laki-Laki") return "-";
          if (gender === "Perempuan" && lila < 23.5) return "KEK";
          return "Tidak KEK";
        };

        useEffect(() => {
          setStatusKEK(getStatusKEK(gender, lila)); // Jika lila null, di-set ke 0
        }, [gender, lila]);

        const hitungBBI = (gender: string, height: number): number => {
          if (gender === "Laki Laki") {
            return height >= 160 ? 0.9 * (height - 100) : height - 100;
          } else if (gender === "Perempuan") {
            return height >= 150 ? 0.9 * (height - 100) : height - 100;
          }
        
          // 🔹 Default ke BB biasa jika gender tidak sesuai
          return height - 100; 
        };
        useEffect(() => {
          if (gender && height) {
            const hasilBBI = hitungBBI(gender, height);
            setBBI(hasilBBI);
          }
        }, [gender, height]);

        useEffect(() => {
          console.log("🚀 useEffect triggered!");
          console.log("✅ bbi (raw):", bbi);
          console.log("✅ weight (raw):", weight);
          console.log("✅ oedema (selected):", oedema);
          console.log("✅ asites (selected):", asites);
        
          if (bbi && weight) {
            const BBI = bbi;
            const oedemaValue = pilihanOedema[oedema]?.value || 0;
            const asitesValue = pilihanAsites[asites]?.value || 0;
            const BB_AKTUAL = weight - (oedemaValue + asitesValue);
        
            console.log("📌 BBI (parsed):", BBI);
            console.log("📌 Oedema Value:", oedemaValue);
            console.log("📌 Asites Value:", asitesValue);
            console.log("📌 BB_AKTUAL (after correction):", BB_AKTUAL);
        
            let rumus = "";
            let BB_ADJ = BB_AKTUAL;
        
            if (BB_AKTUAL >= BBI * 1.25 && BB_AKTUAL < BBI * 1.3) {
              rumus = "RUMUS 1";
              BB_ADJ = ((BB_AKTUAL - BBI) * 0.25) + BBI;
            } else if (BB_AKTUAL >= BBI * 1.3) {
              rumus = "RUMUS 2";
              BB_ADJ = ((BB_AKTUAL - BBI) * 0.5) + BBI;
            }
        
            console.log("📌 Selected Rumus:", rumus);
            console.log("📌 BB_ADJ (calculated):", BB_ADJ);
        
            setSelectedRumus(rumus);
            setBbAdj(parseFloat(BB_ADJ.toFixed(2)));
          } else {
            console.log("❌ Missing bbi or weight, resetting values...");
            setSelectedRumus("");
            setBbAdj("0");
          }
        }, [bbi, weight, oedema, asites]);

        const classifyIMT = (imtvalue: number) => {
          if (imtvalue < 18.5) return "BB Kurang";
          if (imtvalue >= 18.5 && imtvalue <= 22.9) return "BB Normal";
          return "BB Lebih";
      };
      
      const calculateIMT = (weight: number, height: number) => {
          const w = parseFloat(weight);
          const h = parseFloat(height) / 100; // Konversi tinggi dari cm ke meter
      
          console.log("Weight:", w, "Height (m):", h); // Debugging
      
          if (w > 0 && h > 0) {
              const imtValue = w / (h * h);
              console.log("IMT Value:", imtValue); // Debugging
      
              const classification = classifyIMT(imtValue);
              
              setIMT(imtValue.toFixed(2));
              setKlasifikasiIMT(classification);
          } else {
              setIMT(null);
              setKlasifikasiIMT('');
              setSliderValue(0);
          }
      };
      
        
    return (
        <Box>
            <Box width="100%" h={120} bg={"#23b160"} flexDirection="row" justifyContent="space-between">
                <Box width={"35%"}>
                <Image 
                    source={require("../../assets/math.png")} 
                    alt="Pantau Tumbuh Kembang Anak Secara Berkala" 
                    width={160} 
                    height={140} 
                    ml={"$2"}
                />
                </Box>
                <Box width={"65%"} mx={"$2"}>
                <Text fontSize={"$lg"} m={"$4"}  fontWeight={"$bold"} color={"white"}>Kalkulator Status Gizi</Text>
                <Text fontSize={"$sm"} m={"$4"} mt={"-$2"} color={"white"}>Hitung Data Pengukuran Status Gizi Anda di sini Bersama PojokGizi Indonesia.</Text>
                </Box>
            </Box>
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} bg="white">
                <Box>
            {/* Nama Pengukuran */}
                    <Box marginBottom={"$2"} my={"$2"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                        Nama Lengkap
                        </Text>
                        <Input padding={"$2"} width="100%" backgroundColor="white"  >
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
                            <Input   width="100%" backgroundColor="gray.100" isReadOnly>
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
                            <Input   width="100%" backgroundColor="gray.100" isReadOnly>
                            <InputSlot pl="$3">
                                <Ionicons name="calendar-outline" size={20} color="gray.600" />
                            </InputSlot>
                            <Text my={"$2"} mx={"$3"}>{formattedDate(measurementDate)}</Text>
                            </Input>
                        </Pressable>
                        {errors.measurementDate ? <Text color="red" fontSize="$sm">{errors.measurementDate}</Text> : null}
                        </Box>
                    </HStack>
                    <HStack>
                    <Box marginBottom={4} ml={"-$0.5"} mr={"$1"} width="50%" my={"$4"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                        Usia (Tahun)
                        </Text>
                        <Input   isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                        <Text>{age} Tahun</Text>
                        </Input>
                    </Box>
                    <Box marginBottom={4} width="50%" my={"$4"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                        Faktor Usia
                        </Text>
                        <Input   isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                        <Text>{faktorUsia * 100} %</Text>
                        </Input>
                    </Box>
                    </HStack>
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
                    <HStack justifyContent="space-between" mb={"$2"}>
                        <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Berat Badan (kg)
                        </Text>
                        <Input   padding={"$2"} width="100%" backgroundColor="gray.100">
                            <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                            setWeight(text);
                            calculateIMT(text, height);
                            }} />
                        </Input>
                        {errors.weight ? <Text color="red" fontSize="$sm">{errors.weight}</Text> : null}
                        </Box>
                        <Box marginBottom={4} my={"$4"} width="50%">
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Tinggi Badan (cm)
                        </Text>
                        <Input   width="100%" padding={"$2"} backgroundColor="gray.100">
                            <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                            setHeight(text);
                            calculateIMT(weight, text);
                            }} />
                        </Input>
                        {errors.height ? <Text color="red" fontSize="$sm">{errors.height}</Text> : null}
                        </Box>
                    </HStack>
                    <HStack>
                    <Box marginBottom={4} width="50%" my={"$4"} ml={"-$0.5"} mr={"$1"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                        IMT
                        </Text>
                        <Input   isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                        <Text>{IMT}</Text>
                        </Input>
                    </Box>
                    <Box marginBottom={4} width="50%" my={"$4"}>
                        <Text mt={38} fontWeight="$bold" ml={'$2'}>{klasifikasiIMT}</Text>
                    </Box>
                    </HStack>
                    {klasifikasiIMT !== "BB Normal" && (
                      <Box marginBottom={4} my={"$4"} flex={1}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          Faktor BB
                        </Text>
                        <Input   padding={"$2"} width="100%" backgroundColor="gray.100">
                          <InputField 
                            keyboardType="numeric" 
                            placeholder="Enter Text here" 
                            onChangeText={text => setFaktorBB(text)} 
                          />
                        </Input>
                        {errors.weight ? <Text color="red" fontSize="$sm">{errors.weight}</Text> : null}
                      </Box>
                    )}
                    <VStack justifyContent="space-between" gap={"$2"} mb={"$1"}>
                      <HStack gap={4}>
                        <Box marginBottom={4} my={"$4"} flex={1}  >
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            LiLA (cm)
                        </Text>
                        <Input   padding={"$2"} width="100%" backgroundColor="gray.100">
                            <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                            setLila(text);
                            }} />
                        </Input>
                        {errors.weight ? <Text color="red" fontSize="$sm">{errors.weight}</Text> : null}
                        </Box>
                        <Box marginBottom={4} my={"$4"} flex={1}  >
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            T. Lutut (cm)
                        </Text>
                        <Input   padding={"$2"} width="100%" backgroundColor="gray.100">
                            <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                            setTinggiLutut(text);
                            }} />
                        </Input>
                        {errors.weight ? <Text color="red" fontSize="$sm">{errors.weight}</Text> : null}
                        </Box>
                        <Box marginBottom={4} my={"$4"} flex={1} >
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            P.Ulna (cm)
                        </Text>
                        <Input   padding={"$2"} width="100%" backgroundColor="gray.100">
                            <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                            setPanjangUlna(text);
                            }} />
                        </Input>
                        {errors.weight ? <Text color="red" fontSize="$sm">{errors.weight}</Text> : null}
                        </Box>
                      </HStack>
                      
                    </VStack>
                    {/* <HStack justifyContent="space-between" mb={"$2"}>
                        <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Faktor Aktivitas
                        </Text>
                        <Input   padding={"$2"} width="100%" backgroundColor="gray.100">
                            <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                            setFaktorAktivitas(text);
                            }} />
                        </Input>
                        {errors.weight ? <Text color="red" fontSize="$sm">{errors.weight}</Text> : null}
                        </Box>
                        <Box marginBottom={4} my={"$4"} width="50%">
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Faktor Stress
                        </Text>
                        <Input   width="100%" padding={"$2"} backgroundColor="gray.100">
                            <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => {
                            setFaktorStress(text);
                            }} />
                        </Input>
                        {errors.height ? <Text color="red" fontSize="$sm">{errors.height}</Text> : null}
                        </Box>
                    </HStack> */}
                    <Box width={"100%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          Faktor Aktivitas
                        </Text>
                        <Select selectedValue={String(faktorAktivitas)} onValueChange={(value) => setFaktorAktivitas(value)}>
                          <SelectTrigger   variant="underlined" size="md">
                            <SelectInput placeholder="Pilih Kondisi" mx="$3" />
                            <SelectIcon>
                              <Icon as={ChevronDownIcon} />
                            </SelectIcon>
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                              <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                              </SelectDragIndicatorWrapper>
                              <SelectItem label="Tidak Ada / Istirahat" value="0" />
                              <SelectItem label="Aktivitas ringan: pegawai kantor, guru, ibu rumah tangga" value="1" />
                              <SelectItem label="Aktivitas sedang: pegawai industri ringan, mahasiswa, militer yang sedang tidak berperang" value="2" />
                              <SelectItem label="Aktivitas berat: petani, buruh, atlet, militer dalam keadaaan latihan" value="3" />
                              <SelectItem label="Aktivitas sangat berat: tukang becak, tukang gali dst" value="4" />
                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      </Box>
                      <Box width={"100%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          Faktor Stress
                        </Text>
                        <Select selectedValue={String(faktorStress)} onValueChange={(value) => setFaktorStress(value)}>
                          <SelectTrigger   variant="underlined" size="md">
                            <SelectInput placeholder="Pilih Kondisi" mx="$3" />
                            <SelectIcon>
                              <Icon as={ChevronDownIcon} />
                            </SelectIcon>
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                              <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                              </SelectDragIndicatorWrapper>
                              <SelectItem label="Tidak Ada" value="0" />
                              <SelectItem label="Ringan" value="1" />
                              <SelectItem label="Sedang" value="2" />
                              <SelectItem label="Berat" value="3" />
                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      </Box>
                    <Box width={"100%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          Oedema
                        </Text>
                        <Select selectedValue={String(oedema)} onValueChange={(value) => setOedema(value)}>
                          <SelectTrigger   variant="underlined" size="md">
                            <SelectInput placeholder="Pilih Kondisi" mx="$3" />
                            <SelectIcon>
                              <Icon as={ChevronDownIcon} />
                            </SelectIcon>
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                              <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                              </SelectDragIndicatorWrapper>
                              <SelectItem label="Tidak Gejala Oederma" value="0" />
                              <SelectItem label="Kedua pergelangan tangan atau kaki" value="1" />
                              <SelectItem label="Kedua kaki, tangan, lengan bawah, dan tungkai bawah" value="2" />
                              <SelectItem label="Edema pitting bilateral menyeluruh, meliputi kedua tungkai, lengan, kaki, dan wajah" value="3" />
                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      </Box>
                      <Box width={"100%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          Asites
                        </Text>
                        <Select selectedValue={asites} onValueChange={(value) => setAsites(value)}>
                          <SelectTrigger   variant="underlined" size="md">
                            <SelectInput placeholder="Pilih Kondisi" mx="$3" />
                            <SelectIcon >
                              <Icon as={ChevronDownIcon} />
                            </SelectIcon>
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                              <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                              </SelectDragIndicatorWrapper>
                              <SelectItem label="Tidak Gejala Asites" value="0" />
                              <SelectItem label="Asites hanya dapat dideteksi dengan pemeriksaan USG" value="1" />
                              <SelectItem label="Asites menyebabkan distensi perut simetris sedang" value="2" />
                              <SelectItem label="Asites menyebabkan distensi perut yang nyata" value="3" />
                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      </Box>
                      <Box width={"100%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          BB Koreksi Oedema & Asites (kg)
                        </Text>
                        <Input
                          variant="outline"
                          borderRadius={0}
                           
                          isDisabled
                        >
                          <InputField textAlign="center" value={bbKoreksi !== null ? bbKoreksi.toFixed(2) : "-"} />
                        </Input>
                      </Box>
                      <Box width={"100%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          BBI (Berat Badan Ideal) (kg)
                        </Text>
                        <Input
                          variant="outline"
                          borderRadius={0}
                           
                          isDisabled
                        >
                          <InputField textAlign="center" value={bbi !== null ? bbi.toFixed(2) : "-"} />
                        </Input>
                      </Box>
                      <Box width={"100%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          BB ADJ (kg)
                        </Text>
                        <Input
                          variant="outline"
                          borderRadius={0}
                           
                          isDisabled
                        >
                          <InputField textAlign="center" value={bbAdj} />
                        </Input>
                      </Box>
                    <Box my={"$1"} flexDirection="row">
                    {gender === 'Perempuan' && (
                      <Box width={"40%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          Ibu Hamil/Menyusui
                        </Text>
                        <Select mr="$3" selectedValue={String(ketHamil)} onValueChange={(value) => setKetHamil(value)}>
                          <SelectTrigger   variant="underlined" size="md">
                            <SelectInput placeholder="Pilih Kondisi" mx="$3" />
                            <SelectIcon >
                              <Icon as={ChevronDownIcon} />
                            </SelectIcon>
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                              <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                              </SelectDragIndicatorWrapper>
                              <SelectItem label="Tidak Hamil / Menyusui" value="0" />
                              <SelectItem label="Trimester 1" value="1" />
                              <SelectItem label="Trimester 2" value="2" />
                              <SelectItem label="Trimester 3" value="3" />
                              <SelectItem label="Ibu Menyusui 6 Bulan Pertama" value="4" />
                              <SelectItem label="Ibu Menyusui 6 Bulan Kedua Dst" value="5" />
                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      </Box>
                    )}
                    {gender === 'Perempuan' &&  (
                    <Box width={"60%"} px={"$2"}>
                      <HStack mt={"$4"} space="md" width="100%" gap={3} alignItems="center">
                        <Box flex={1} alignItems="center">
                          <Text fontSize="$sm" color="gray.500">+E</Text>
                          <Input variant="outline" borderRadius={0}  >
                            <InputField fontSize="$xs" textAlign="center" placeholder="-" value={nutrisiKehamilan[ketHamil].E.toString()|| "-"}/>
                          </Input>
                        </Box>
                        <Box flex={1} alignItems="center">
                          <Text fontSize="$sm" color="gray.500">+P</Text>
                          <Input variant="outline" borderRadius={0}  >
                            <InputField fontSize="$xs" textAlign="center" placeholder="-" value={nutrisiKehamilan[ketHamil].P.toString()|| "-"} />
                          </Input>
                        </Box>
                        <Box flex={1} alignItems="center">
                          <Text fontSize="$sm" color="gray.500">+L</Text>
                          <Input variant="outline" borderRadius={0}  >
                            <InputField fontSize="$xs" textAlign="center" placeholder="-" value={nutrisiKehamilan[ketHamil].L.toString()|| "-"}/>
                          </Input>
                        </Box>
                        <Box flex={1} alignItems="center">
                          <Text fontSize="$sm" color="gray.500">+KH</Text>
                          <Input variant="outline" borderRadius={0}  >
                            <InputField fontSize="$xs" textAlign="center" placeholder="-" value={nutrisiKehamilan[ketHamil].KH.toString()|| "-"}/>
                          </Input>
                        </Box>
                      </HStack>
                    </Box>
                    )}
                    </Box>
                    
                    {gender === 'Perempuan' && (
                      <HStack justifyContent="space-between" mb={"$2"}>
                        <Box marginBottom={4} my={"$5"} width={"30%"} ml={"$0.5"} mr={"$1"}>
                          <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Status KEK :
                          </Text>
                        </Box>
                        <Box marginBottom={4} my={"$3"} flex={1}>
                          <Input variant="outline" isDisabled={true}   width="100%" padding={"$2"} backgroundColor="gray.100">
                            <InputField placeholder="Status KEK" value={statusKEK}/>
                          </Input>
                        </Box>
                      </HStack>
                    )}
                    {/* BB yang digunakan */}
                    <Box my={"$1"} flexDirection="row">
                      <Box width={"50%"} my={"$3"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          BB yang digunakan
                        </Text>
                        <Select
                          selectedValue={selectedBB}
                          onValueChange={(value) => {
                            console.log("📌 Selected BB Changed:", value);
                            setSelectedBB(value);
                          }}
                        >
                          <SelectTrigger   variant="underlined" size="md">
                            <SelectInput placeholder="Pilih BB" mx="$3" isDisabled={selectedBB === '0'} />
                            <SelectIcon mr="$3">
                              <Icon as={ChevronDownIcon} />
                            </SelectIcon>
                          </SelectTrigger>
                          <SelectPortal>
                            <SelectBackdrop />
                            <SelectContent>
                              <SelectItem label="BB Aktual" value="0" />
                              <SelectItem label="BB Ideal" value="1" />
                              <SelectItem label="BB Adjusted" value="2" />
                              <SelectItem label="BB Koreksi Oedema Asites" value="3" />

                            </SelectContent>
                          </SelectPortal>
                        </Select>
                      </Box>
                      <Box width={"50%"} my={"$3"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                          Nilai BB Aktual
                        </Text>
                        <Input variant="outline" isDisabled={true}   width="100%" padding={"$2"} backgroundColor="gray.100">
                            <InputField value={
                              selectedBB === "0" ? weight : 
                              selectedBB === "1" ? bbi.toFixed(2) : 
                              selectedBB === "2" ? bbAdj :
                              selectedBB === "3" ? bbKoreksi.toFixed(2) : 
                              "0"
                            } />
                          </Input>
                      </Box>
                    </Box>
                    <Box mb={"$48"}>
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
        
                                <Box>
                                <HStack justifyContent="space-between" mb={"$4"}>
                                    <Box marginBottom={4} my={"$4"} width="50%" ml={"-$0.5"} mr={"$1"}>
                                    <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                        BMR
                                    </Text>
                                    <Input   isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                                    <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                        {BMR.toFixed(2)}
                                    </Text>
                                    </Input>
                                    </Box>
                                    <Box marginBottom={4} my={"$4"} width="50%">
                                    <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                        TEE
                                    </Text>
                                    <Input   isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
                                    <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                        {TEE.toFixed(2)}
                                    </Text>
                                    </Input>
                                    </Box>
                                </HStack>
                                </Box>              
                            
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
                            
                                <Box mb={"$4"}>
                                <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                    {metode === "gram protein" ? "Gram Protein" : "Persentase Protein"}
                                </Text>
                                <Box flexDirection="row">
                                    <Input   padding="$2" width="85%" backgroundColor="gray.100">
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
                                    <Input   isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                                        <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                        {proteinGram.toFixed(2)}
                                        </Text>
                                    </Input>
                                    </Box>
                                    <Box marginBottom={4} my={"$4"} width="50%">
                                    <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                        Protein (kkal)
                                    </Text>
                                    <Input   isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
                                        <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                        {proteinKkal.toFixed(2)}
                                        </Text>
                                    </Input>
                                    </Box>
                                </HStack>
                                </Box>
                            
                            </Box>
                            
                            {/* Kebutuhan Lemak */}
                            <Box ml="$4" minWidth="$8" borderRadius="$sm" alignSelf="flex-start" px="$4" h="$8" justifyContent="center" bg="#F98D3A">
                            <Text color="white" fontSize="$sm" fontWeight="$bold">Kebutuhan Lemak</Text>
                            </Box>
                            <Box mx="$4" my={"$4"}>               
                            
                                <Box mb={"$4"}>
                                <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                    Persentase Lemak
                                </Text>
                                <Box flexDirection="row">
                                    <Input   padding="$2" width="85%" backgroundColor="gray.100">
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
                                    <Input   isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                                        <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                        {lemakGram.toFixed(2)}
                                        </Text>
                                    </Input>
                                    </Box>
                                    <Box marginBottom={4} my={"$4"} width="50%">
                                    <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                        Lemak (kkal)
                                    </Text>
                                    <Input   isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
                                        <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                        {lemakKkal.toFixed(2)}
                                        </Text>
                                    </Input>
                                    </Box>
                                </HStack>
                                </Box>
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
                            
                                <Box mb={"$4"}>
                                <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                    {metodeKarbo === "sisa" ? "Sisa dari Kebutuhan Lemak dan Protein" : "Persentase TEE"}
                                </Text>
                                {metodeKarbo === "persentase" && (
                                    <Input   padding="$2" width="100%" backgroundColor="gray.100">
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
                                    <Input   isDisabled={true} padding={"$2"} width="100%" backgroundColor="gray.100">
                                        <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                        {karboGram.toFixed(2)}
                                        </Text>
                                    </Input>
                                    </Box>
                                    <Box marginBottom={4} my={"$4"} width="50%">
                                    <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                        Karbohidrat (kkal)
                                    </Text>
                                    <Input   isDisabled={true} width="100%" padding={"$2"} backgroundColor="gray.100">
                                        <Text fontSize="$md" fontWeight="$bold" color="red.600">
                                        {karboKkal.toFixed(2)}
                                        </Text>
                                    </Input>
                                    </Box>
                                </HStack>
                                </Box>
                            
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
                py={2}
                height={60}
                mb="-$2"
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
}

export default PasienDM;