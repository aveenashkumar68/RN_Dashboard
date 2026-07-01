import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function QuickActionCard({ label, icon: IconComponent, colorScheme = 'indigo', onPress }) {
  // Pre-configured themes matching fintech branding accents
  const themes = {
    blue: {
      bg: 'bg-blue-50/60',
      border: 'border-blue-100/50',
      iconColor: '#0284c7',
    },
    emerald: {
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-100/50',
      iconColor: '#10b981',
    },
    indigo: {
      bg: 'bg-indigo-50/60',
      border: 'border-indigo-100/50',
      iconColor: '#4f46e5',
    },
    amber: {
      bg: 'bg-amber-50/60',
      border: 'border-amber-100/50',
      iconColor: '#d97706',
    },
    violet: {
      bg: 'bg-violet-50/60',
      border: 'border-violet-100/50',
      iconColor: '#8b5cf6',
    },
  };

  const activeTheme = themes[colorScheme] || themes.indigo;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-col items-center justify-center p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm"
      style={styles.card}
    >
      {/* Icon Circle */}
      <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-2.5 ${activeTheme.bg} border ${activeTheme.border}`}>
        {IconComponent && <IconComponent size={22} color={activeTheme.iconColor} />}
      </View>

      {/* Action Title */}
      <Text 
        className="text-[11px] font-bold text-slate-700 text-center tracking-tight" 
        numberOfLines={2}
        style={styles.label}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    margin: '1%',
  },
  label: {
    lineHeight: 14,
  },
});

