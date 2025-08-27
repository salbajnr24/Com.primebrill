import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { testFirebaseConnection } from './testFirebase';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState('');

  const handleFirebaseTest = async () => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      const success = await testFirebaseConnection();
      const result = success ? 'Firebase connection successful!' : 'Firebase connection failed!';
      setTestResult(result);
      Alert.alert('Firebase Test', result);
    } catch (error) {
      const errorMsg = `Firebase test error: ${error}`;
      setTestResult(errorMsg);
      Alert.alert('Firebase Test Error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brill Prime - Mobile</Text>
      <Text style={styles.subtitle}>Multi-platform e-commerce application</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleFirebaseTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Firebase Connection'}
        </Text>
      </TouchableOpacity>
      
      {testResult ? (
        <Text style={[
          styles.result,
          { color: testResult.includes('successful') ? '#155724' : '#721c24' }
        ]}>
          {testResult}
        </Text>
      ) : null}
      
      <Text style={styles.note}>
        Check the console/logs for detailed Firebase test output
      </Text>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    marginVertical: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});