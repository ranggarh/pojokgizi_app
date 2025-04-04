import React, { useState, useRef } from "react";
import { ScrollView, TouchableOpacity, TextInput, View, Animated, Dimensions } from "react-native";
import { Box, Text, VStack, HStack, Input, InputField } from "@gluestack-ui/themed";

const KomposisiMakanan = () => {
    // Dummy data for food items
    const foodItems = [
        {
            id: 1,
            title: "Bubur Ikan Teri",
            category: "B",
            calories: 120,
            protein: 8.5,
            fat: 3.2,
            carbs: 15.0,
            description: "Bubur dengan tambahan ikan teri yang kaya protein dan kalsium, cocok untuk sarapan."
        },
        {
            id: 2,
            title: "Bubur Udang",
            category: "B",
            calories: 150,
            protein: 10.2,
            fat: 4.5,
            carbs: 16.8,
            description: "Bubur dengan udang segar yang kaya omega-3 dan protein hewani berkualitas tinggi."
        },
        {
            id: 3,
            title: "Bubur Ayam dan Telur",
            category: "B",
            calories: 200,
            protein: 12.5,
            fat: 7.8,
            carbs: 19.3,
            description: "Kombinasi bubur dengan ayam cincang dan telur, kaya protein dan nutrisi esensial."
        },
        {
            id: 4,
            title: "Bubur Ayam dan Tahu",
            category: "B",
            calories: 180,
            protein: 11.5,
            fat: 5.2,
            carbs: 22.6,
            description: "Bubur dengan potongan ayam dan tahu, seimbang protein hewani dan nabati."
        },
        {
            id: 5,
            title: "Bubur Ayam Kacang Merah",
            category: "B",
            calories: 220,
            protein: 13.5,
            fat: 6.3,
            carbs: 25.8,
            description: "Bubur ayam dengan tambahan kacang merah yang kaya serat dan protein nabati."
        },
    ];

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [filteredItems, setFilteredItems] = useState(foodItems);
    const [name, setName] = useState("");
    const [expandedNutrition, setExpandedNutrition] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
    const drawerWidth = screenWidth * 0.85; // Sedikit lebih kecil untuk memastikan tidak full screen
    // PENTING: Gunakan transformX untuk animasi yang kompatibel dengan useNativeDriver
    const translateX = useRef(new Animated.Value(drawerWidth)).current;

    const openDrawer = () => {
        setIsDrawerOpen(true);
        // Animasi drawer dari kanan ke kiri
        Animated.timing(translateX, {
            toValue: 0,
            duration: 600, // Durasi yang lebih lama untuk open drawer
            useNativeDriver: true, // Menggunakan false agar animasi berfungsi untuk posisi dan ukuran
        }).start();
    };

    const closeDrawer = () => {
        // Animasi drawer dari kiri ke kanan (keluar dari layar)
        Animated.timing(translateX, {
            toValue: drawerWidth,
            duration: 300, // Durasi lebih cepat untuk close drawer
            useNativeDriver: true, // Menggunakan false agar konsisten dengan openDrawer
        }).start(() => {
            setIsDrawerOpen(false);
        });
    };

    // Handle search
    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text) {
            const filtered = foodItems.filter(
                item => item.title.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredItems(filtered);
        } else {
            setFilteredItems(foodItems);
        }
    };

    // Handle item selection - add to selected foods
    const handleSelectFood = (food) => {
        // Check if food is already selected to avoid duplicates
        if (!selectedFoods.some(item => item.id === food.id)) {
            setSelectedFoods([...selectedFoods, food]);
        }
    };

    // Handle item removal
    const handleRemoveFood = (foodId) => {
        setSelectedFoods(selectedFoods.filter(food => food.id !== foodId));
    };

    // Calculate total nutritional values
    const calculateTotalNutrition = () => {
        return selectedFoods.reduce((totals, food) => {
            return {
                calories: totals.calories + food.calories,
                protein: totals.protein + food.protein,
                fat: totals.fat + food.fat,
                carbs: totals.carbs + food.carbs
            };
        }, {
            calories: 0,
            protein: 0, 
            fat: 0, 
            carbs: 0
        });
    };

    const totalNutrition = calculateTotalNutrition();

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView
                nestedScrollEnabled={true}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Box bg="white" borderTopLeftRadius={20} borderTopRightRadius={20} style={{ flex: 1 }}>
                    <Box mx={12} my="$5" borderRadius={5}>
                        <Box marginBottom="$2" my="$2">
                            <Text fontSize="$md" fontWeight="$semibold" marginBottom="$2" color="gray.600">
                                Mau Makan Apa Hari Ini?
                            </Text>
                            <HStack space="sm" alignItems="center">
                                <Input
                                    variant="underlined"
                                    padding="$2"
                                    width="85%"
                                    backgroundColor="white"
                                    // borderColor="#F98D3A"
                                >
                                    <InputField
                                        placeholder="Saya Mau Makan Nasi Goreng Spesial"
                                        onChangeText={(text) => setName(text)}
                                    />
                                </Input>
                                <TouchableOpacity
                                    onPress={openDrawer}
                                    style={{
                                        backgroundColor: "#23b160",
                                        padding: 10,
                                        borderRadius: 5,
                                    }}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold" }}>Cari</Text>
                                </TouchableOpacity>
                            </HStack>
                        </Box>

                        {/* Nutrition Box */}
                        <Box width="$full" borderRadius={5} bg="#e6f7ef" p="$4" my="$3" shadow="$2">
                            <Text fontSize="$lg" fontFamily="inter-bold" mb="$2">
                                Nilai Komposisi Gizi
                            </Text>
                            <Text fontSize="$md" mb="$3" color="gray.600">
                                Menu: {name || "Makanan Pilihan Anda"}
                            </Text>

                            {/* Main nutrition values */}
                            <HStack justifyContent="space-between" mb="$3">
                                <Box bg="white" p="$2" borderRadius={8} width="23%">
                                    <Text fontFamily="inter-bold" fontSize="$md" textAlign="center">
                                        {totalNutrition.calories}
                                    </Text>
                                    <Text fontSize="$xs" textAlign="center">Kalori</Text>
                                </Box>
                                <Box bg="white" p="$2" borderRadius={8} width="23%">
                                    <Text fontFamily="inter-bold" fontSize="$md" textAlign="center">
                                        {totalNutrition.protein.toFixed(1)}g
                                    </Text>
                                    <Text fontSize="$xs" textAlign="center">Protein</Text>
                                </Box>
                                <Box bg="white" p="$2" borderRadius={8} width="23%">
                                    <Text fontFamily="inter-bold" fontSize="$md" textAlign="center">
                                        {totalNutrition.fat.toFixed(1)}g
                                    </Text>
                                    <Text fontSize="$xs" textAlign="center">Lemak</Text>
                                </Box>
                                <Box bg="white" p="$2" borderRadius={8} width="23%">
                                    <Text fontFamily="inter-bold" fontSize="$md" textAlign="center">
                                        {totalNutrition.carbs.toFixed(1)}g
                                    </Text>
                                    <Text fontSize="$xs" textAlign="center">Karbo</Text>
                                </Box>
                            </HStack>

                            {/* Accordion toggle */}
                            <TouchableOpacity onPress={() => setExpandedNutrition(!expandedNutrition)}>
                                <HStack alignItems="center" justifyContent="center" p="$2" bg="#23b160" borderRadius={8}>
                                    <Text fontFamily="inter-bold" color="white" fontSize="$sm" mr="$2">
                                        Detail Komposisi Gizi
                                    </Text>
                                    {/* {expandedNutrition ? <ChevronUp size={20} /> : <ChevronDown size={20} />} */}
                                </HStack>
                            </TouchableOpacity>

                            {/* Expanded nutrition details */}
                            {expandedNutrition && (
                                <Box mt="$3">
                                    {/* Minerals section example */}
                                    <Box mb="$3">
                                        <Text fontFamily="inter-bold" fontSize="$md" mb="$2">
                                            Mineral
                                        </Text>
                                        <VStack space="sm">
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Kalsium</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    120 mg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Fosfor</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    85 mg
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Box>

                                    {/* Vitamins section example */}
                                    <Box>
                                        <Text fontFamily="inter-bold" fontSize="$md" mb="$2">
                                            Vitamin
                                        </Text>
                                        <VStack space="sm">
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Vitamin A</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    60 mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Vitamin C</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    2.5 mg
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        <Box
                            width="$full"
                            borderRadius={5}
                            bg="#23b160"
                            flex={1}
                        >
                            {selectedFoods.length > 0 ? (
                                <ScrollView
                                    nestedScrollEnabled={true}
                                    contentContainerStyle={{ padding: 16 }}
                                    style={{ flex: 1 }}
                                >
                                    <VStack space="xs">
                                        {selectedFoods.map(food => (
                                            <Box key={food.id} bg="white" p="$2" borderRadius={5} mb="$2">
                                                <HStack justifyContent="space-between" alignItems="center" mx="$4" my="$2">
                                                    <Text fontFamily="inter-bold" fontSize="$sm">
                                                        {food.title}
                                                    </Text>
                                                    <HStack alignItems="center">
                                                        <Text fontFamily="inter-bold" fontSize="$sm" mr="$4">
                                                            {food.calories} Kalori
                                                        </Text>
                                                        <TouchableOpacity onPress={() => handleRemoveFood(food.id)}>
                                                            <Text fontSize="$lg" color="red">✕</Text>
                                                        </TouchableOpacity>
                                                    </HStack>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </ScrollView>
                            ) : (
                                <Box p="$4" flex={1} justifyContent="center" alignItems="center">
                                    <Text color="white" fontFamily="inter-bold">
                                        Pilih makanan untuk melihat detail
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </ScrollView>

            {/* Custom Drawer - Diperbaiki dengan Animasi yang Konsisten */}
            {isDrawerOpen && (
                <Animated.View
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: drawerWidth,
                        backgroundColor: "white",
                        transform: [{ translateX: translateX }],
                        height: screenHeight,
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        shadowColor: "#000",
                        shadowOffset: { width: -2, height: 0 },
                        shadowOpacity: 0.2,
                        shadowRadius: 5,
                        elevation: 5,
                        zIndex: 999, // Memastikan drawer di atas elemen lain
                    }}
                >
                    <View style={{ paddingTop: 20, flex: 1 }}>
                        <TouchableOpacity
                            onPress={closeDrawer}
                            style={{
                                alignSelf: "flex-end",
                                padding: 10,
                                marginRight: 20,
                            }}
                        >
                            <Text style={{ fontSize: 24, color: "red" }}>✕</Text>
                        </TouchableOpacity>

                        {/* Search Bar */}
                        <Box 
                            mx="$4" 
                            borderRadius={5} 
                            p="$2" 
                            bg="#e6f7ef" 
                            marginTop={5}
                            alignItems="center"
                        >
                            <HStack 
                                space="md" 
                                alignItems="center" 
                                bg="white" 
                                borderRadius={8} 
                                p="$2" 
                                width="90%"
                            >
                                <Text fontSize="$md" color="#888">🔍</Text>
                                <TextInput
                                    placeholder="Cari Resep..."
                                    style={{ flex: 1, height: 40 }}
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                />
                            </HStack>
                        </Box>

                        {/* Items List */}
                        <Box flex={1} mt="$4" px="$4">
                            <Text fontFamily="inter-bold" fontSize="$lg" mb="$2">
                                Pilih Makanan
                            </Text>
                            <ScrollView 
                                nestedScrollEnabled={true} 
                                style={{ flex: 1 }}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                <VStack space="sm">
                                    {filteredItems.map((item) => (
                                        <TouchableOpacity
                                            key={item.id}
                                            onPress={() => {
                                                handleSelectFood(item);
                                                
                                            }}
                                        >
                                            <Box
                                                p="$3"
                                                borderRadius={8}
                                                borderBottomWidth={1}
                                                borderBottomColor="#eee"
                                                mb="$2"
                                                bg={
                                                    selectedFoods.some((food) => food.id === item.id)
                                                        ? "#e6f7ef"
                                                        : "white"
                                                }
                                            >
                                                <Text fontSize="$md">{item.title}</Text>
                                                <Text fontSize="$xs" color="gray.500" mt="$1">
                                                    {item.calories} Kalori • {item.protein}g Protein
                                                </Text>
                                            </Box>
                                        </TouchableOpacity>
                                    ))}
                                </VStack>
                            </ScrollView>
                        </Box>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

export default KomposisiMakanan;