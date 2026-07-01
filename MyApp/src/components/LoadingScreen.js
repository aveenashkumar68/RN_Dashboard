import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants';

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-slate-50">
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default LoadingScreen;
