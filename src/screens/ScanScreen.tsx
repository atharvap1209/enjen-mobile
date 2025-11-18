import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export const ScanScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan</Text>
        <Text style={styles.placeholder}>Scan feature coming soon</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 18,
    color: '#6B7280',
  },
});

