import { Avatar, HStack, Pressable, Text } from "@gluestack-ui/themed";
import { ScrollView, Box } from "@gluestack-ui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import GrowthChart from "./chart/whoChart";
import { useState } from 'react';

// const userDataPoint = {
//     month: 4,
//     weight: 6.8
// };
const DataCard = ({ icon, label, value, unit, bgColor, onPress }: any) => {
    return (
        <Pressable
            width={100}
            bg={bgColor}
            height={100}
            p="$4"
            borderRadius="$lg"
            alignItems="center" onPress={onPress}>
            <FontAwesome5 name={icon} size={24} color="black" />
            <Text color="$gray600" fontSize="$sm" mt="$2">
                {label}
            </Text>
            <Text fontSize="$sm" fontWeight="$bold">
                {value} <Text fontSize="$sm" color="$gray500">{unit}</Text>
            </Text>

        </Pressable>
    );
};
const HasilMonitoring = () => {
    const [activeChartType, setActiveChartType] = useState('weight-for-age');

    return (
        <ScrollView >
            <Box bgColor="white" p="$5" softShadow="2" mb="$1">
                <HStack flex={1} mb={-26} alignItems="center" justifyContent="space-between" space="sm">
                    <Pressable onPress={() => setActiveChartType('weight-for-age')}>
                        <Box>
                            <Text fontSize="$sm" fontWeight="$bold">Berat Badan</Text>
                        </Box>
                        <Box
                            h="$1"
                            mt="$4"
                            bgColor={activeChartType === 'weight-for-age' ? "$blue500" : "transparent"}
                            width="100%"
                        />
                    </Pressable>

                    <Pressable onPress={() => setActiveChartType('height-for-age')}>
                        <Box>
                            <Text fontSize="$sm" fontWeight="$bold">Tinggi Badan</Text>
                        </Box>
                        <Box
                            h="$1"
                            mt="$4"
                            bgColor={activeChartType === 'height-for-age' ? "$blue500" : "transparent"}
                            width="100%"
                        />
                    </Pressable>

                    <Pressable onPress={() => setActiveChartType('head-circumference-for-age')}>
                        <Box>
                            <Text fontSize="$sm" fontWeight="$bold">Lingkar Kepala</Text>
                        </Box>
                        <Box
                            h="$1"
                            mt="$4"
                            bgColor={activeChartType === 'head-circumference-for-age' ? "$blue500" : "transparent"}
                            width="100%"
                        />
                    </Pressable>
                </HStack>
            </Box>
            <Box>
                <Box minHeight={350} width="100%" flex={1} bgColor="$white">
                    <GrowthChart
                        userDataPoint={{
                            month: 2,
                            weight: 9.2,
                            height: 70.5,  // Tambahkan tinggi
                            headCircumference: 44.8,  // Tambahkan lingkar kepala
                            bmi: 18.5  // Opsional, tambahkan BMI jika perlu
                        }}
                        gender="girls"
                        activeChartType={activeChartType}
                    />
                </Box>
                <Box mt={"$4"} borderRadius={20} bg="white" hardShadow="5" p="$4">
                    <HStack flex={1} justifyContent="space-evenly" alignItems="center" space="sm">
                        <DataCard icon="weight" label="Berat" value="4" unit="kg" bgColor="#cbf3f0" onPress={() => setActiveChartType('weight-for-age')} />
                        <DataCard icon="ruler" label="Tinggi" value="15" unit="cm" bgColor="#cbf3f0" onPress={() => setActiveChartType('height-for-age')} />
                        <DataCard icon="eye" label="L. Kepala" value="20" unit="cm" bgColor="#cbf3f0" onPress={() => setActiveChartType('head-circumference-for-age')} />
                    </HStack>
                    <Box mx="$2">
                        <Box flexDirection="row" justifyContent="space-between" alignItems="center" mt="$4">
                            <Text>Hasil Pengukuran :</Text>
                            <Box m="$2" bgColor="#23b160" p="$2" borderRadius="$lg">
                                <Text fontSize="$sm" fontWeight={"$semibold"} color="white">Berat Badan Normal</Text>
                            </Box>
                        </Box>
                        <Box>
                            <Text fontSize="$sm" my={"$8"}>Berat badan pengukuran anak anda menyatakan normal, dapat dilihat dari kurva grafik diatas bahwa data berat anak anda berada di range berat badan normal</Text>

                            <Box bgColor="#23b160" p="$4" borderRadius="$lg">
                                <Text fontSize="$sm" color="white" fontWeight={"$bold"}>Rekomendasi Tumbuh Kembang Anak Usia 0-6 Bulan</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ScrollView>
    )
}

export default HasilMonitoring;