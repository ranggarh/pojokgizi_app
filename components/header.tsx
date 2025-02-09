import { Box, HStack, Text, VStack, Image } from "@gluestack-ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = () => {
    return (
        <Box bg="white" shadowOpacity={0.5} hardShadow={"5"} shadowColor="black" h={60} position="static" top={0} zIndex={10}>
            <HStack mt={"$5"} mx={"$4"} justifyContent="space-between" shadowColor="black" shadowOpacity={0.5} shadowOffset={{ width: 0, height: 5 }}>
                <Text>Nutriclick</Text>
                <Image source={require("../assets/logonutriclick.png")} alt="Pantau Tumbuh Kembang Anak Secara Berkala" mt={"-$1"} style={{ width: 30, height: 30 }} />
            </HStack>  
        </Box>
    );  
};

export default Header;