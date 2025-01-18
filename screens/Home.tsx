import { Box, Button, HStack, Text, VStack } from "@gluestack-ui/themed";
import { ScrollView, Pressable } from "@gluestack-ui/themed";
import Header from "../components/header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "react-native-linear-gradient";

const features = [
    { id: "1", name: "Cek BMI Ideal Test", icon: "calculator-outline" },
    { id: "2", name: "Informasi Tryout",  icon: "calculator-outline" },
    { id: "3", name: "Cek Status Kesehatan",  icon: "calculator-outline" },
];

const Home = () => {
    return (
        <Box h={"$full"}>
            <Header />
            <ScrollView bg="#cbf5df">
                <Box bg="#23b160" h={150}>
                    <HStack mt={"$5"} mx={"$4"}>
                        <VStack>
                            <Text fontSize={"$md"} fontWeight={"$bold"} color={"white"}>Mari Bersama Ketahui,</Text>
                            <Text fontSize={"$md"} fontWeight={"$bold"} color={"white"}>Status Kesehatan Gizi Anda</Text>
                            <Text fontSize={"$md"} fontWeight={"$bold"} color={"white"}>Bersama Pojok Gizi Indonesia</Text>
                        </VStack>
                    </HStack>
                </Box>
                <Box mx={12} mt={"-$10"}>
                    <Box width={"$full"} borderRadius={5} h={80} bg={"white"} shadow={"$3"}>
                        <HStack justifyContent="space-between" mx={"$4"}>
                            <Box ml={"$1"} rounded="full" alignItems="center" justifyContent="center">
                                <Ionicons size={40} name="calculator-outline"></Ionicons>
                            </Box>
                            <VStack my={"$4"} ml={"-$12"}>
                                <Text fontSize="$md" fontWeight="$bold">Antropometri Calculator</Text>
                                <Text fontSize="$sm">Perhitungan Status Gizi</Text>
                            </VStack>
                            <Ionicons alignSelf="center" size={30} name="arrow-forward-outline"></Ionicons>
                        </HStack>
                    </Box>
                </Box>
                <Box mx={12} my={"$5"} borderRadius={5}>
                    <Text mb={"$3"} ml={"$1"} fontSize={"$md"} fontWeight={"$bold"}>Monitoring Status Gizi</Text>
                    <Box width={"$full"} borderRadius={5} h={165} bg={"#23b160"} flexDirection={"row"}>
                        <Box width={"$1/3"} borderRadius={5} h={"$full"} bg={"#23b160"}></Box>
                        <Box width={"$2/3"} borderRadius={5} h={"$full"} bg={"#23b160"} p={"$4"}>
                            <Box width={"$full"} h={"$full"}>
                                <Text color={"white"} fontSize={"$md"} fontWeight={"$bold"}>Pantau Tumbuh Kembang Anak Secara Berkala</Text>
                                <Text color={"white"} my={"$2"} fontSize={"$xs"}>Monitoring Status Gizi Bersama PojokGizi Indonesia</Text>
                                <Button bg={"white"}>
                                    <Text color={"gray"} fontWeight={"$semibold"} fontSize={"$md"}>Tambah Data</Text>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box mx={12} >
                    <Text mb={"$3"} ml={"$1"} fontSize={"$md"} fontWeight={"$bold"}>Fitur Lainnya</Text>
                    <HStack flex={1} justifyContent="space-around" gap={"$2"}>
                        {features &&
                            features.map((item) => (
                                <Pressable key={item.id} onPress={() => alert(item.name)} $pressed-backgroundColor="$blue.100">
                                    <Box
                                        bg="white"
                                        borderRadius={10}
                                        shadow={"$3"}
                                        p={"$4"}
                                        alignItems="center"
                                        justifyContent="center"
                                        flex={1}
                                        
                                        
                                    >
                                        <Box
                                            width={50}
                                            height={50}
                                            bg="blue.100"
                                            rounded="full"
                                            alignItems="center"
                                            justifyContent="center"
                                            mb={"$3"}
                                        >
                                            {item.icon && <Ionicons size={30} name={item.icon}></Ionicons>}
                                        </Box>
                                        <Text fontSize="$xs" width={"$24"} flexWrap="wrap" maxWidth={80} textAlign="center">
                                            {item.name}
                                        </Text>
                                    </Box>
                                </Pressable>
                            ))}
                    </HStack>
                </Box>


                <Box mx={12} mt={"$5"} mb={"$64"}>
                    <Box width={"$full"} borderRadius={5} h={80} bg={"white"} shadow={"$3"}>
                        <Box width={"$full"} h={100} bg={"#23b160"}></Box>
                        <LinearGradient
                            colors={["#23b160", "transparent"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{ width: "100%", height: 100, borderRadius: 5 }}
                        />
                        <Box flexDirection="row" bg="white" justifyContent="space-between" >
                            <Box>
                                <VStack my={"$4"} mx={"$4"}>
                                    <Text fontSize="$md" fontWeight="$bold">Cek Dini Kesehatan Status GiziMu</Text>
                                    <Text fontSize="$sm">Deteksi Status Gizi dengan Indikator</Text>
                                </VStack>
                            </Box>
                            <Box mr={"$4"} alignSelf="center">
                            <Ionicons alignSelf="center" size={30} name="arrow-forward-outline"></Ionicons>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default Home;
