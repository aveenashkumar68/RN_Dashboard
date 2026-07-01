import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchRefunds } from '../../api/refundApi';
import { fetchProfile } from '../../api/profileApi';
import { sortByAmount, sortByDate } from '../../utils/sorting';
import { formatCurrency, formatDate } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import LoadingScreen from '../../components/LoadingScreen';
import EmptyState from '../../components/EmptyState';
import ErrorView from '../../components/ErrorView';

const RefundsScreen = () => {
  const { user, profile: storeProfile } = useAuthStore();
  const [sortBy, setSortBy] = useState('newest');

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user?.id),
    initialData: storeProfile,
  });

  const refundsQuery = useQuery({
    queryKey: ['refunds', profileQuery.data?.id],
    queryFn: () => fetchRefunds(profileQuery.data?.id),
  });

  const refunds = refundsQuery.data || [];

  const sortedRefunds = (() => {
    switch (sortBy) {
      case 'highest':
        return sortByAmount(refunds, 'highest');
      case 'lowest':
        return sortByAmount(refunds, 'lowest');
      case 'oldest':
        return sortByDate(refunds, 'oldest');
      default:
        return sortByDate(refunds, 'newest');
    }
  })();

  const sortOptions = [
    { key: 'newest', label: 'Newest' },
    { key: 'oldest', label: 'Oldest' },
    { key: 'highest', label: 'Highest' },
    { key: 'lowest', label: 'Lowest' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'processing':
        return { bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'rejected':
        return { bg: 'bg-red-50', text: 'text-red-600' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-600' };
    }
  };

  if (refundsQuery.isLoading) return <LoadingScreen />;
  if (refundsQuery.isError) {
    return (
      <ErrorView
        message="Failed to load refunds"
        onRetry={() => refundsQuery.refetch()}
      />
    );
  }

  const renderRefundItem = ({ item }) => {
    const statusStyle = getStatusColor(item.status);
    return (
      <View className="bg-white rounded-2xl p-4 mb-3 mx-5 shadow-sm">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-3">
            <Text className="text-base font-semibold text-slate-900">
              {item.title || 'Tax Refund'}
            </Text>
            <Text className="text-xs text-slate-400 mt-1">
              {formatDate(item.created_at)}
            </Text>
          </View>
          <Text className="text-lg font-bold text-slate-900">
            {formatCurrency(item.amount)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <View className={`${statusStyle.bg} px-3 py-1 rounded-full`}>
            <Text className={`text-xs font-medium capitalize ${statusStyle.text}`}>
              {item.status}
            </Text>
          </View>
          {item.tax_year && (
            <Text className="text-xs text-slate-400">FY {item.tax_year}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-4 border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-900">Refunds</Text>
        <Text className="text-sm text-slate-500 mt-1">
          Track your tax refund status
        </Text>
      </View>

      {/* Sort Options */}
      <View className="px-5 py-3">
        <View className="flex-row gap-2">
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setSortBy(opt.key)}
              className={`px-4 py-2 rounded-full ${
                sortBy === opt.key ? 'bg-indigo-600' : 'bg-white'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  sortBy === opt.key ? 'text-white' : 'text-slate-600'
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Refund List */}
      <FlatList
        data={sortedRefunds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRefundItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <EmptyState
            icon="💸"
            title="No refunds yet"
            subtitle="Your tax refund records will appear here"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refundsQuery.isRefetching}
            onRefresh={() => refundsQuery.refetch()}
          />
        }
      />
    </View>
  );
};

export default RefundsScreen;
