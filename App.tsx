import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./screens/Home";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import AntroCalc from "./screens/calculator";
import FormPengukuran from "./components/formPengukuran";
import DetailPengukuran from "./screens/detailPengukuran";
import FormKalkulator from "./components/formKalkulator";
import Bmi from "./screens/bmi";
import GiziBalita from "./screens/kalkulator/giziBalita";
import GiziAnakSekolah from "./screens/kalkulator/giziAnakSekolah";
import GiziDewasa from "./screens/kalkulator/giziDewasa";
import HasilPengukuran from "./screens/resultCalculator";
import ZScoreCalculator from "./components/rumus/zscoreCalculatorBalita";
import ZScoreCalculatorAnak from "./components/rumus/zscoreCalculatorAnakRemaja";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color }) => {
      // Tipe eksplisit untuk iconName
      let iconName: "home" | "newspaper" | "person-circle";
      switch (route.name) {
        case "Home":
          iconName = "home";
          break;
        case "Riwayat":
          iconName = "newspaper";
          break;
        case "Profile":
          iconName = "person-circle";
          break;
        default:
          iconName = "home"; // Default fallback (opsional)
      }
      return (
        <Ionicons
          name={iconName}
          size={30}
          color={focused ? "#23b160" : "#d3d3d3"}
        />
      );
    },
    tabBarIconStyle: { marginTop: 5 },
    tabBarStyle: {
      backgroundColor: 'white',
      height: 60,
      borderTopWidth: 0,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    tabBarShowLabel: false,
  })}
>
  <Tab.Screen name="Home" component={Home} options={noHead} />
  <Tab.Screen name="Riwayat" component={Home} options={noHead} />
  <Tab.Screen name="Profile" component={Home} options={noHead} />
</Tab.Navigator>

  );
};

const noHead = { headerShown: false };

function App() {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
      <Stack.Navigator>    
          <Stack.Screen name="Tabs" component={Tabs} options={noHead}/>
          <Stack.Screen name="Pengukuran Status Gizi" component={AntroCalc}/>
          <Stack.Screen name="Tambah Pengukuran" component={FormPengukuran}/>
          <Stack.Screen name="Data Pengukuran" component={DetailPengukuran}/>
          <Stack.Screen name="Gizi Balita" component={GiziBalita}/>
          <Stack.Screen name="Gizi Anak Sekolah" component={GiziAnakSekolah}/>
          <Stack.Screen name="Gizi Dewasa" component={GiziDewasa}/>
          <Stack.Screen name="Hasil Perhitungan Balita" component={ZScoreCalculator}/>
          <Stack.Screen name="Hasil Perhitungan Anak Remaja" component={ZScoreCalculatorAnak}/>
          <Stack.Screen name="Cek BMI Ideal" component={Bmi}/>
      </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

export default App;