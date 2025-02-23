import React from "react";
import { View, StyleSheet } from "react-native";
import RNSpeedometer from "react-native-speedometer";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

interface SpeedometerProps {
  value: number;
  size?: number;
}

const SpeedometerChart: React.FC<SpeedometerProps> = ({ value, size = 200 }) => {
  return (
    <View style={styles.container}>
      <RNSpeedometer value={value} size={size} maxValue={3} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
});

export default SpeedometerChart;
