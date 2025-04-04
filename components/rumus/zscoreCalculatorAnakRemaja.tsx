import React, { useState, useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Dimensions } from 'react-native'; // Import Dimensions to get screen height
import anakLakiLakiBBU from '../../data_static/anak_remaja_laki_laki/BBU.json';
import anakRemajaLakiLakiIMT from '../../data_static/anak_remaja_laki_laki/IMT.json';
import anakRemajaLakiLakiTBU from '../../data_static/anak_remaja_laki_laki/TBU.json';
import anakRemajaPerempuanBBU from '../../data_static/anak_remaja_perempuan/BBU.json';
import anakRemajaPerempuanIMT from '../../data_static/anak_remaja_perempuan/IMT.json';
import anakRemajaPerempuanTBU from '../../data_static/anak_remaja_perempuan/TBU.json';
import GrowthChart from '../grafik';
import SpeedometerChart from '../grafikProgress';
import { Box, VStack, Text, ScrollView, Button, Avatar, HStack, Divider, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@gluestack-ui/themed';
import ResultScreen from './ResultScreen';

const screenHeight = Dimensions.get('window').height; // Get screen height

// Fungsi untuk memuat JSON berdasarkan jenis kelamin dan tipe data
const loadJsonData = (gender: string, type: string) => {
  if (gender === 'Laki Laki') {
    switch (type) {
      case 'bb_u': return anakLakiLakiBBU;
      case 'imt_u': return anakRemajaLakiLakiIMT;
      case 'tb_u': return anakRemajaLakiLakiTBU;
      default: throw new Error('Invalid type');
    }
  } else if (gender === 'Perempuan') {
    switch (type) {
      case 'bb_u': return anakRemajaPerempuanBBU;
      case 'imt_u': return anakRemajaPerempuanIMT;
      case 'tb_u': return anakRemajaPerempuanTBU;
      default: throw new Error('Invalid type');
    }
  }
  throw new Error('Invalid gender');
};

// Fungsi untuk menghitung Z-Score BB/U
const calculateZScoreBBU = (age: number, weight: number, data: any) => {
  const dayData = data.find((item: any) => item.Month === age);

  if (!dayData) return null;

  const { L, M, S } = dayData;
  const L_value = parseFloat(L.replace(',', '.'));
  const M_value = parseFloat(M.replace(',', '.'));
  const S_value = parseFloat(S.replace(',', '.'));

  if (S_value === 0) return null;

  return (Math.pow(weight / M_value, L_value) - 1) / (L_value * S_value);
};

// Fungsi untuk menghitung Z-Score TB/U
const calculateZScoreTBU = (age: number, height: number, data: any) => {
  const dayData = data.find((item: any) => item.Month === age);
  if (!dayData) return null;

  const { L, M, S } = dayData;
  const L_value = typeof L === 'string' ? parseFloat(L.replace(',', '.')) : L;
  const M_value = parseFloat(M.replace(',', '.'));
  const S_value = parseFloat(S.replace(',', '.'));

  if (S_value === 0) return null;

  return (Math.pow(height / M_value, L_value) - 1) / (L_value * S_value);
};

// Fungsi untuk menghitung Z-Score IMT
const calculateZScoreIMT = (age: number, imt: number, data: any) => {
  const dayData = data.find((item: any) => item.Month === age);
  if (!dayData) return null;

  const { L, M, S } = dayData;
  const L_value = parseFloat(L.replace(',', '.'));
  const M_value = parseFloat(M.replace(',', '.'));
  const S_value = parseFloat(S.replace(',', '.'));

  if (S_value === 0) return null;

  return (Math.pow(imt / M_value, L_value) - 1) / (L_value * S_value);
};
type PerhitunganParams = {
  name: string;
  age: number;
  gender: string;
  weight: number;
  height?: number;
};

type PerhitunganRouteProp = RouteProp<{ Perhitungan: PerhitunganParams }, 'Hasil Perhitungan Anak Remaja'>;

interface PerhitunganScreenProps {
  route: PerhitunganRouteProp;
}

const ZScoreCalculator: React.FC<PerhitunganScreenProps> = ({ route }) => {
  const { name, age, ageInYears, gender, weight, height } = route.params;

  console.log("Data yang diterima ke ZScoreCalculator:", { age, weight, gender, height });

  const bbuData = loadJsonData(gender, 'bb_u');
  const zScoreBbu = calculateZScoreBBU(age, weight, bbuData);
  console.log("Z-Score BB/U:", zScoreBbu); // Log Z-Score BB/U

  const tbuData = loadJsonData(gender, 'tb_u');
  const zScoreTBU = height !== null ? calculateZScoreTBU(age, height, tbuData) : null;
  console.log("Z-Score TB/U:", zScoreTBU); // Log Z-Score TB/U

  // Hitung IMT
  const imt = height !== null && weight > 0 ? weight / Math.pow(height / 100, 2) : null; // IMT = berat (kg) / (tinggi (m))^2

  const imtData = loadJsonData(gender, 'imt_u');
  const zScoreIMT = imt !== null ? calculateZScoreIMT(age, imt, imtData) : null;
  console.log("Z-Score IMT:", zScoreIMT); // Log Z-Score IMT

  const progressData = [zScoreBbu, zScoreIMT, zScoreTBU]; // Data persentase (0 - 1)

  const [chartIndex, setChartIndex] = useState(0); // 0: BB/U, 1: TB/U, 2: IMT
  const [interpretation, setInterpretation] = useState('');
  const [hasil, setHasil] = useState('');
  const [selectedZScore, setSelectedZScore] = useState("BB/U");

  const handleZScoreChange = (value: string) => {
    setSelectedZScore(value);
    if (value === "BB/U") {
      setChartIndex(0);
    } else if (value === "TB/U") {
      setChartIndex(1);
    } else if (value === "IMT/U") {
      setChartIndex(2);
    }
  };

  const handleNext = () => {
    setChartIndex((prev) => (prev + 1) % 3); // Loop dari 0 → 1 → 2 → 0
  };

  const handlePrevious = () => {
    setChartIndex((prev) => (prev - 1 + 3) % 3); // Loop dari 2 → 1 → 0 → 2
  };

  const updateInterpretation = (index: number) => {
    let statusGizi = '';
    switch (index) {
      case 0:
        statusGizi = zScoreBbu !== null ? zScoreBbu.toFixed(2) : "Data tidak tersedia";
        setInterpretation(`Status Gizi Berdasarkan BB/U: ${statusGizi}`);
        break;
      case 1:
        statusGizi = zScoreTBU !== null ? zScoreTBU.toFixed(2) : "Data tidak tersedia";
        setInterpretation(`Status Gizi Berdasarkan TB/U: ${statusGizi}`);
        break;
      case 2:
        if (zScoreIMT !== null) {
          // Klasifikasi status gizi berdasarkan Z-Score IMT
          if (zScoreIMT < -3) {
            setInterpretation("Gizi Buruk (Severely Thinness)");
            setHasil("Gizi Buruk Wajib Diperiksa ke dokter");
          } else if (zScoreIMT >= -3 && zScoreIMT < -2) {
            setInterpretation("Gizi Kurang (Thinness)");
            setHasil("Gizi Buruk Wajib Diperiksa ke dokter");
          } else if (zScoreIMT >= -2 && zScoreIMT <= 1) {
            setInterpretation("Gizi Baik (Normal)");
            setHasil("Gizi Baik Normal");
          } else if (zScoreIMT > 1 && zScoreIMT <= 2) {
            setInterpretation("Gizi Lebih (Overweight)");
            setHasil("Gizi Buruk Wajib Diperiksa ke dokter");
          } else if (zScoreIMT > 2) {
            setInterpretation("Obesitas (Obese)");
            setHasil("Gizi Buruk Wajib Diperiksa ke dokter");
          } else {
            setInterpretation("Data tidak tersedia");
            setHasil("Data tidak valid, Hasil tidak ada");
          }
        } else {
          setInterpretation("Data tidak tersedia");
          setHasil("Hasil tidak muncul");
        }
        break;
      default:
        setInterpretation('');
        setHasil('');
    }
  };


  useEffect(() => {
    updateInterpretation(chartIndex);
  }, [chartIndex]);


  return (
    <ResultScreen
      name={name}
      age={age}
      ageInYears={ageInYears}
      weight={weight}
      height={height}
      imt={imt}
      interpretation={interpretation}
      hasil={hasil}
      selectedZScore={selectedZScore}
      handleZScoreChange={handleZScoreChange}
    />
  );
};

export default ZScoreCalculator;