import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const Upload = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Project Note</Text>
      <Text style={styles.message}>Dear Team,</Text>
      <Text style={styles.message}>
        I initially planned to use Firebase Storage for media uploads. However,
        it now requires a paid subscription , which exceeds the
        free tier and is currently not feasible.
      </Text>
      <Text style={styles.message}>
        To ensure smooth progress without additional cost, I’m implementing an
        alternative approach that aligns with the project goals and user
        expectations.
      </Text>
      <Text style={styles.message}>
        Please let me know if there's any company-approved storage option you'd
        prefer me to use.
      </Text>
      <Text style={styles.signature}>
        Thank you for your support and understanding.
      </Text>
      <Text style={styles.signature}>— Arunkumar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill full height
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
    color: '#ff0050',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  signature: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Upload;
