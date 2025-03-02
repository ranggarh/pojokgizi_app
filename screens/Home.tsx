import { Box, Button, HStack, Text, VStack, Image, Avatar } from "@gluestack-ui/themed";
import { ScrollView, Pressable } from "@gluestack-ui/themed";
import Header from "../components/header";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";
import * as Font from 'expo-font';
import { PanResponder } from 'react-native';
import { Actionsheet, ActionsheetItem, ActionsheetContent, ActionsheetItemText, ActionsheetBackdrop, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper } from '@gluestack-ui/themed';
import GrowthChart from "../components/grafik";

const features = [
    { id: "1", name: "Dewasa Maternal", icon: require("../assets/bmi.png") },
    { id: "2", name: "Dewasa Kritis", icon: require("../assets/tryouticon.png") },
    { id: "3", name: "Penyakit Ginjal", icon: require("../assets/calendar.png") },
    { id: "4", name: "Dewasa Luka Bakar", icon: require("../assets/search.png") },
    { id: "5", name: "Pasien DM", icon: require("../assets/search.png") },
    { id: "6", name: "Rumus Gizi", icon: require("../assets/search.png") },
];

const tutorialSteps = [
    {
        title: "Langkah 1",
        description: "Tambahkan Nama Pengukuran Terlebih Dahulu.",
        image: require("../assets/report.png"),
    },
    {
        title: "Langkah 2",
        description: "Klik Icon Kalkulator.",
        image: require("../assets/diet.png"),
    },
    {
        title: "Langkah 3",
        description: "Input Data Pengukuran Status Gizi.",
        image: require("../assets/report.png"),
    },
];

const articles = [
    {
        id: "1",
        title: "Resep MPASI: Bubur Ubi Jalar Kembung",
        image: require('../assets/berita1.jpg'),
        category: "Stunting",
    },
    {
        id: "2",
        title: "Manfaat Sayuran untuk Kesehatan",
        image: require('../assets/berita1.jpg'), // Ganti dengan gambar yang sesuai
        category: "Kesehatan",
    },
    {
        id: "3",
        title: "Tips Menjaga Kesehatan Gizi Anak",
        image: require('../assets/berita1.jpg'), // Ganti dengan gambar yang sesuai
        category: "Gizi",
    },
    {
        id: "4",
        title: "Pentingnya Nutrisi Seimbang",
        image: require('../assets/berita1.jpg'), // Ganti dengan gambar yang sesuai
        category: "Nutrisi",
    },
];

