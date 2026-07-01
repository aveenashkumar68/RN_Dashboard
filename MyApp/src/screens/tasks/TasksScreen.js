import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, updateTask, deleteTask } from '../../api/taskApi';
import { fetchProfile } from '../../api/profileApi';
import { sortTasks } from '../../utils/sorting';
import { formatDate } from '../../utils/helpers';
import useTaskStore from '../../store/taskStore';
import useAuthStore from '../../store/authStore';
import LoadingScreen from '../../components/LoadingScreen';
import EmptyState from '../../components/EmptyState';
import ErrorView from '../../components/ErrorView';

const TasksScreen = ({ navigation }) => {
  const { user, profile: storeProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const { sortBy, setSortBy } = useTaskStore();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user?.id),
    initialData: storeProfile,
  });

  const tasksQuery = useQuery({
    queryKey: ['tasks', profileQuery.data?.id],
    queryFn: () => fetchTasks(profileQuery.data?.id),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ taskId, status }) => updateTask(taskId, { status }),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId) => deleteTask(taskId),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  const tasks = tasksQuery.data || [];
  const sorted = sortTasks(tasks, sortBy);

  const handleToggle = (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    toggleMutation.mutate({ taskId: task.id, status: newStatus });
  };

  const handleDelete = (taskId) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(taskId),
      },
    ]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  if (tasksQuery.isLoading) return <LoadingScreen />;
  if (tasksQuery.isError) {
    return (
      <ErrorView
        message="Failed to load tasks"
        onRetry={() => tasksQuery.refetch()}
      />
    );
  }

  const renderTaskItem = ({ item }) => {
    const isDone = item.status === 'completed';
    return (
      <View className="bg-white rounded-2xl p-4 mb-3 mx-5 shadow-sm">
        <View className="flex-row items-start">
          <TouchableOpacity
            onPress={() => handleToggle(item)}
            className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 mt-0.5 ${
              isDone ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
            }`}
          >
            {isDone && <Text className="text-white text-xs">✓</Text>}
          </TouchableOpacity>

          <View className="flex-1">
            <Text
              className={`text-base font-medium ${
                isDone ? 'text-slate-400 line-through' : 'text-slate-900'
              }`}
            >
              {item.title}
            </Text>
            {item.description && (
              <Text className="text-xs text-slate-400 mt-1" numberOfLines={2}>
                {item.description}
              </Text>
            )}
            <View className="flex-row items-center mt-2 gap-2">
              {item.due_date && (
                <Text className="text-xs text-slate-400">
                  📅 {formatDate(item.due_date)}
                </Text>
              )}
              {item.priority && (
                <View
                  className={`${getPriorityColor(item.priority)} px-2 py-0.5 rounded-full`}
                >
                  <Text className="text-[10px] text-white font-medium capitalize">
                    {item.priority}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            className="p-2"
          >
            <Text className="text-slate-300 text-lg">🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-4 border-b border-slate-100 flex-row justify-between items-end">
        <View>
          <Text className="text-2xl font-bold text-slate-900">Tasks</Text>
          <Text className="text-sm text-slate-500 mt-1">
            {tasks.filter((t) => t.status !== 'completed').length} pending
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddTask')}
          className="bg-indigo-600 px-4 py-2.5 rounded-xl"
        >
          <Text className="text-white text-sm font-semibold">+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Sort */}
      <View className="px-5 py-3 flex-row gap-2">
        {[
          { key: 'pending_first', label: 'Pending First' },
          { key: 'completed_first', label: 'Done First' },
        ].map((opt) => (
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

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTaskItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <EmptyState
            icon="✅"
            title="No tasks"
            subtitle="Add your first task to get started"
            actionLabel="Add Task"
            onAction={() => navigation.navigate('AddTask')}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={tasksQuery.isRefetching}
            onRefresh={() => tasksQuery.refetch()}
          />
        }
      />
    </View>
  );
};

export default TasksScreen;
