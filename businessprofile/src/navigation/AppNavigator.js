import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BusinessProfileScreen from '../screens/BusinessProfileScreen';

const Stack = createNativeStackNavigator();

function LogoutButton({ navigation }) {
  return (
    <TouchableOpacity 
      onPress={() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }}
      activeOpacity={0.7}
    >
      <Text className="text-sm font-bold text-rose-500 mr-2">Logout</Text>
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="BusinessProfile" 
        component={BusinessProfileScreen} 
        options={({ navigation }) => ({
          title: "Business Profile",
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#1e293b',
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
          // eslint-disable-next-line react/no-unstable-nested-components
          headerRight: () => <LogoutButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}
