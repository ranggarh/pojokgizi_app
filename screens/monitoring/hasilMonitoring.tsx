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
            width="30%"
            bg={bgColor}
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
        <ScrollView bgColor="#cbf5df">
            <Box mx="$4" mt="$4" borderRadius={15} bgColor="white" p="$4">
                <HStack flex={1} alignItems="center" space="sm">
                    <Avatar size="lg" />
                    <Box>
                        <Text fontSize="$lg" fontWeight="$bold">Nama Anak</Text>
                        <Text fontSize="$sm" color="$gray600">Umur Anak</Text>
                    </Box>

                </HStack>
            </Box>
            <Box m="$4">
                <Box borderRadius={15} minHeight={350} width="100%" flex={1} bgColor="$white">
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
                <Box mt={"$4"} borderRadius={15} bgColor="white" p="$4">
                    <HStack flex={1} justifyContent="space-evenly" alignItems="center" space="sm">
                        <DataCard icon="weight" label="Berat" value="4" unit="kg" bgColor="$cyan200" onPress={() => setActiveChartType('weight-for-age')} />
                        <DataCard icon="ruler" label="Tinggi" value="15" unit="cm" bgColor="$red200" onPress={() => setActiveChartType('height-for-age')} />
                        <DataCard icon="eye" label="L. Kepala" value="20" unit="cm" bgColor="$orange200" onPress={() => setActiveChartType('head-circumference-for-age')} />
                    </HStack>
                    <Box mx="$2">
                        <Box flexDirection="row" justifyContent="space-between" alignItems="center" mt="$4">
                            <Text>Hasil Pengukuran :</Text>
                            <Box m="$2" bgColor="#cbf5df" p="$2" borderRadius="$lg">
                                <Text fontSize="$sm" fontWeight={"$semibold"}>Berat Badan Normal</Text>
                            </Box>
                        </Box>
                        <Box>
                            <Text fontSize="$sm" my={"$4"}>Berat badan pengukuran anak anda menyatakan normal, dapat dilihat dari kurva grafik diatas bahwa data berat anak anda berada di range berat badan normal</Text>

                            <Box bgColor="#cbf5df" p="$4" borderRadius="$lg">
                                <Text fontSize="$sm" fontWeight={"$bold"}>Rekomendasi Tumbuh Kembang Anak Usia 0-6 Bulan</Text>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ScrollView>
    )
}

export default HasilMonitoring;