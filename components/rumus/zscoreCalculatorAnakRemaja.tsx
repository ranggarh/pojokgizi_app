import React from 'react';
import { View, Text } from 'react-native';

// Import the JSON files statically
import anakLakiLakiBBU from '../../data_static/anak_remaja_laki_laki/BBU.json';
import anakRemajaLakiLakiIMT from '../../data_static/anak_remaja_laki_laki/IMT.json';
import anakRemajaLakiLakiTBU from '../../data_static/anak_remaja_laki_laki/TBU.json';
import anakRemajaPerempuanBBU from '../../data_static/anak_remaja_perempuan/BBU.json';
import anakRemajaPerempuanIMT from '../../data_static/anak_remaja_perempuan/IMT.json';
import anakRemajaPerempuanTBU from '../../data_static/anak_remaja_perempuan/TBU.json';


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

const ZScoreCalculator: React.FC<{ age: number; weight: number; gender: string; height: number | null; }> = ({ age, weight, gender, height }) => {
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

  return (
    <View>
      <Text>Z-Score BB/U: {zScoreBbu !== null ? zScoreBbu : "Data tidak tersedia"}</Text>
      <Text>Z-Score TB/U: {zScoreTBU !== null ? zScoreTBU : "Data tidak tersedia"}</Text>
      <Text>Z-Score IMT: {zScoreIMT !== null ? zScoreIMT : "Data tidak tersedia"}</Text>
    </View>
  );
};

export default ZScoreCalculator;