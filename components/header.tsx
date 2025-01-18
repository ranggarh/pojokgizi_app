import { Box, HStack, Text, VStack } from "@gluestack-ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = () => {
    return (
        <Box bg="white" h={60} position="static" top={0} zIndex={10}>
            <HStack mt={"$5"} mx={"$4"} justifyContent="space-between" shadowColor="black" shadowOpacity={0.5} shadowOffset={{ width: 0, height: 5 }}>
                <Text>Halo Rangga !</Text>
                <Ionicons size={30} name="person-circle-outline"></Ionicons>  
            </HStack>  
        </Box>
    );  
};

export default Header;