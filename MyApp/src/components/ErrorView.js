import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ErrorView = ({ message, onRetry }) => {
  return (
    <View className="flex-1 justify-center items-center px-8">
      <Text className="text-4xl mb-4">⚠️</Text>
      <Text className="text-base font-medium text-slate-800 text-center mb-2">
        Something went wrong
      </Text>
      <Text className="text-sm text-slate-500 text-center mb-6">
        {message || 'An unexpected error occurred. Please try again.'}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-indigo-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorView;
