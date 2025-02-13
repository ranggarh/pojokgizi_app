import React from 'react';
import { View, Text } from 'react-native';

// Import the JSON files statically
import balitaLakiLakiBBU from '../../data_static/balita_laki_laki/BBU.json';
import balitaLakiLakiBBTB from '../../data_static/balita_laki_laki/BBTB.json';
import balitaLakiLakiBBPB from '../../data_static/balita_laki_laki/BBPB.json';
import balitaLakiLakiTBPBU from '../../data_static/balita_laki_laki/TBPBU.json';
import balitaPerempuanBBU from '../../data_static/balita_perempuan/BBU.json';
import balitaPerempuanBBTB from '../../data_static/balita_perempuan/BBTB.json';
import balitaPerempuanBBPB from '../../data_static/balita_perempuan/BBPB.json';
import balitaPerempuanTBPBU from '../../data_static/balita_perempuan/TBPBU.json';

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

const ZScoreCalculator: React.FC<{ age: number; weight: number; gender: string; height: number | null; panjangBadan: number | null }> = ({ age, weight, gender, height, panjangBadan }) => {
    console.log("Data yang diterima ke ZScoreCalculator:", { age, weight, gender, height, panjangBadan });

    const bbuData = loadJsonData(gender, 'bbu');
    const zScoreBbu = calculateZScoreBBU(age, weight, bbuData);

    const bbpbData = loadJsonData(gender, 'bb_pb');
    const zScoreBBPB = panjangBadan !== null ? calculateZScoreBBPB(weight, panjangBadan, bbpbData) : null;

    const bbtbData = loadJsonData(gender, 'bb_tb');
    const zScoreBBTB = calculateZScoreBBTB(weight, height !== null ? height : 0, bbtbData);

    const pbuData = loadJsonData(gender, 'tb_pb_per_u');
    const zScorePBU = panjangBadan !== null ? calculateZScorePBU(age, panjangBadan, pbuData) : null;

    const tbuData = loadJsonData(gender, 'tb_pb_per_u');
    const zScoreTBU = height !== null ? calculateZScoreTBU(age, height, tbuData) : null;

    return (
      <View>
        <Text>Z-Score BB/U: {zScoreBbu !== null ? zScoreBbu : "null"}</Text>
        {panjangBadan === null ? (
          <>
            <Text>Z-Score TB/U: {zScoreTBU !== null ? zScoreTBU : "null"}</Text>
            <Text>Z-Score BB/TB: {zScoreBBTB !== null ? zScoreBBTB : "null"}</Text>
          </>
        ) : (
          <>
            <Text>Z-Score PB/U: {zScorePBU !== null ? zScorePBU : "null"}</Text>
            <Text>Z-Score BB/PB: {zScoreBBPB !== null ? zScoreBBPB : "null"}</Text>
          </>
        )}
      </View>
    );
};

export default ZScoreCalculator;