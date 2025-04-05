import React, { useState, useRef, useEffect } from "react";
import { ScrollView, TouchableOpacity, TextInput, View, Animated, Dimensions, FlatList } from "react-native";
import { Box, Text, VStack, HStack, Input, InputField } from "@gluestack-ui/themed";
import { getMenuMakanan, MenuMakanan } from "../../utils/actions/menuMakananAct"; // Pastikan path ini benar

interface TotalNutrition {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    serat: number;
    natrium: number;
    kalsium: number;
    fosfor: number;
    seng: number;
    tembaga: number;
    retinol: number;
    riboflavin: number;
    niasin: number;
    thiamin: number;
    vitaminC: number; // Menggunakan vitaminC untuk konsistensi
    abu: number;
    air: number;
    besi: number;
    bkar: number;
}

const KomposisiMakanan = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFoods, setSelectedFoods] = useState<MenuMakanan[]>([]);
    const [filteredItems, setFilteredItems] = useState<MenuMakanan[]>([]);
    const [name, setName] = useState("");
    const [expandedNutrition, setExpandedNutrition] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
    const drawerWidth = screenWidth * 0.85;
    const translateX = useRef(new Animated.Value(drawerWidth)).current;

    useEffect(() => {
        const unsubscribe = getMenuMakanan((data: MenuMakanan[]) => {
            // console.log("Data yang diterima:", data); // Tambahkan log ini
            setFilteredItems(data);
        });

        return () => unsubscribe();
    }, []);

    const openDrawer = () => {
        setIsDrawerOpen(true);
        Animated.timing(translateX, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
        }).start();
    };

    const closeDrawer = () => {
        Animated.timing(translateX, {
            toValue: drawerWidth,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsDrawerOpen(false);
        });
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text) {
            const filtered = filteredItems.filter(
                item => item.nama.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredItems(filtered);
        } else {
            // Jika tidak ada query pencarian, reset ke data awal
            getMenuMakanan((data: MenuMakanan[]) => {
                setFilteredItems(data);
            });
        }
    };

    const handleSelectFood = (food) => {
        if (!selectedFoods.some(item => item.id === food.id)) {
            setSelectedFoods([...selectedFoods, food]);
        }
    };

    const handleRemoveFood = (foodId) => {
        setSelectedFoods(selectedFoods.filter(food => food.id !== foodId));
    };

    const calculateTotalNutrition = (): TotalNutrition => {
        return selectedFoods.reduce((totals, food) => {
            return {
                calories: totals.calories + parseFloat(food.energi),
                protein: totals.protein + parseFloat(food.protein),
                fat: totals.fat + parseFloat(food.lemak),
                carbs: totals.carbs + parseFloat(food.kh),
                serat: totals.serat + parseFloat(food.serat),
                natrium: totals.natrium + parseFloat(food.natrium),
                kalsium: totals.kalsium + parseFloat(food.kalsium),
                fosfor: totals.fosfor + parseFloat(food.fosfor),
                seng: totals.seng + parseFloat(food.seng),
                tembaga: totals.tembaga + parseFloat(food.tembaga),
                retinol: totals.retinol + parseFloat(food.retinol),
                riboflavin: totals.riboflavin + parseFloat(food.riboflavin),
                niasin: totals.niasin + parseFloat(food.niasin),
                thiamin: totals.thiamin + parseFloat(food.thiamin),
                vitaminC: totals.vitaminC + parseFloat(food.vit_c),
                abu: totals.abu + parseFloat(food.abu),
                air: totals.air + parseFloat(food.air),
                besi: totals.besi + parseFloat(food.besi),
                bkar: totals.bkar + parseFloat(food.bkar),

            };
        }, {
            calories: 0,
            protein: 0,
            fat: 0,
            carbs: 0,
            serat: 0,
            natrium: 0,
            kalsium: 0,
            fosfor: 0,
            seng: 0,
            tembaga: 0,
            retinol: 0,
            riboflavin: 0,
            niasin: 0,
            thiamin: 0,
            vit_c: 0,
            abu: 0,
            air: 0,
            besi: 0,
            bkar: 0,
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
                                </HStack>
                            </TouchableOpacity>

                            {/* Expanded nutrition details */}
                            {expandedNutrition && (
                                <Box mt="$3">
                                    {/* Minerals section example */}
                                    <Box mb="$3">
                                        <Text fontFamily="inter-bold" fontSize="$md" mb="$2">
                                            Makronutrien
                                        </Text>
                                        <VStack space="sm">
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Protein</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {totalNutrition.protein.toFixed(1)} g
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Lemak</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {totalNutrition.fat.toFixed(1)} g
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Serat</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.serat || 0).toFixed(1)} g
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
                                                <Text fontSize="$sm">Retinol</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.retinol || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Riboflavin</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.riboflavin || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Niasin</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.niasin || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Thiamin</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.thiamin || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Vitamin C</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.vit_c || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>

                                        </VStack>

                                    </Box>
                                    {/* Vitamins section example */}
                                    <Box mt="$3">
                                        <Text fontFamily="inter-bold" fontSize="$md" mb="$2">
                                            Mineral
                                        </Text>
                                        <VStack space="sm">
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Natrium</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.natrium || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Kalsium</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.kalsium || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Fosfor</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.fosfor || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Seng</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.seng || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Tembaga</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.tembaga || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>

                                        </VStack>

                                    </Box>
                                    <Box mt="$3">
                                        <Text fontFamily="inter-bold" fontSize="$md" mb="$2">
                                            Lainnya
                                        </Text>
                                        <VStack space="sm">
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Abu</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.abu || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Air</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.air || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Besi</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.besi || 0).toFixed(1)} mcg
                                                </Text>
                                            </HStack>
                                            <HStack justifyContent="space-between">
                                                <Text fontSize="$sm">Bkar</Text>
                                                <Text fontFamily="inter-bold" fontSize="$sm">
                                                    {(totalNutrition.bkar || 0).toFixed(1)} mcg
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
                                                        {food.nama}
                                                    </Text>
                                                    <HStack alignItems="center">
                                                        <Text fontFamily="inter-bold" fontSize="$sm" mr="$4">
                                                            {food.energi} Kalori
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

            {/* Custom Drawer */}
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
                        zIndex: 999,
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
                            <FlatList
                                data={filteredItems}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelectFood(item)}
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
                                            <Text fontSize="$md">{item.nama}</Text>
                                            <Text fontSize="$xs" color="gray.500" mt="$1">
                                                {item.energi} Kalori • {item.protein}g Protein
                                            </Text>
                                        </Box>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.id}
                                initialNumToRender={10} // Jumlah item yang dirender pada awal
                                maxToRenderPerBatch={10} // Jumlah item yang dirender dalam setiap batch
                                windowSize={5} // Jumlah item yang disimpan dalam memori
                            />
                        </Box>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

export default KomposisiMakanan;