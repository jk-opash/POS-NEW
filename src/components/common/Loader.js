import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { ThemeColors, ThemeSpacing } from '@/theme/theme';

export function Loader({ text, size = "large" }) {
  // Map size to dimensions
  const dimension = size === "large" ? 150 : (size === "medium" ? 80 : 40);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/animation/Spoon_Loader.json")}
        autoPlay
        loop
        style={{ width: dimension, height: dimension }}
      />
      {text && (
        <Text style={styles.text}>{text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ThemeSpacing.lg,
  },
  text: {
    marginTop: ThemeSpacing.md,
    color: ThemeColors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  }
});
