// src/components/InfoCard.js
import React from 'react';
import { View, Text } from 'react-native';

export default function InfoCard({ title, icon: IconComponent, items }) {
  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
      {/* Card Header */}
      <View className="flex-row items-center border-b border-slate-100 pb-3 mb-3">
        {IconComponent && (
          <View className="mr-2">
            <IconComponent size={18} color="#4f46e5" />
          </View>
        )}
        <Text className="text-base font-bold text-slate-800">{title}</Text>
      </View>

      {/* Info Rows */}
      <View className="flex-col gap-y-3">
        {items.map((item, index) => (
          <View key={index} className="flex-row justify-between items-start">
            <Text className="text-sm text-slate-400 font-medium mr-4 flex-shrink-0">
              {item.label}
            </Text>
            <Text 
              className="text-sm text-slate-700 font-semibold text-right flex-1 select-all"
              numberOfLines={2}
            >
              {item.value || "—"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
