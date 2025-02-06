import { ScrollView, Box, Text, Image,Input, InputField,RadioGroup, RadioIndicator, RadioLabel, RadioIcon, CircleIcon,Radio, HStack } from "@gluestack-ui/themed";
import { useState } from "react";

const Bmi = () => {
    const [umur, setUmur] = useState("");
    const [gender, setGender] = useState("");
    const [tinggiBadan, setTinggiBadan] = useState("");
    const [beratBadan, setBeratBadan] = useState("");

    return (
        <Box>
        <Box width="100%" h={120} bg={"#23b160"} flexDirection="row" justifyContent="space-between">
                <Box width={"$48"} >
                    <Image 
                    source={require("../assets/math.png")} 
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
        <ScrollView>
            <Box>
                <Box bg="white" borderRadius="md" p="$4">
                    <Box flexDirection="row" my="$2">
                        <Text>Umur :</Text>
                        <Input
                            flex={1}
                            value={umur}
                            onChangeText={(text) => setUmur(text)}
                        >
                        <InputField type="text" />
                        </Input>                    
                    </Box>
                    <Box flexDirection="row" my="$2">
                        <Text>Gender :</Text>
                        <RadioGroup value={gender} onChange={setGender}>
                        <HStack space="2xl">
                            <Radio value="Credit Card">
                            <RadioIndicator mr="$2">
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Laki - Laki</RadioLabel>
                            </Radio>
                            <Radio value="Cash On Delivery">
                            <RadioIndicator mr="$2">
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Perempuan</RadioLabel>
                            </Radio>
                        </HStack>
                        </RadioGroup>
                    </Box>
                    <Box flexDirection="row" my="$2">
                        <Text>Tinggi Badan :</Text>
                        <Input
                            flex={1}
                            value={tinggiBadan}
                            onChangeText={(text) => setTinggiBadan(text)}
                            keyboardType="numeric"
                        >
                            <InputField type="text" />
                        </Input>   
                    </Box>
                    <Box flexDirection="row" my="$2">
                        <Text>Berat Badan :</Text>
                        <Input
                            flex={1}
                            value={beratBadan}
                            onChangeText={(text) => setBeratBadan(text)}
                            keyboardType="numeric"
                        >
                            <InputField type="text" />
                        </Input>   
                    </Box>
                </Box>
            </Box>
        </ScrollView>
        </Box>
    );
}

export default Bmi;