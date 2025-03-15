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
import Bmi from "./screens/bmi";
import GiziBalita from "./screens/kalkulator/giziBalita";
import GiziAnakSekolah from "./screens/kalkulator/giziAnakSekolah";
import ZScoreCalculator from "./components/rumus/zscoreCalculatorBalita";
import ZScoreCalculatorAnak from "./components/rumus/zscoreCalculatorAnakRemaja";
import DewasaMaternal from "./screens/kalkulator/dewasaMaternal";
import { StatusBar } from "react-native";
import DewasaKritis from "./screens/kalkulator/dewasaKritis";
import PasienDM from "./screens/kalkulator/pasienDM";
import TambahAnak from "./screens/monitoring/tambahAnak";
import HasilMonitoring from "./screens/monitoring/hasilMonitoring";


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
          color={focused ? "white" : "#d3d3d3"}
        />
      );
    },
    tabBarIconStyle: { marginTop: 5 },
    tabBarStyle: {
      backgroundColor: '#23b160',
      height: 60,
      borderTopWidth: 0,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      shadowColor: '#fff', // Warna bayangan
          shadowOffset: {
            width: 0,
            height: 2, // Mengatur tinggi bayangan
          },
          shadowOpacity: 0.3, // Opasitas bayangan
          shadowRadius: 4, // Radius bayangan
          elevation: 5, 
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
      <StatusBar barStyle="light-content" backgroundColor="#23b160" /> {/* Menambahkan StatusBar */}
      <NavigationContainer>
      <Stack.Navigator>    
          <Stack.Screen name="Tabs" component={Tabs} options={noHead}/>
          <Stack.Screen name="Pengukuran Status Gizi" component={AntroCalc}/>
          <Stack.Screen name="Tambah Pengukuran" component={FormPengukuran}/>
          <Stack.Screen name="Data Pengukuran" component={DetailPengukuran}/>
          <Stack.Screen name="Gizi Balita" component={GiziBalita}/>
          <Stack.Screen name="Gizi Anak Sekolah" component={GiziAnakSekolah}/>
          <Stack.Screen name="Hasil Perhitungan Balita" component={ZScoreCalculator}/>
          <Stack.Screen name="Hasil Perhitungan Anak Remaja" component={ZScoreCalculatorAnak}/>
          <Stack.Screen name="Cek BMI Ideal" component={Bmi}/>
          <Stack.Screen name="Dewasa Maternal" component={DewasaMaternal} />
          <Stack.Screen name="Dewasa Kritis" component={DewasaKritis} />
          <Stack.Screen name="Pasien DM" component={PasienDM} />
          <Stack.Screen name="Tambah Anak" component={TambahAnak} />
          <Stack.Screen name="Hasil Monitoring" component={HasilMonitoring} />          
      </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

export default App;