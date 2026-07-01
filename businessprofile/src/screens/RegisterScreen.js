import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    // Dummy registration success
    navigation.reset({
      index: 0,
      routes: [{ name: 'BusinessProfile' }],
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="px-6"
      >
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <View className="mb-6 items-center">
            <Text className="text-2xl font-black text-slate-800">Create Account</Text>
            <Text className="text-xs text-slate-400 font-semibold mt-1">Register your GST-registered company</Text>
          </View>

          <View className="gap-y-4">
            <View>
              <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Full Name</Text>
              <TextInput
                placeholder="Aravind Sharma"
                value={fullName}
                onChangeText={setFullName}
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
              />
            </View>

            <View>
              <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Email Address</Text>
              <TextInput
                placeholder="name@company.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
              />
            </View>

            <View className="flex-row gap-x-2">
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Password</Text>
                <TextInput
                  placeholder="••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-bold mb-1.5 uppercase">Confirm</Text>
                <TextInput
                  placeholder="••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  className="border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 bg-slate-50/50 font-medium"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              activeOpacity={0.8}
              className="bg-indigo-600 p-3.5 rounded-xl mt-4 items-center justify-center shadow-md shadow-indigo-150"
            >
              <Text className="text-white font-bold text-sm">Register</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-xs text-slate-400 font-bold">Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')} className="ml-1">
                <Text className="text-xs font-black text-indigo-600">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
