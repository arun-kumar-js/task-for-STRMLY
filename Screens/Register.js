import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = () => {
    if (!email || !password) {
      Alert.alert('Please fill all fields.');
      return;
    }

    setLoading(true);

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        Alert.alert('Success', 'User account created successfully');
        navigation.navigate('Login');
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('This email is already registered. Please log in.');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('The email address is invalid.');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Password should be at least 6 characters.');
        } else {
          Alert.alert('Registration failed', error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#ff0050"
          style={{ marginVertical: verticalScale(10) }}
        />
      )}

      <TouchableOpacity
        style={[
          styles.registerButton,
          loading ? { backgroundColor: '#ccc' } : {},
        ]}
        onPress={onRegister}
        disabled={loading}
      >
        <Text style={styles.registerButtonText}>
          {loading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    marginBottom: verticalScale(32),
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: verticalScale(48),
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(10),
    backgroundColor: '#fdfdfd',
  },
  registerButton: {
    backgroundColor: '#ff0050',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  registerButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: verticalScale(20),
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: moderateScale(14),
  },
  link: {
    color: '#ff0050',
    fontWeight: '600',
  },
});

export default Register;
