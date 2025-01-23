import { Box, Button, HStack, Text, VStack, Image} from "@gluestack-ui/themed";
import { ScrollView, Pressable } from "@gluestack-ui/themed";
import Header from "../components/header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";



const features = [
    { id: "1", name: "Cek BMI Ideal", icon: require("../assets/bmi.png")},
    { id: "2", name: "Latihan Soal",  icon: require("../assets/tryouticon.png") },
    { id: "3", name: "Tryout Gizi",  icon: require("../assets/calendar.png") },
    { id: "4", name: "Rumus Gizi",  icon: require("../assets/search.png") },

];

interface Calculator {
    AntroCalc:  string;
}
const Home = () => {
    const navigation = useNavigation();

    return (
        <Box h={"$full"}>
            <Header />
            <ScrollView bg={"#cbf5df"}>
                <Box bg="#23b160" h={150}>
                    <HStack mt={"$5"} mx={"$4"} justifyContent="space-between">
                        <VStack>
                            <Text fontSize={"$md"} fontWeight={"$bold"} color={"white"}>Mari Bersama Ketahui,</Text>
                            <Text fontSize={"$md"} fontWeight={"$bold"} color={"white"}>Status Kesehatan Gizi Anda</Text>
                            <Text fontSize={"$md"} fontWeight={"$bold"} color={"white"}>Bersama Pojok Gizi Indonesia</Text>
                        </VStack>
                        <Image source={require("../assets/report.png")} alt="report" style={{width: 150, height: 130}}/>
                    </HStack>
                </Box>
                {/* Section 1 Antropometri Calculator */}
                <Box mx={12} mt={"-$10"}>
                    <Box width={"$full"} borderRadius={5} h={80} bg={"white"} softShadow="1" >
                        <HStack justifyContent="space-between" mx={"$4"}>
                            <Box ml={"$1"} rounded="full" alignItems="center" justifyContent="center">
                                <Image source={require("../assets/iconbmi.png")} alt="iconbmi" style={{width: 40, height: 40}}/>
                            </Box>
                            <VStack my={"$4"} ml={"-$12"}>
                                <Text fontSize="$md" fontWeight="$bold">Antropometri Calculator</Text>
                                <Text fontSize="$sm">Perhitungan Status Gizi</Text>
                            </VStack>
                            <Pressable alignSelf="center" onPress={() => navigation.navigate("Pengukuran Status Gizi")}>
                            <Ionicons  size={30} name="arrow-forward-outline"></Ionicons>
                            </Pressable>
                        </HStack>
                    </Box>
                </Box>

                {/* Section 2 Monitoring Status Gizi */}
                <Box mx={12} my={"$5"} borderRadius={5}>
                    <Text mb={"$3"} ml={"$1"} fontSize={"$md"} fontWeight={"$bold"}>Monitoring Status Gizi</Text>
                    <Box width={"$full"} borderRadius={5} h={165} bg={"#23b160"} flexDirection={"row"}>
                        <Box width={"$1/3"} borderRadius={5} h={"$full"} bg={"#23b160"}>
                        <Image source={require("../assets/baby-weight.png")} alt="Pantau Tumbuh Kembang Anak Secara Berkala" width={"100%"} mx={"$2"} style={{ height: 150}} my={"$2"} ml={"$3"}/>
                        </Box>
                        <Box width={"$2/3"} borderRadius={5} h={"$full"} bg={"#23b160"} p={"$4"} >
                            <Box width={"$full"} h={"$full"}>
                                <Text color={"white"} fontSize={"$md"} fontWeight={"$bold"}>Pantau Tumbuh Kembang Anak Secara Berkala</Text>
                                <Text color={"white"} my={"$2"} fontSize={"$xs"}>Monitoring Status Gizi Bersama PojokGizi Indonesia</Text>
                                <Button bg={"#efad4d"}>
                                    <Text color={"white"} fontWeight={"$semibold"} fontSize={"$md"}>Tambah Data</Text>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Section 3 Fitur Fitur Lain */}
                <Box mx={12} >
                    <Text mb={"$3"} ml={"$1"} fontSize={"$md"} fontWeight={"$bold"}>Fitur Lainnya</Text>
                    <HStack flex={1} justifyContent="space-around" gap={"$2"}>
                        {features &&
                            features.map((item) => (
                                <Pressable key={item.id} onPress={() => alert(item.name)} $pressed-backgroundColor="$blue.100">
                                    <Box bg="white" borderRadius={5} p={"$4"} alignItems="center" justifyContent="center" flex={1} width={80}>
                                        <Box
                                            width={50}
                                            height={20}
                                            bg="blue.100"
                                            rounded="full"
                                            alignItems="center"
                                            justifyContent="center"
                                            my={"$2"}
                                            mb={"$4"}
                                        >
                                        <Image
                                        source={item.icon} // Mengambil ikon langsung dari array features
                                        style={{ width: 30, height: 30 }}
                                        alt={`Ikon fitur ${item.name}`}                                        />
                                        </Box>
                                        <Text fontSize="$xs" flexWrap="wrap" maxWidth={85} textAlign="center">
                                            {item.name}
                                        </Text>
                                    </Box>
                                </Pressable>
                            ))}
                    </HStack>
                </Box>

                {/* Section 4 Deteksi Dini Kesehatan Gizi*/}
                <Box mx={12} my={"$5"} borderRadius={5}>
                    <Text mb={"$3"} ml={"$1"} fontSize={"$md"} fontWeight={"$bold"}>Deteksi Dini Kesehatan Gizi </Text>
                    <Box width={"$full"} borderRadius={5} h={160} p={"$4"} bg={"#23b160"} flexDirection={"row"}>
                        
                        <Box width={"$2/3"} borderRadius={5} h={"$full"} bg={"#23b160"} mr={"$2"}>
                            <Box width={"$full"} h={"$full"} >
                                <Text color={"white"} fontSize={"$md"} fontWeight={"$bold"}>Saat Ini Anda Mengalami Masalah Kesehatan Gizi?</Text>
                                <Text color={"white"} my={"$2"} fontSize={"$xs"}>Deteksi Sekarang Bersama PojokGizi Indonesia</Text>
                                <Button bg={"#efad4d"} alignSelf="flex-start">
                                    <Text color={"white"} fontWeight={"$semibold"} fontSize={"$md"}>Periksa Sekarang</Text>
                                </Button>
                            </Box>
                        </Box>
                        <Box width={"$1/3"} borderRadius={5} h={"$full"} bg={"#23b160"} >
                            <Image source={require("../assets/insurance.png")} alt="Deteksi Dini Kesehatan Gizi" width={180} my={"-$3"} mx={"-$3"} style={{ height: 160}} />
                        </Box>
                    </Box>
                </Box>
                
                {/* Section 5 Kumpulan Artikel */}
                <Box mx={12}  mb={"$10"}>
                    <Text mb={"$3"} fontSize={"$md"} fontWeight={"$bold"}>
                        Artikel Terbaru
                    </Text>
                    {/* Box di bawah diganti dengan image */}
                    <Box
                        borderRadius="$lg"
                        overflow="hidden"
                        bg="white"
                        width={"100%"}
                    >
                        {/* Gambar menggantikan Box */}
                        <Image
                            
                            source={require('../assets/berita1.jpg')} // Path gambar lokal
                            alt="Artikel Image"
                            style={{
                                height: 200,
                                width: "100%",
                            }}
                            resizeMode="cover"  // Agar gambar tidak terdistorsi
                        />
                        
                        {/* Gradien tetap di atas gambar */}
                        <LinearGradient
                            colors={["rgba(0,128,0,0.8)", "rgba(0,128,0,0)"]}
                            start={{ x: 0, y: 0.5 }} // Mulai dari bawah
                            end={{ x: 0, y: 0 }} 
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: 80,
                                zIndex: 1,
                            }}
                        >
                            <Box p="$4" my="-$8">
                                <Text color="white" p="$2" bg="#efad4d" alignSelf="flex-start" borderRadius="$md" fontSize="$xs" fontWeight="bold" mb="$2">
                                    Stunting
                                </Text>
                                <Text color="white" fontSize="$md" fontWeight="bold">
                                    Resep MPASI: Bubur Ubi Jalar Kembung nfasjlfnajsf faslkfnasj
                                </Text>
                            </Box>
                        </LinearGradient>
                    </Box>
                </Box>

            </ScrollView>
        </Box>
    );
};

export default Home;
