// GrowthChart.js
import { Box, Text, HStack, Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem, Button, Pressable } from '@gluestack-ui/themed';
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';

// Import reference data from separate files
import { weightReferenceData } from './../../../data_static/batas_grafik/batasBerat';
import { bmiReferenceData } from './../../../data_static/batas_grafik/batasIMT';
import { heightReferenceData } from './../../../data_static/batas_grafik/batasTinggi';
import { headCircumferenceReferenceData } from './../../../data_static/batas_grafik/batasLKepala';

const { width } = Dimensions.get('window');

interface UserDataPoint {
  month?: number;
  weight?: number;
  height?: number;
  headCircumference?: number;
  bmi?: number;
}

const GrowthChart = ({ userDataPoint, gender = 'boys', activeChartType }: { userDataPoint: UserDataPoint, gender?: string, activeChartType?: string }) => {
  // Chart type state
  const [chartType, setChartType] = useState('weight-for-age'); // 'weight-for-age' or 'bmi-for-age'
  const scrollViewRef = useRef(null);

  // Chart types list with grouping information
  const chartTypes = [
    { id: 'weight-for-age', title: 'Berat Badan Terhadap Usia', group: 'weight-bmi' },
    { id: 'bmi-for-age', title: 'IMT Terhadap Usia', group: 'weight-bmi' },
    { id: 'height-for-age', title: 'Tinggi Badan Terhadap Usia', group: 'height' },
    { id: 'head-circumference-for-age', title: 'Lingkar Kepala Terhadap Usia', group: 'head' }
  ];

  useEffect(() => {
    if (activeChartType) {
      setChartType(activeChartType);
    }
  }, [activeChartType]);

  // Find current chart info
  const currentChartInfo = chartTypes.find(c => c.id === chartType);

  // Navigation handlers - modified to respect grouping
  const goToPrevious = () => {
    // If current chart is not in the weight-bmi group, no navigation
    if (!currentChartInfo || currentChartInfo.group !== 'weight-bmi') {
      return;
    }

    // Only navigate between weight and BMI
    if (chartType === 'weight-for-age') {
      setChartType('bmi-for-age');
    } else if (chartType === 'bmi-for-age') {
      setChartType('weight-for-age');
    }
  };

  const goToNext = () => {
    // If current chart is not in the weight-bmi group, no navigation
    if (!currentChartInfo || currentChartInfo.group !== 'weight-bmi') {
      return;
    }

    // Only navigate between weight and BMI
    if (chartType === 'weight-for-age') {
      setChartType('bmi-for-age');
    } else if (chartType === 'bmi-for-age') {
      setChartType('weight-for-age');
    }
  };

  // Helper function to determine if navigation buttons should be visible
  const shouldShowNavButtons = () => {
    return currentChartInfo?.group === 'weight-bmi';
  };

  // State for selected age range
  const [selectedRange, setSelectedRange] = useState('0-6');

  // Auto-select appropriate range based on user's age if provided
  useEffect(() => {
    if (userDataPoint && userDataPoint.month !== undefined) {
      const month = userDataPoint.month;
      if (month <= 6) {
        setSelectedRange('0-6');
      } else if (month <= 12) {
        setSelectedRange('6-12');
      } else if (month <= 24) {
        setSelectedRange('12-24');
      }
    }
  }, [userDataPoint]);

  // Auto-scroll to user's data point when chart loads or changes
  useEffect(() => {
    if (userPoint && scrollViewRef.current) {
      // Add a small delay to ensure chart has rendered
      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          x: Math.max(0, userPoint.x - width / 2),
          animated: true
        });
      }, 100);
    }
  }, [chartType, selectedRange, userDataPoint]);

  // Get current reference data based on selection and chart type
  const getReferenceData = () => {
    switch (chartType) {
      case 'weight-for-age':
        return weightReferenceData;
      case 'height-for-age':
        return heightReferenceData;
      case 'head-circumference-for-age':
        return headCircumferenceReferenceData;
      case 'bmi-for-age':
        return bmiReferenceData;
      default:
        return weightReferenceData;
    }
  };

  const referenceData = getReferenceData();
  const currentRangeData = referenceData[selectedRange];
  const months = currentRangeData.months;
  const genderData = gender === 'boys' ? currentRangeData.boys : currentRangeData.girls;
  
  // Calculate chart width based on data points - make wider for scrolling
  const chartWidth = Math.max(width, months.length * 50); // At least screen width, or 50px per data point

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => '#cbf5df',
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0', // No dots on lines
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // Solid grid lines
    },
  };

  // Format data for LineChart
  const data = {
    labels: months.map(m => `${m}`),
    datasets: [
      {
        data: genderData.zScorePlus3,
        color: () => 'rgba(0, 0, 0, 0.7)',
        strokeWidth: 1,
      },
      {
        data: genderData.zScorePlus2,
        color: () => 'rgba(28, 208, 0, 0.7)',
        strokeWidth: 1,
      },
      {
        data: genderData.zScorePlus0,
        color: () => 'rgba(0, 100, 0, 0.7)',
        strokeWidth: 1.5,
      },
      {
        data: genderData.zScoreMinus2,
        color: () => 'rgba(255, 0, 0, 0.7)',
        strokeWidth: 1,
      },
      {
        data: genderData.zScoreMinus3,
        color: () => 'rgba(0, 0, 0, 0.7)',
        strokeWidth: 1,
      },
    ],
  };

  // Calculate position for user data point
  const getUserPointPosition = () => {
    if (!userDataPoint || userDataPoint.month === undefined) {
      return null;
    }

    // Get required property based on chart type
    const getRequiredProperty = () => {
      switch (chartType) {
        case 'weight-for-age':
          return 'weight';
        case 'height-for-age':
          return 'height';
        case 'head-circumference-for-age':
          return 'headCircumference';
        case 'bmi-for-age':
          return 'bmi';
        default:
          return 'weight';
      }
    };

    const requiredProperty = getRequiredProperty();
    if (userDataPoint[requiredProperty] === undefined) {
      return null;
    }

    // Check if month is in the current range
    const monthIndex = months.indexOf(userDataPoint.month);
    if (monthIndex === -1) {
      // Month not in current range
      return null;
    }

    // Calculate x position based on month index - adjust for scrollable chart
    const xStep = (chartWidth - 64) / (months.length - 1);
    const x = monthIndex * xStep + 32; // 32 is left padding

    // Calculate y position based on measurement
    const y = getYPosition(userDataPoint[requiredProperty]);

    return { x, y, value: userDataPoint[requiredProperty] };
  };

  const getUnit = () => {
    switch (chartType) {
      case 'weight-for-age':
        return 'kg';
      case 'height-for-age':
        return 'cm';
      case 'head-circumference-for-age':
        return 'cm';
      case 'bmi-for-age':
        return 'kg/m²';
      default:
        return 'kg';
    }
  };

  // Calculate y position based on measurement value
  const getYPosition = (value) => {
    // Get min and max from reference data
    const allValues = Object.values(genderData).flat();
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Chart height estimation
    const chartHeight = 220;

    // Higher value means lower Y position
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return chartHeight - (normalizedValue * chartHeight);
  };

  const userPoint = getUserPointPosition();

  // Get range description
  const getRangeDescription = (range) => {
    const [start, end] = range.split('-');
    return `${start} to ${end} months`;
  };

  // Get current chart title
  const currentChartTitle = chartTypes.find(c => c.id === chartType)?.title;

  return (
    <Box style={styles.container} mt="$4">
      {/* Navigation buttons and title */}
      <HStack alignItems="center" justifyContent="space-between" mb="$2">
        {shouldShowNavButtons() ? (
          <Pressable onPress={goToPrevious} hitSlop={8}>
            <Box p="$2">
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </Box>
          </Pressable>
        ) : (
          <Box flex={1} /> // Flexible spacer when no button
        )}
        <Box borderRadius="$lg" p="$2" mx="$4" shadow="1">
          <Text my="$2" style={styles.title}>
            {currentChartTitle}
          </Text>
        </Box>

        {shouldShowNavButtons() ? (
          <Pressable onPress={goToNext} hitSlop={8}>
            <Box p="$2">
              <Ionicons name="chevron-forward" size={24} color="#007AFF" />
            </Box>
          </Pressable>
        ) : (
          <Box flex={1} /> // Empty spacer when no button
        )}
      </HStack>

      <HStack justifyContent="space-between" px="$6" mt="$2" mb="$4">
        <Box>
          <Text fontSize="$sm" fontWeight="$bold">Grafik Standar WHO</Text>
          <Text fontSize="$sm" fontWeight="$bold">{chartType === 'weight-for-age' ? 'Berat Badan (Kg)' :
            chartType === 'height-for-age' ? 'Tinggi Badan (cm)' :
              chartType === 'head-circumference-for-age' ? 'Lingkar Kepala (cm)' :
                'IMT (kg/m²)'}</Text>
        </Box>
        {/* Age Range Dropdown */}
        <Box alignItems="center" mb="$2">
          <Select
            selectedValue={selectedRange}
            onValueChange={value => setSelectedRange(value)}
            minWidth={160}
          >
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Select age range" />
              <SelectIcon >
                <ChevronDownIcon />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {Object.keys(referenceData).map((range) => (
                  <SelectItem
                    key={range}
                    label={getRangeDescription(range)}
                    value={range}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </Box>
      </HStack>

      {/* Scrollable Chart Container */}
      <View style={styles.chartOuterContainer}>
        <ScrollView 
          horizontal 
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={[styles.chartContainer, { width: chartWidth }]}>
            <LineChart
              data={data}
              width={chartWidth - 32} // Adjust width to be scrollable
              height={250}
              chartConfig={chartConfig}
              bezier={false}
              style={styles.chart}
              withDots={false}
              withInnerLines={true}
              withOuterLines={true}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              fromZero={false}
              verticalLabelRotation={0}
              xAxisLabel=""
              yAxisLabel=""
              yAxisSuffix=""
            />

            {userPoint && (
              <Svg style={[StyleSheet.absoluteFill, { width: chartWidth }]}>
                <Circle
                  cx={userPoint.x}
                  cy={userPoint.y}
                  r={5}
                  fill="blue"
                />
                <SvgText
                  x={userPoint.x + 10}
                  y={userPoint.y - 10}
                  fill="blue"
                  fontSize="12"
                >
                  {userPoint.value} {getUnit()}
                </SvgText>
              </Svg>
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.legendContainer}>
        <HStack justifyContent="space-between" mt="-$4" mx="$4">
          <Box>
            <View style={styles.legendRow}>
              <View style={[styles.legendLine, { backgroundColor: 'black' }]} />
              <Text style={styles.legendText}>+3 SD / -3 SD</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendLine, { backgroundColor: 'red' }]} />
              <Text style={styles.legendText}>+2 SD / -2 SD</Text>
            </View>
          </Box>
          <Box>
            <View style={styles.legendRow}>
              <View style={[styles.legendLine, { backgroundColor: 'green', height: 2 }]} />
              <Text style={styles.legendText}>Median (0 SD)</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: 'blue' }]} />
              <Text style={styles.legendText}>Data Anak</Text>
            </View>
          </Box>
        </HStack>
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  chartOuterContainer: {
    height: 300,
    marginHorizontal: 16,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  chartContainer: {
    // Width will be set dynamically
  },
  chart: {
    borderRadius: 10,
    alignSelf: 'center',
  },
  legendContainer: {
    marginTop: 10,
    padding: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  legendLine: {
    width: 24,
    height: 1,
    marginRight: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});

export default GrowthChart;