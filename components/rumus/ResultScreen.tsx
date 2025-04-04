import React from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { Box, Text, Avatar, VStack, Button, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem, Divider, HStack } from '@gluestack-ui/themed';

const screenHeight = Dimensions.get('window').height; // Get screen height

interface ResultScreenProps {
  name: string;
  age: number;
  ageInYears: number;
  weight: number;
  height?: number;
  imt?: number | null;
  interpretation: string;
  hasil: string;
  selectedZScore: string;
  handleZScoreChange: (value: string) => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  name,
  age,
  ageInYears,
  weight,
  height,
  imt,
  interpretation,
  hasil,
  selectedZScore,
  handleZScoreChange,
}) => {
  return (
    <ScrollView>
      <Box
        bg={'#23b160'}
        height={screenHeight * 0.4} // Set height to 40% of the screen
        borderBottomLeftRadius={30} // Add curved bottom
        borderBottomRightRadius={30} // Add curved bottom
      >
        <Box mt="$4" mx="$4" borderRadius={"$lg"} p="$4">
          <HStack justifyContent='space-between'>
            <VStack>
              <Text fontSize="$xl" color="white" fontWeight="$bold" mx={"$4"}>{name}</Text>
              <Text color="white" mx={"$4"}>{ageInYears} {age} Bulan</Text>
            </VStack>
            <Avatar />
          </HStack>
        </Box>
      </Box>

      <Box
        px={"$4"}
        mx={'$4'}
        mt={-200} // Adjust the margin-top to move the box upwards
        height={"auto"}
        bg={'white'}
        borderRadius={"$lg"}
        softShadow='1'
        zIndex={1} // Ensure the box is above the green background
        position="relative" // Set position to relative for proper stacking
      >
        <Box my={"$2"}>
          <Box flexDirection="row" alignItems="center" justifyContent="center" mx={"$2"} my="$2">
            <Box flex={1}>
              <Text
                my={"$3"}
                mx={"$4"}
                fontWeight="$bold"
                color="green"
                fontSize="$lg"
                mr="$2"
              >
                {interpretation}
              </Text>
            </Box>
            <Box>
              <Select
                selectedValue={selectedZScore}
                onValueChange={handleZScoreChange}
                minWidth={120}
              >
                <SelectTrigger variant="outline" size="md">
                  <SelectInput placeholder="Pilih Z-Score" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="BB/U" value="BB/U" />
                    <SelectItem label="TB/U" value="TB/U" />
                    <SelectItem label="IMT/U" value="IMT/U" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
          </Box>
        </Box>
        <Divider />

        <Box flexDirection='row' gap={"$1"} ml='-$1' mx="$1" my="$2" mb="$4" alignItems='center' justifyContent='space-between'>
          <Box w="$1/3" h={"$20"} px={"$2"} softShadow='1' bg="$white" borderRadius={"$5"} py={"$2"}>
            <Button bg={'#23b160'} w={"$full"} h={"$6"} borderRadius={"$sm"}>
              <Text color={'white'} fontWeight={'$bold'} textAlign='center' fontSize={'$xs'}>Berat</Text>
            </Button>
            <Text mt={"$2"} fontWeight={'$bold'} fontSize={'$lg'} textAlign='center'>{weight} Kg</Text>
          </Box>
          <Box w="$1/3" h={"$20"} px={"$2"} softShadow='1' bg="$white" borderRadius={"$5"} py={"$2"}>
            <Button bg={'#23b160'} w={"$full"} h={"$6"} borderRadius={"$sm"}>
              <Text color={'white'} fontWeight={'$bold'} textAlign='center' fontSize={'$xs'}>Tinggi</Text>
            </Button>
            <Text mt={"$2"} fontWeight={'$bold'} fontSize={'$lg'} textAlign='center'>{height ?? 0} Cm</Text>
          </Box>
          <Box w="$1/3" h={"$20"} px={"$2"} softShadow='1' bg="$white" borderRadius={"$5"} py={"$2"}>
            <Button bg={'#23b160'} w={"$full"} h={"$6"} borderRadius={"$sm"}>
              <Text color={'white'} fontWeight={'$bold'} textAlign='center' fontSize={'$xs'}>IMT</Text>
            </Button>
            <Text mt={"$2"} fontWeight={'$bold'} fontSize={'$lg'} textAlign='center'>{imt !== null ? imt.toFixed(2) : "0"}</Text>
          </Box>
        </Box>
      </Box>

      <Box
        px={"$4"}
        mx={'$4'}
        mt={'$4'}
        height={"$72"}
        bg={'white'}
        borderRadius={"$lg"}
        softShadow='1'
        zIndex={1}
        position="relative"
      >
        <Box my={"$4"} mx={"$4"}>
          <Box bg={"#23b160"} py={'$2'} width={'$40'} alignSelf='center' borderRadius={5}>
            <Text textAlign='center' fontWeight="bold" color='white'> Interpretasi Hasil</Text>
          </Box>
        </Box>
        <Text px={"$2"}>{hasil}</Text>
      </Box>
    </ScrollView>
  );
};

export default ResultScreen;
