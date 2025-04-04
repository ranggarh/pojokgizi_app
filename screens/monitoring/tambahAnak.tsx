import { Avatar, Box, Input, InputField, ScrollView, Icon, SelectPortal, ChevronDownIcon, Select, SelectDragIndicator, Pressable, SelectItem, SelectDragIndicatorWrapper, SelectTrigger, SelectInput, SelectIcon, SelectBackdrop, SelectContent, Text, VStack, RadioGroup, HStack, RadioIndicator, RadioIcon, RadioLabel, Radio, CircleIcon } from "@gluestack-ui/themed";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  "Hasil Monitoring": String;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Hasil Monitoring'>;


const TambahAnak = () => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [golDarah, setGolDarah] = useState("")

    const navigation = useNavigation<NavigationProps>();

    return (
        <Box>
            <ScrollView backgroundColor="white">
                <Box mx="$4" my="$6">
                    <Avatar alignSelf="center" justifyContent="center" />
                    <Box marginBottom={"$2"} my={"$2"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Nama Lengkap
                        </Text>
                        <Input variant="underlined" padding={"$2"} width="100%"  >
                            <InputField placeholder="Masukkan Nama Lengkap" onChangeText={text => setName(text)} />
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
                    </Box>
                    <VStack justifyContent="space-between" mb={"$2"}>
                        <Box marginBottom={4} my={"$4"} width="100%" ml={"-$0.5"} mr={"$1"}>
                            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                Berat Badan Saat Lahir (kg)
                            </Text>
                            <Input variant="underlined"   padding={"$2"} width="100%" backgroundColor="gray.100">
                                <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => setWeight(parseFloat(text) || 0)} />
                            </Input>
                        </Box>
                        <Box marginBottom={4} my={"$4"} width="100%">
                            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                Tinggi Badan Saat Lahir (cm)
                            </Text>
                            <Input variant="underlined"   width="100%" padding={"$2"} backgroundColor="gray.100">
                                <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => setHeight(parseFloat(text) || 0)}
                                />
                            </Input>
                        </Box>
                        <Box marginBottom={4} my={"$4"} width="100%">
                            <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                                Lingkar Kepala Saat Lahir (cm)
                            </Text>
                            <Input variant="underlined"   width="100%" padding={"$2"} backgroundColor="gray.100">
                                <InputField keyboardType="numeric" placeholder="Enter Text here" onChangeText={text => setHeight(parseFloat(text) || 0)}
                                />
                            </Input>
                        </Box>
                    </VStack>
                    <Box marginBottom={4} my={"$4"}>
                        <Text fontSize={"$md"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Kategori Premature
                        </Text>
                        <RadioGroup value={gender} onChange={setGender}>
                            <HStack space="2xl">
                                <Radio value="Ya">
                                    <RadioIndicator mr="$2">
                                        <RadioIcon as={CircleIcon} color="#23b160" />
                                    </RadioIndicator>
                                    <RadioLabel>Ya</RadioLabel>
                                </Radio>
                                <Radio value="Tidak">
                                    <RadioIndicator mr="$2">
                                        <RadioIcon as={CircleIcon} color="#23b160" />
                                    </RadioIndicator>
                                    <RadioLabel>Tidak</RadioLabel>
                                </Radio>
                            </HStack>
                        </RadioGroup>
                    </Box>
                    <Box width={"100%"} my={"$1.5"}>
                        <Text fontSize={"$sm"} fontWeight={"$semibold"} marginBottom={"$2"} color="gray.600">
                            Golongan Darah
                        </Text>
                        <Select selectedValue={(golDarah)} onValueChange={(value) => setGolDarah(value)}>
                            <SelectTrigger   variant="underlined" size="md">
                                <SelectInput placeholder="Pilih Kondisi" mx="$3" />
                                <SelectIcon>
                                    <Icon as={ChevronDownIcon} />
                                </SelectIcon>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent position="absolute" width="$full">
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label="Belum Diketahui" value="0" />
                                    <SelectItem label="Golongan Darah A" value="1" />
                                    <SelectItem label="Golongan Darah B" value="2" />
                                    <SelectItem label="Golongan Darah AB" value="3" />
                                    <SelectItem label="Golongan Darah O" value="4" />
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </Box>
                </Box>
            </ScrollView>
            <Pressable
                bg="#23b160"
                py={2}
                height={65}
                alignSelf="center"
                width="100%"
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                onPress={() => navigation.navigate('Hasil Monitoring')}
            >
                <Text textAlign="center" my={"$4"} color="white">Simpan Pengukuran</Text>
            </Pressable>

        </Box>
    );
};

export default TambahAnak;