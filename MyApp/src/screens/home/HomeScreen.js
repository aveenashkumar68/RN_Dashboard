import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchRecentActivities, fetchDueDates } from '../../api/dashboardApi';
import { fetchProfile } from '../../api/profileApi';
import useDashboardStore from '../../store/dashboardStore';
import useAuthStore from '../../store/authStore';
import { getGreeting, formatCurrency, formatDate, timeAgo } from '../../utils/helpers';
import { sortByDate } from '../../utils/sorting';
import { COLORS } from '../../constants';
import ErrorView from '../../components/ErrorView';

const HomeScreen = ({ navigation }) => {
  const { user, profile: storeProfile } = useAuthStore();
  const { searchQuery, setSearchQuery } = useDashboardStore();
  const [activitySort, setActivitySort] = useState('newest');

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user?.id),
    initialData: storeProfile,
  });

  const statsQuery = useQuery({
    queryKey: ['dashboardStats', profileQuery.data?.id],
    queryFn: () => fetchDashboardStats(profileQuery.data?.id),
  });

  const activitiesQuery = useQuery({
    queryKey: ['activities', profileQuery.data?.id],
    queryFn: () => fetchRecentActivities(profileQuery.data?.id),
  });

  const dueDatesQuery = useQuery({
    queryKey: ['dueDates', profileQuery.data?.id],
    queryFn: () => fetchDueDates(profileQuery.data?.id),
  });

  const isLoading = profileQuery.isLoading || statsQuery.isLoading;
  const hasError = profileQuery.isError || statsQuery.isError;

  const profile = profileQuery.data || storeProfile;
  const stats = statsQuery.data;
  const activities = activitiesQuery.data || [];
  const dueDates = dueDatesQuery.data || [];

  const sortedActivities = sortByDate(activities, activitySort);
  const filteredActivities = searchQuery
    ? sortedActivities.filter((a) =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedActivities;

  const onRefresh = () => {
    profileQuery.refetch();
    statsQuery.refetch();
    activitiesQuery.refetch();
    dueDatesQuery.refetch();
  };

  if (hasError) {
    return <ErrorView message="Failed to load dashboard" onRetry={onRefresh} />;
  }

  const taxScore = stats?.tax_score || 85;
  const firstName = profile?.first_name || user?.firstName || 'there';

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="bg-indigo-600 pt-14 pb-8 px-5 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-5">
          <View>
            <Text className="text-indigo-200 text-sm">{getGreeting()}</Text>
            <Text className="text-white text-xl font-bold">{firstName} 👋</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            className="bg-indigo-500/30 w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white text-lg">🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="bg-indigo-500/30 rounded-xl flex-row items-center px-4 py-3">
          <Text className="mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-white text-sm"
            placeholder="Search activities, tasks..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="px-5 -mt-4">
        {/* Tax Score Card */}
        <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <Text className="text-slate-500 text-sm mb-3">Tax Health Score</Text>
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-4xl font-bold text-slate-900">
                {taxScore}
              </Text>
              <Text className="text-xs text-slate-400 mt-1">out of 100</Text>
            </View>
            <View
              className={`px-3 py-1.5 rounded-full ${
                taxScore >= 70
                  ? 'bg-emerald-50'
                  : taxScore >= 40
                  ? 'bg-amber-50'
                  : 'bg-red-50'
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  taxScore >= 70
                    ? 'text-emerald-600'
                    : taxScore >= 40
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                {taxScore >= 70 ? 'Good' : taxScore >= 40 ? 'Fair' : 'Needs Work'}
              </Text>
            </View>
          </View>
          {/* Progress bar */}
          <View className="bg-slate-100 h-2 rounded-full mt-4">
            <View
              className={`h-2 rounded-full ${
                taxScore >= 70
                  ? 'bg-emerald-500'
                  : taxScore >= 40
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${taxScore}%` }}
            />
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-2xl mb-1">💰</Text>
            <Text className="text-lg font-bold text-slate-900">
              {formatCurrency(stats?.total_income || 125000)}
            </Text>
            <Text className="text-xs text-slate-400">Total Income</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-2xl mb-1">📊</Text>
            <Text className="text-lg font-bold text-slate-900">
              {formatCurrency(stats?.total_tax || 28450)}
            </Text>
            <Text className="text-xs text-slate-400">Tax Liability</Text>
          </View>
        </View>

        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-2xl mb-1">💸</Text>
            <Text className="text-lg font-bold text-emerald-600">
              {formatCurrency(stats?.total_refund || 4250)}
            </Text>
            <Text className="text-xs text-slate-400">Refund Expected</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-2xl mb-1">📁</Text>
            <Text className="text-lg font-bold text-slate-900">
              {stats?.documents_count || 8}
            </Text>
            <Text className="text-xs text-slate-400">Documents</Text>
          </View>
        </View>

        {/* Refund Tracker */}
        {stats?.refund_status && (
          <View className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
            <Text className="text-base font-semibold text-slate-900 mb-4">
              Refund Tracker
            </Text>
            <View className="flex-row justify-between">
              {['Filed', 'Processing', 'Approved', 'Deposited'].map(
                (step, idx) => {
                  const stepNum = idx + 1;
                  const currentStep =
                    stats.refund_status === 'filed'
                      ? 1
                      : stats.refund_status === 'processing'
                      ? 2
                      : stats.refund_status === 'approved'
                      ? 3
                      : 4;
                  const isActive = stepNum <= currentStep;

                  return (
                    <View key={step} className="items-center flex-1">
                      <View
                        className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
                          isActive ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {stepNum}
                        </Text>
                      </View>
                      <Text className="text-[10px] text-slate-500">{step}</Text>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        )}

        {/* Due Dates */}
        {dueDates.length > 0 && (
          <View className="mb-6">
            <Text className="text-base font-semibold text-slate-900 mb-3">
              Upcoming Due Dates
            </Text>
            {dueDates.map((item) => (
              <View
                key={item.id}
                className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm"
              >
                <View className="bg-amber-50 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text>📅</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-800">
                    {item.title}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    {formatDate(item.due_date)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-slate-900 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { icon: '📝', label: 'New Task', screen: 'TasksTab' },
              { icon: '💰', label: 'Refunds', screen: 'Refunds' },
              { icon: '👤', label: 'Profile', screen: 'Profile' },
              { icon: '📄', label: 'Documents', screen: 'HomeTab' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => navigation.navigate(action.screen)}
                className="bg-white rounded-xl p-4 items-center shadow-sm"
                style={{ width: '47%' }}
              >
                <Text className="text-2xl mb-2">{action.icon}</Text>
                <Text className="text-sm font-medium text-slate-700">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-slate-900">
              Recent Activity
            </Text>
            <TouchableOpacity
              onPress={() =>
                setActivitySort(activitySort === 'newest' ? 'oldest' : 'newest')
              }
            >
              <Text className="text-xs text-indigo-600 font-medium">
                {activitySort === 'newest' ? '↓ Newest' : '↑ Oldest'}
              </Text>
            </TouchableOpacity>
          </View>

          {activitiesQuery.isLoading ? (
            <ActivityIndicator color={COLORS.primary} />
          ) : filteredActivities.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center">
              <Text className="text-slate-400 text-sm">No activities yet</Text>
            </View>
          ) : (
            filteredActivities.slice(0, 5).map((activity) => (
              <View
                key={activity.id}
                className="bg-white rounded-xl p-4 mb-2 flex-row items-center shadow-sm"
              >
                <View className="bg-indigo-50 w-10 h-10 rounded-full items-center justify-center mr-3">
                  <Text>{activity.icon || '📋'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-slate-800">
                    {activity.title}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    {timeAgo(activity.created_at)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* AI Assistant FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-indigo-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <Text className="text-white text-2xl">🤖</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;
