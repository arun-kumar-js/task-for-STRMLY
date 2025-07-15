import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';
import Register from './Register';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
  const Navigation=useNavigation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const onLogin = () => {
     Navigation.navigate("Home")
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        AsyncStorage.setItem('user', JSON.stringify(response.user))
          .then(() => {
            console.log('User saved to storage');
          })
          .catch(err => {
            console.log('Error saving user:', err);
          });
        console.log(response);


      })
      .catch(error => {
        console.log(error);
      });
  };
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          Navigation.navigate('Home');
        }
      } catch (err) {
        console.log('Error reading user from storage:', err);
      }
    };
    checkUser();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkContainer}
      onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>
          Don’t have an account? <Text style={styles.link}>Register</Text>
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
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: verticalScale(32),
    textAlign: 'center',
  },
  input: {
    height: verticalScale(48),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(16),
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#ff0050',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  loginButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  linkContainer: {
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

export default Login;
