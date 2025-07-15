import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Home from './Screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for tab icons
import { Text, View } from 'react-native';
import Profile from './Screens/Profile';
import Upload from './Screens/Upload';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const DummyScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{title}</Text>
  </View>
);
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName = 'home-outline';

        switch (route.name) {
          case 'Home':
            iconName = 'home-outline';
            break;
          case 'Discover':
            iconName = 'search-outline';
            break;
          case 'Upload':
            iconName = 'add-circle-outline';
            break;
          case 'Notifications':
            iconName = 'notifications-outline';
            break;
          case 'Profile':
            iconName = 'person-outline';
            break;
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#ff0050',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen
      name="Discover"
      children={() => <DummyScreen title="Discover" />}
    />
    <Tab.Screen name="Upload" component={Upload} />
    <Tab.Screen
      name="Notifications"
      children={() => <DummyScreen title="Notifications" />}
    />
    <Tab.Screen name="Profile" component={Profile} />
  </Tab.Navigator>
);


const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
