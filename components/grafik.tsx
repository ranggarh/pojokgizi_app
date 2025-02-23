import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Box } from '@gluestack-ui/themed';

interface GrowthChartProps {
  weight: number;
  height: number;
  imt: number;
  age: number;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ weight, height, imt, age }) => {
  const screenWidth = Dimensions.get('window').width;

  // Data untuk grafik
  const chartsData = [
    {
      label: 'TB dengan Umur',
      data: [height], // Data TB
      yAxisSuffix: ' cm',
    },
    {
      label: 'BB dengan Umur',
      data: [weight], // Data BB
      yAxisSuffix: ' kg',
    },
    {
      label: 'IMT dengan Umur',
      data: [imt], // Data IMT
      yAxisSuffix: '',
    },
  ];

  return (
    <ScrollView>
      <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
        Grafik Pertumbuhan WHO
      </Text>
      <Box alignItems="center">
        <LineChart
          data={{
            labels: ['1', '2', '3', '4', '5', '6', '7', '12'], // Usia (bulan)
            datasets: [
              {
                data: chartsData[0].data, // Ambil data TB sebagai contoh
                color: () => `#1E90FF`, // Warna garis (biru)
                strokeWidth: 2, // Ketebalan garis
              },
            ],
          }}
          width={screenWidth - 30}
          height={250}
          yAxisSuffix={chartsData[0].yAxisSuffix}
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#e0f7fa',
            backgroundGradientFrom: '#e0f7fa',
            backgroundGradientTo: '#b2ebf2',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(30, 144, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#1E90FF',
            },
          }}
          style={{
            marginVertical: 10,
            borderRadius: 16,
            flex: 1,
          }}
        />
      </Box>
      <Text style={{ textAlign: 'center', fontSize: 14, color: '#4caf50' }}>
        Interpretasi: {chartsData[0].label} ✅
      </Text>
    </ScrollView>
  );
};

export default GrowthChart;