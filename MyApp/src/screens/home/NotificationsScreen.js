import React from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markAsRead, markAllAsRead } from '../../api/notificationApi';
import { fetchProfile } from '../../api/profileApi';
import { timeAgo } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import LoadingScreen from '../../components/LoadingScreen';
import EmptyState from '../../components/EmptyState';
import ErrorView from '../../components/ErrorView';

const NotificationsScreen = ({ navigation }) => {
  const { user, profile: storeProfile } = useAuthStore();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user?.id),
    initialData: storeProfile,
  });

  const notificationsQuery = useQuery({
    queryKey: ['notifications', profileQuery.data?.id],
    queryFn: () => fetchNotifications(profileQuery.data?.id),
  });

  const readMutation = useMutation({
    mutationFn: (id) => markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  });

  const readAllMutation = useMutation({
    mutationFn: () => markAllAsRead(profileQuery.data?.id),
    onSuccess: () => queryClient.invalidateQueries(['notifications']),
  });

  const notifications = notificationsQuery.data || [];

  if (notificationsQuery.isLoading) return <LoadingScreen />;
  if (notificationsQuery.isError) {
    return (
      <ErrorView
        message="Failed to load notifications"
        onRetry={() => notificationsQuery.refetch()}
      />
    );
  }

  const handleMarkRead = (id) => {
    readMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    readAllMutation.mutate();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => !item.read && handleMarkRead(item.id)}
      className={`p-4 border-b border-slate-100 flex-row items-start ${
        item.read ? 'bg-white' : 'bg-indigo-50/30'
      }`}
    >
      <View className="bg-indigo-100 p-2 rounded-full mr-3">
        <Text className="text-lg">📢</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className={`text-sm ${item.read ? 'font-normal text-slate-700' : 'font-semibold text-slate-900'}`}>
            {item.title}
          </Text>
          {!item.read && (
            <View className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
          )}
        </View>
        <Text className="text-xs text-slate-500 mb-1">{item.message}</Text>
        <Text className="text-[10px] text-slate-400">{timeAgo(item.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-4 border-b border-slate-100 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Text className="text-2xl text-slate-600">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-900">Notifications</Text>
        </View>
        {notifications.some((n) => !n.read) && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text className="text-sm font-semibold text-indigo-600">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="🔔"
            title="All caught up!"
            subtitle="You have no notifications at the moment."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={notificationsQuery.isRefetching}
            onRefresh={() => notificationsQuery.refetch()}
          />
        }
      />
    </View>
  );
};

export default NotificationsScreen;
