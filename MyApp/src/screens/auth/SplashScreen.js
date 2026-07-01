import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants';

const SplashScreen = () => {
  return (
    <View className="flex-1 bg-indigo-600 justify-center items-center">
      <Text className="text-white text-4xl font-bold mb-2">TaxBuddy</Text>
      <Text className="text-indigo-200 text-base mb-8">
        Smart Tax Management
      </Text>
      <ActivityIndicator size="small" color="#fff" />
    </View>
  );
};

export default SplashScreen;