const Home = () => {
    const navigation = useNavigation();
    const [showActionsheet, setShowActionsheet] = useState(false);
    const handleClose = () => setShowActionsheet(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Load fonts in useEffect
    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'inter-bold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
                'inter-medium': require('../assets/fonts/Inter_18pt-Medium.ttf'),
                'inter-semibold': require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
                'inter-regular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
            });
            setFontsLoaded(true);
        };

        loadFonts();
    }, []);

    // Close Actionsheet on navigation
    useFocusEffect(
        useCallback(() => {
            const unsubscribe = navigation.addListener('blur', () => {
                handleClose();
            });

            return unsubscribe;
        }, [navigation])
    );

    const navigationTo = (screen: string) => {
        handleClose(); // Close Actionsheet before navigating
        navigation.navigate(screen);
    };

    const handleSwipe = (direction) => {
        if (direction === 'left' && currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else if (direction === 'right' && currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else if (currentStep === tutorialSteps.length - 1) {
            handleClose(); // Close the Actionsheet if it's the last step
        }
    };

    // PanResponder for swipe gestures
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return Math.abs(gestureState.dx) > 20; // Threshold for swipe
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx > 50) {
                handleSwipe('right'); // Swipe right
            } else if (gestureState.dx < -50) {
                handleSwipe('left'); // Swipe left
            }
        },
    });


    return (
        <Box h={"$full"}>
            <Header />
            <ScrollView bg={"white"} >
                {/* Section 2 Monitoring Status Gizi */}
                <Box mx={12} my={"$5"} mt={"$5"} borderRadius={5}>
                    <Box flexDirection={"row"} mb={"$1"}>
                        <Box width={"$1"} h={22} bg={"#23b160"}></Box>
                        <Text mb={"$3"} ml={"$2"} fontSize={"$sm"} fontFamily={"inter-bold"} >Monitoring Status Gizi</Text>
                    </Box>
                    <Box width={"$full"} borderRadius={5} h={180} bg={"#23b160"} flexDirection={"row"}>
                        <Box width={"$1/3"} borderRadius={5} h={"$full"} bg={"#23b160"}>
                            <Image source={require("../assets/baby-weight.png")} alt="Pantau Tumbuh Kembang Anak Secara Berkala" width={"100%"} mx={"$2"} style={{ height: 150 }} my={"$2"} ml={"$3"} />
                        </Box>
                        <Box width={"$2/3"} borderRadius={5} h={"$full"} bg={"#23b160"} p={"$4"}>
                            <Box width={"$full"} h={"$full"}>
                                <Text color={"white"} fontSize={"$md"} fontFamily={"inter-bold"}>Pantau Tumbuh Kembang Anak Secara Berkala</Text>
                                <Text color={"white"} fontFamily="inter-regular" my={"$1"} mb={"$3"} fontSize={"$xs"}>Monitoring Status Gizi Bersama PojokGizi Indonesia</Text>
                                <Button bg={"#efad4d"}>
                                    <Text fontFamily={"inter-bold"} color={"white"} fontWeight={"$semibold"} fontSize={"$md"}>Tambah Data</Text>
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* <Box bg={"#3D8D7A"}>
                    <HStack m={"$4"}>
                        <Box ml={"$1"} my={"$4"} w={"$2/3"}>
                            <Text color={"white"} fontFamily={"inter-bold"}>Selamat Datang, Pogizens</Text>
                            <Text  color={"white"} fontSize={"$sm"}>Jaga kesehatan gizi anda, Bersama Pojok Gizi Indonesia</Text>
                        </Box>
                        <Box w={"$1/3"}>
                            <Image source={require("../assets/baby-weight.png")} alt="Pantau Tumbuh Kembang Anak Secara Berkala" mx={"$2"} style={{ height: 100, width: 190 }} mr={"$2"} />
                        </Box>
                        
                        
                    </HStack>
                </Box> */}

                <Box  bg={"#cbf5df"}>
                    <Box flexDirection={"row"} mt={"$4"} mx={"$4"}>
                        <Box width={"$1"} h={22} bg={"#14b454"}></Box>
                        <Text ml={"$2"} fontSize={"$sm"} color="$black" fontFamily={"inter-bold"} >Perhitungan Status Gizi</Text>
                    </Box>                         
                    <ScrollView mx={"$3"} mb={"$2"} mt={"$2"} ml={"$4"} horizontal showsHorizontalScrollIndicator={false}>
                        <HStack flex={1} justifyContent="space-around" borderRadius={5} gap={"$2"}>
                            {features &&
                                features.map((item) => (
                                    <Pressable key={item.id} onPress={() => navigation.navigate(item.name)}>
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
                                                    source={item.icon}
                                                    style={{ width: 30, height: 30 }}
                                                    alt={`Ikon fitur ${item.name}`}
                                                />
                                            </Box>
                                            <Text fontSize="$2xs" flexWrap="wrap" maxWidth={85} textAlign="center" fontFamily="inter-semibold">
                                                {item.name}
                                            </Text>
                                        </Box>
                                    </Pressable>
                                ))}
                        </HStack>
                    </ScrollView>
    
                </Box>

                {/* Section 3 Fitur Fitur Lain */}
                {/* <Box mx={12}>
                    
                </Box> */}
                

                {/* <Box mx={12}>
                    <Box flexDirection={"row"} mb={"$1"}>
                        <Box width={"$1"} h={24} bg={"#23b160"}></Box>
                        <Text mb={"$3"} ml={"$2"} fontSize={"$md"} fontFamily={"inter-bold"}>Deteksi Dini Kesehatan Gizi</Text>
                    </Box>
                    <Box width={"$full"} borderRadius={5} h={80} bg={"white"} softShadow="1">
                        <HStack justifyContent="space-between" mx={"$4"}>
                            <Box ml={"$1"} rounded="full" alignItems="center" justifyContent="center">
                                <Image source={require("../assets/iconbmi.png")} alt="iconbmi" style={{ width: 40, height: 40 }} />
                            </Box>
                            <VStack my={"$4"} ml={"-$12"}>
                                <Text fontSize="$md" fontWeight="$bold">Antropometri Calculator</Text>
                                <Text fontSize="$sm">Perhitungan Status Gizi</Text>
                            </VStack>
                            <Pressable alignSelf="center" onPress={() => setShowActionsheet(true)}>
                                <Ionicons size={30} name="arrow-forward-outline"></Ionicons>
                            </Pressable>
                        </HStack>
                    </Box>
                </Box> */}

                <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
                    <ActionsheetBackdrop />
                    <ActionsheetContent h="$72" zIndex={999}>
                        <ActionsheetDragIndicatorWrapper>
                            <ActionsheetDragIndicator />
                        </ActionsheetDragIndicatorWrapper>
                        <VStack p={4} alignItems="center" {...panResponder.panHandlers}>
                            <Text fontSize="$lg" fontWeight="$bold">{tutorialSteps[currentStep].title}</Text>
                            <Image source={tutorialSteps[currentStep].image} alt="Tutorial Image" style={{ width: 200, height: 200, marginTop: 10 }} />
                            <Text mt={2}>{tutorialSteps[currentStep].description}</Text>
                            <HStack mt={4}>
                                {tutorialSteps.map((_, index) => (
                                    <Box
                                        key={index}
                                        width={"$4"}
                                        height={"$1"}
                                        borderRadius="full"
                                        bg={index === currentStep ? "#23b160" : "#efad4d"}
                                        mx={1}
                                    />
                                ))}
                            </HStack>
                        </VStack>
                        <ActionsheetItem onPress={() => navigationTo("Pengukuran Status Gizi")}>
                            <ActionsheetItemText textAlign="center" fontWeight="$bold" w={"$full"} bg="#23b160" color="white" py={"$4"}>Lewati</ActionsheetItemText>
                        </ActionsheetItem>
                    </ActionsheetContent>
                </Actionsheet>

                {/* <Box bg={"#cbf5df"}>
                    <Box mx={12} my={"$6"}>
                        <HStack mx={"$4"} ml={"$1"} gap={"$3"}>
                            <Button onPress={()=> setShowActionsheet(true)} borderRadius={10} w={"$1/2"} h={"$16"} bg={"white"}>
                                <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                                <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Cek Kalori</Text>
                            </Button>
                            <Button borderRadius={10} w={"$1/2"} h={"$16"} bg={"white"} >
                            <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                            <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Tryout Gizi</Text>
                            </Button>
                        </HStack>
                        <HStack mt={"$3"} mx={"$4"} ml={"$1"} gap={"$3"}>
                            <Button borderRadius={10} w={"$1/2"} h={"$16"} bg={"white"} >
                            <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                            <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Rumus Gizi</Text>
                            </Button>
                            <Button borderRadius={10} w={"$1/2"} h={"$16"} bg={"white"} >
                            <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                            <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Latihan Soal</Text>
                            </Button>
                        </HStack>                
                    </Box>

                </Box> */}
                
                {/* <Box bg={"#cbf5df"}>
                <Box flexDirection={"row"} mt={"$4"} mx={"$4"}>
                        <Box width={"$1"} h={22} bg={"#14b454"}></Box>
                        <Text ml={"$2"} fontSize={"$sm"} color="black" fontFamily={"inter-bold"}>Perhitungan Kebutuhan Gizi</Text>
                </Box>
                    <Box mx={12} my={"$6"} gap={"$1"} >
                            <Button justifyContent="flex-start" onPress={()=> setShowActionsheet(true)} borderRadius={5} w={"$full"} h={"$16"} bg={"white"}>
                                <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                                <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Cek Kalori</Text>
                            </Button>
                            <Button justifyContent="flex-start" onPress={()=> setShowActionsheet(true)} borderRadius={5} w={"$full"} h={"$16"} bg={"white"}>
                                <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                                <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Cek Kalori</Text>
                            </Button>
                            <Button justifyContent="flex-start" onPress={()=> setShowActionsheet(true)} borderRadius={5} w={"$full"} h={"$16"} bg={"white"}>
                                <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                                <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Cek Kalori</Text>
                            </Button>
                            <Button justifyContent="flex-start" onPress={()=> setShowActionsheet(true)} borderRadius={5} w={"$full"} h={"$16"} bg={"white"}>
                                <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                                <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Cek Kalori</Text>
                            </Button>            
                    </Box>
                </Box> */}
                

                {/* Section 4 Deteksi Dini Kesehatan Gizi*/}
                <Box mx={12} my={"$5"} borderRadius={5}>
                    <Box flexDirection={"row"} mb={"$1"}>
                        <Box width={"$1"} h={24} bg={"#23b160"}></Box>
                        <Text mb={"$3"} ml={"$2"} fontSize={"$md"} fontFamily={"inter-bold"}>Deteksi Dini Kesehatan Gizi</Text>
                    </Box>                    
                    <Box width={"$full"} gap={"$2"} borderRadius={5} h={200} p={"$4"} bg={"#23b160"} flexDirection={"row"}>
                        <Box width={"$2/3"} mx borderRadius={5} h={"$full"} bg={"#23b160"} mr={"$2"}>
                            <Box width={"$full"}  h={"$full"}>
                                <Text color={"white"} fontSize={"$sm"} fontFamily={"inter-bold"}>Saat Ini Anda Mengalami Masalah Kesehatan Gizi?</Text>
                                <Pressable  onPress={() => navigation.navigate("Gizi Balita")} p={"$1"} mt={"$2"} ml={"-$1"} h={"$16"} >
                                    <Box  bg="white" flexDirection="row" alignItems="center" px={"$4"} borderRadius={5} h={"$full"} w={"$full"}>
                                        <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                                        <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Gizi Balita</Text>
                                    </Box>
                                </Pressable>
                                <Pressable  onPress={() => navigation.navigate("Gizi Anak Sekolah")} p={"$1"} h={"$16"} ml={"-$1"}>
                                    <Box  bg="white" flexDirection="row" alignItems="center" px={"$4"} borderRadius={5} h={"$full"} w={"$full"}>
                                        <Image source={require("../assets/tryouticon.png")} alt="iconbmi" style={{ width: 30, height: 30 }} />
                                        <Text mx={"$2"} fontFamily={"inter-bold"} color={"black"} fontWeight={"$semibold"} fontSize={"$xs"}>Gizi Anak Sekolah</Text>
                                    </Box>
                                </Pressable>
                            </Box>
                        </Box>
                        <Box width={"$1/3"} borderRadius={5} h={"$full"} bg={"#23b160"}>
                            <Image source={require("../assets/insurance.png")} alt="Deteksi Dini Kesehatan Gizi" width={180} my={"-$3"} mx={"-$3"} style={{ height: 160 }} />
                        </Box>
                    </Box>
                </Box>

                {/* Section 5 Kumpulan Artikel */}
                <Box mx={12} mt={"$5"} mb={"$10"}>
                    <Box flexDirection={"row"} mb={"$1"}>
                        <Box width={"$1"} h={24} bg={"#23b160"}></Box>
                        <Text mb={"$3"} ml={"$2"} fontSize={"$md"} fontFamily="inter-bold">Artikel Terbaru</Text>
                    </Box>  
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack gap={"$2"}>
                            {articles.map((article) => (
                                <Box
                                    key={article.id}
                                    borderRadius="$lg"
                                    overflow="hidden"
                                    bg="white"
                                    width={"$64"}
                                    height={"$48"}
                                >
                                    <Image
                                        source={article.image}
                                        alt="Artikel Image"
                                        style={{
                                            height: 200,
                                            width: "100%",
                                        }}
                                        resizeMode="cover"
                                    />
                                    <LinearGradient
                                        colors={["rgba(0,128,0,0.8)", "rgba(0,128,0,0)"]}
                                        start={{ x: 0, y: 0.5 }}
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
                                                {article.category}
                                            </Text>
                                            <Text color="white" fontSize="$md" fontWeight="bold">
                                                {article.title}
                                            </Text>
                                        </Box>
                                    </LinearGradient>
                                </Box>
                            ))}
                        </HStack>
                    </ScrollView>
                </Box>
            </ScrollView>
        </Box>
    );
};

export default Home;