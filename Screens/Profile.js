import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setUserData(user);
          setName(user.name || '');
          setPhone(user.phoneNumber || '');
          setEmailVerified(user.emailVerified || false);
        }
      } catch (e) {
        console.error('Error reading user data:', e);
        Alert.alert('Error', 'Failed to load profile data');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            navigation.replace('Login');
          } catch (error) {
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty');
      return;
    }

    if (phone && !/^\d{10,15}$/.test(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      const updates = {
        name: name.trim(),
        phoneNumber: phone.trim() || null,
      };

      const updatedUser = { ...userData, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUserData(updatedUser);

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = () => {
    Alert.alert('Check your email', 'Verification email has been resent');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile Settings</Text>
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                userData?.photoURL ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon} onPress={handleEditToggle}>
            <Icon
              name={isEditing ? 'close' : 'edit'}
              size={moderateScale(20)}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.emailContainer}>
              <Text style={styles.value}>{userData?.email || 'N/A'}</Text>
              {!emailVerified && (
                <TouchableOpacity onPress={handleResendVerification}>
                  <Text style={styles.verifyText}>Verify Email</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                autoCapitalize="words"
              />
            ) : (
              <Text style={styles.value}>{userData?.name || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                maxLength={15}
              />
            ) : (
              <Text style={styles.value}>
                {userData?.phoneNumber || 'Not set'}
              </Text>
            )}
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={moderateScale(18)} color="#ff5555" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: scale(20),
    backgroundColor: '#f8f9fa',
    paddingTop: verticalScale(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#2c3e50',
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: verticalScale(30),
  },
  avatar: {
    width: scale(130),
    height: scale(130),
    borderRadius: scale(65),
    borderWidth: 3,
    borderColor: '#4b7bec',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4b7bec',
    borderRadius: scale(20),
    padding: scale(8),
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: scale(16),
    padding: scale(20),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: moderateScale(14),
    color: '#7f8c8d',
    marginBottom: verticalScale(4),
  },
  value: {
    fontSize: moderateScale(16),
    color: '#2c3e50',
    fontWeight: '500',
  },
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifyText: {
    color: '#3498db',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  input: {
    fontSize: moderateScale(16),
    color: '#2c3e50',
    fontWeight: '500',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: verticalScale(8),
    paddingHorizontal: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginVertical: verticalScale(10),
  },
  updateButton: {
    backgroundColor: '#4b7bec',
    paddingVertical: verticalScale(14),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: '#ffdddd',
    backgroundColor: '#fff',
    marginTop: verticalScale(10),
  },
  logoutButtonText: {
    color: '#ff5555',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: scale(8),
  },
});

export default Profile;
