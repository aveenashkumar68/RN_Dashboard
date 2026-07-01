import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }) => {
  return (
    <View className="flex-1 justify-center items-center px-8 py-12">
      {icon && (
        <Text className="text-5xl mb-4">{icon}</Text>
      )}
      <Text className="text-lg font-semibold text-slate-800 text-center mb-2">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-sm text-slate-500 text-center mb-6">
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="bg-indigo-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-medium">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
