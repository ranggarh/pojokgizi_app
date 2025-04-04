import React, {useState } from 'react';
import {useRoute, RouteProp} from '@react-navigation/native';
import ResultScreen from './ResultScreen';

// Import the JSON files statically
import balitaLakiLakiBBU from '../../data_static/balita_laki_laki/BBU.json';
import balitaLakiLakiBBTB from '../../data_static/balita_laki_laki/BBTB.json';
import balitaLakiLakiBBPB from '../../data_static/balita_laki_laki/BBPB.json';
import balitaLakiLakiTBPBU from '../../data_static/balita_laki_laki/TBPBU.json';
import balitaPerempuanBBU from '../../data_static/balita_perempuan/BBU.json';
import balitaPerempuanBBTB from '../../data_static/balita_perempuan/BBTB.json';
import balitaPerempuanBBPB from '../../data_static/balita_perempuan/BBPB.json';
import balitaPerempuanTBPBU from '../../data_static/balita_perempuan/TBPBU.json';
import { Box, ScrollView, Text, Avatar, VStack, Button } from '@gluestack-ui/themed';

// Fungsi untuk memuat JSON berdasarkan jenis kelamin dan tipe data
const loadJsonData = (gender: string, type: string) => {
  if (gender === 'Laki Laki') {
    switch (type) {
      case 'bbu': return balitaLakiLakiBBU;
      case 'bb_tb': return balitaLakiLakiBBTB;
      case 'bb_pb': return balitaLakiLakiBBPB;
      case 'tb_pb_per_u': return balitaLakiLakiTBPBU;
      default: throw new Error('Invalid type');
    }
  } else if (gender === 'Perempuan') {
    switch (type) {
        case 'bbu': return balitaPerempuanBBU;
        case 'bb_tb': return balitaPerempuanBBTB;
        case 'bb_pb': return balitaPerempuanBBPB;
        case 'tb_pb_per_u': return balitaPerempuanTBPBU;
        default: throw new Error('Invalid type');
      }
  }
  throw new Error('Invalid gender');
};

// Fungsi untuk menghitung Z-Score BB/U
const calculateZScoreBBU = (age: number, weight: number, data: any) => {
    const dayData = data.find((item: any) => item.Day === age);
    if (!dayData) return null;

    const { L, M, S } = dayData;
    const L_value = parseFloat(L.replace(',', '.'));
    const M_value = parseFloat(M.replace(',', '.'));
    const S_value = parseFloat(S.replace(',', '.'));

    if (S_value === 0) return null;

    return (Math.pow(weight / M_value, L_value) - 1) / (L_value * S_value);
};

// Fungsi untuk menghitung Z-Score BB/PB
const calculateZScoreBBPB = (weight: number, panjangBadan: number, data: any) => {
    const lengthData = data.find((item: any) => parseFloat(item.Length.replace(',', '.')) === panjangBadan);
    if (!lengthData) return null;

    const { L, M, S } = lengthData;
    const L_value = parseFloat(L.replace(',', '.'));
    const M_value = parseFloat(M.replace(',', '.'));
    const S_value = parseFloat(S.replace(',', '.'));

    if (S_value === 0) return null;

    return (Math.pow(weight / M_value, L_value) - 1) / (L_value * S_value);
};

// Fungsi untuk menghitung Z-Score BB/TB
const calculateZScoreBBTB = (weight: number, height: number, data: any) => {
    const heightData = data.find((item: any) => parseFloat(item.Height.replace(',', '.')) === height);
    if (!heightData) return null;

    const { L, M, S } = heightData;
    const L_value = parseFloat(L.replace(',', '.'));
    const M_value = parseFloat(M.replace(',', '.'));
    const S_value = parseFloat(S.replace(',', '.'));

    if (S_value === 0) return null;

    return (Math.pow(weight / M_value, L_value) - 1) / (L_value * S_value);
};

// Fungsi untuk menghitung Z-Score TB/U
const calculateZScoreTBU = (age: number, height: number, data: any) => {
    const dayData = data.find((item: any) => item.Day === age);
    if (!dayData) return null;

    const { L, M, S } = dayData;
    const L_value = typeof L === 'string' ? parseFloat(L.replace(',', '.')) : L;
    const M_value = parseFloat(M.replace(',', '.'));
    const S_value = parseFloat(S.replace(',', '.'));

    if (S_value === 0) return null;

    return (Math.pow(height / M_value, L_value) - 1) / (L_value * S_value);
};

