import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { ThemeColors, ThemeSpacing, ThemeRadius } from '@/theme/theme';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';

const BaseCustomToast = ({ title, message, icon: Icon, color, bgColor }) => (
  <View style={[styles.container, { borderLeftColor: color, backgroundColor: bgColor }]}>
    <View style={styles.iconContainer}>
      <Icon size={24} color={color} />
    </View>
    <View style={styles.textContainer}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {!!message && (
        <Text style={styles.message}>
          {typeof message === 'object' 
            ? (message.error || message.message || JSON.stringify(message)) 
            : message}
        </Text>
      )}
    </View>
  </View>
);

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <BaseCustomToast 
      title={text1} 
      message={text2} 
      icon={CheckCircle2} 
      color={ThemeColors.emerald} 
      bgColor={ThemeColors.emeraldDim} 
    />
  ),
  error: ({ text1, text2 }) => (
    <BaseCustomToast 
      title={text1} 
      message={text2} 
      icon={AlertCircle} 
      color={ThemeColors.rose} 
      bgColor={ThemeColors.roseDim} 
    />
  ),
  info: ({ text1, text2 }) => (
    <BaseCustomToast 
      title={text1} 
      message={text2} 
      icon={Info} 
      color={ThemeColors.primary} 
      bgColor={ThemeColors.primaryDim} 
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 400,
    minHeight: 60,
    backgroundColor: '#fff',
    borderRadius: ThemeRadius.md,
    borderLeftWidth: 6,
    flexDirection: 'row',
    alignItems: 'center',
    padding: ThemeSpacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginTop: Platform.OS === "ios" ? 40 : 20,
  },
  iconContainer: {
    marginRight: ThemeSpacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: ThemeColors.text,
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: ThemeColors.textMuted,
  },
});
