// src/components/StatCard.js
import React from 'react';
import { View, Text } from 'react-native';

export default function StatCard({ label, value, icon: IconComponent, colorScheme = 'indigo' }) {
  // Tailored themes for modern visual accents
  const themes = {
    blue: {
      bg: 'bg-blue-50/50',
      border: 'border-blue-100',
      iconColor: '#0284c7',
    },
    emerald: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-100',
      iconColor: '#10b981',
    },
    indigo: {
      bg: 'bg-indigo-50/50',
      border: 'border-indigo-100',
      iconColor: '#4f46e5',
    },
    violet: {
      bg: 'bg-violet-50/50',
      border: 'border-violet-100',
      iconColor: '#8b5cf6',
    },
    amber: {
      bg: 'bg-amber-50/50',
      border: 'border-amber-100',
      iconColor: '#d97706',
    },
    slate: {
      bg: 'bg-slate-50/50',
      border: 'border-slate-100',
      iconColor: '#475569',
    }
  };

  const activeTheme = themes[colorScheme] || themes.indigo;

  return (
    <View className="flex-1 bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex-row items-center justify-between">
      <View className="flex-1 mr-2">
        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1" numberOfLines={1}>
          {label}
        </Text>
        <Text className="text-lg font-extrabold text-slate-800" numberOfLines={1}>
          {value}
        </Text>
      </View>
      {IconComponent && (
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${activeTheme.bg} border ${activeTheme.border}`}>
          <IconComponent size={20} color={activeTheme.iconColor} />
        </View>
      )}
    </View>
  );
}