// Fungsi untuk menghitung Z-Score PB/U
const calculateZScorePBU = (age: number, panjangBadan: number, data: any) => {
    const dayData = data.find((item: any ) => item.Day === age);
    if (!dayData) return null;

    const { L, M, S } = dayData;
    const L_value = typeof L === 'string' ? parseFloat(L.replace(',', '.')) : L;
    const M_value = parseFloat(M.replace(',', '.'));
    const S_value = parseFloat(S.replace(',', '.'));

    if (S_value === 0) return null;

    return (Math.pow(panjangBadan / M_value, L_value) - 1) / (L_value * S_value);
};

type PerhitunganParams = {
  name: string;
  age: number;
  gender: string;
  weight: number;
  height?: number;
  panjangBadan?: number;
  posisiPengukuran: string;
  ageInYears: number;
};

type PerhitunganRouteProp = RouteProp<{ Perhitungan: PerhitunganParams }, 'Perhitungan'>;

interface PerhitunganScreenProps {
  route: PerhitunganRouteProp;
}

const ZScoreCalculator: React.FC<PerhitunganScreenProps> = ({ route }) => {
  const { name, age, ageInYears, gender, weight, height, panjangBadan, posisiPengukuran } = route.params;
  const [chartIndex, setChartIndex] = useState(0); // 0: BB/U, 1: TB/U, 2: IMT
  const [interpretation, setInterpretation] = useState('');
  const [hasil, setHasil] = useState('');
  const [selectedZScore, setSelectedZScore] = useState<number | null>(null);
  
    console.log("Data yang diterimaaa ke ZScoreCalculator:", { age, weight, gender, height, posisiPengukuran });
    

    const bbuData = loadJsonData(gender, 'bbu');
    const zScoreBbu = calculateZScoreBBU(age, weight, bbuData);
    console.log("Z-Score BB/U:", zScoreBbu);

    const bbpbData = loadJsonData(gender, 'bb_pb');
    const zScoreBBPB = panjangBadan !== null ? calculateZScoreBBPB(weight, panjangBadan, bbpbData) : null;
    console.log("Z-Score BB/PB:", zScoreBBPB);

    const bbtbData = loadJsonData(gender, 'bb_tb');
    const zScoreBBTB = calculateZScoreBBTB(weight, height !== null ? height : 0, bbtbData);
    console.log("Z-Score BB/TB:", zScoreBBTB);

    const pbuData = loadJsonData(gender, 'tb_pb_per_u');
    const zScorePBU = panjangBadan !== null ? calculateZScorePBU(age, panjangBadan, pbuData) : null;
    console.log("Z-Score PB/U:", zScorePBU);

    const tbuData = loadJsonData(gender, 'tb_pb_per_u');
    const zScoreTBU = height !== null ? calculateZScoreTBU(age, height, tbuData) : null;
    console.log("Z-Score TB/U:", zScoreTBU);

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
          if (zScoreTBU !== null) {
            // Klasifikasi status gizi berdasarkan Z-Score IMT
            if (zScoreTBU < -3) {
              setInterpretation("Gizi Buruk (Severely Thinness)");
              setHasil("Gizi Buruk Wajib Diperiksa ke dokter");
            } else if (zScoreTBU >= -3 && zScoreTBU < -2) {
              setInterpretation("Gizi Kurang (Thinness)");
              setHasil("Gizi Buruk Wajib Diperiksa ke dokter");
            } else if (zScoreTBU >= -2 && zScoreTBU <= 1) {
              setInterpretation("Gizi Baik (Normal)");
              setHasil("Gizi Baik Normal");
            } else if (zScoreTBU > 1 && zScoreTBU <= 2) {
              setInterpretation("Gizi Lebih (Overweight)");
              setHasil("Gizi Buruk Wajib Diperiksa ke dokter");
            } else if (zScoreTBU > 2) {
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

    const handleZScoreChange = (zScore: number | null) => {
      setSelectedZScore(zScore);
    };

    return (
      <ResultScreen
        name={name}
        age={age}
        ageInYears={ageInYears}
        weight={weight}
        height={height}
        imt={null} // Balita mungkin tidak memiliki IMT
        interpretation={interpretation}
        hasil={hasil}
        selectedZScore={selectedZScore}
        handleZScoreChange={handleZScoreChange}
      />
    );
};

export default ZScoreCalculator;