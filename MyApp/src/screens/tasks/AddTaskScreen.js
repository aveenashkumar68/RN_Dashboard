import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskSchema } from '../../validation/schemas';
import { createTask } from '../../api/taskApi';
import { fetchProfile } from '../../api/profileApi';
import useAuthStore from '../../store/authStore';

const AddTaskScreen = ({ navigation }) => {
  const { user, profile: storeProfile } = useAuthStore();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user?.id),
    initialData: storeProfile,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      due_date: '2026-07-30',
      priority: 'medium',
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      createTask({
        ...data,
        user_id: profileQuery.data?.id,
        status: 'pending',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to create task. Try again.');
    },
  });

  const priorities = ['low', 'medium', 'high'];

  return (
    <ScrollView className="flex-1 bg-slate-50" keyboardShouldPersistTaps="handled">
      <View className="bg-white px-5 pt-14 pb-4 border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-2xl text-slate-600">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">New Task</Text>
      </View>

      <View className="px-5 py-6">
        {/* Title */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">Title</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-white border ${
                  errors.title ? 'border-red-400' : 'border-slate-200'
                } rounded-xl px-4 py-3.5 text-base text-slate-900`}
                placeholder="What needs to be done?"
                placeholderTextColor="#94A3B8"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.title.message}
            </Text>
          )}
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Description (optional)
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900"
                placeholder="Add some details..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ minHeight: 80 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>

        {/* Due Date */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Due Date
          </Text>
          <Controller
            control={control}
            name="due_date"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`bg-white border ${
                  errors.due_date ? 'border-red-400' : 'border-slate-200'
                } rounded-xl px-4 py-3.5 text-base text-slate-900`}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94A3B8"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.due_date && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.due_date.message}
            </Text>
          )}
        </View>

        {/* Priority */}
        <View className="mb-8">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            Priority
          </Text>
          <Controller
            control={control}
            name="priority"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row gap-3">
                {priorities.map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => onChange(p)}
                    className={`flex-1 py-3 rounded-xl items-center border ${
                      value === p
                        ? p === 'high'
                          ? 'bg-red-50 border-red-300'
                          : p === 'medium'
                          ? 'bg-amber-50 border-amber-300'
                          : 'bg-emerald-50 border-emerald-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium capitalize ${
                        value === p
                          ? p === 'high'
                            ? 'text-red-600'
                            : p === 'medium'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit((data) => mutation.mutate(data))}
          disabled={mutation.isPending}
          className="bg-indigo-600 py-4 rounded-xl items-center"
          activeOpacity={0.8}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Create Task
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddTaskScreen;
