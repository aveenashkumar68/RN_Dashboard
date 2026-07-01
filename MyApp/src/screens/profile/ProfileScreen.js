import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchProfile, updateProfile } from '../../api/profileApi';
import { editProfileSchema } from '../../validation/schemas';
import { getInitials } from '../../utils/helpers';
import useAuthStore from '../../store/authStore';
import LoadingScreen from '../../components/LoadingScreen';

const ProfileScreen = () => {
  const { user, profile: storeProfile, updateProfileState, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user?.id),
    initialData: storeProfile,
  });

  const profile = profileQuery.data || storeProfile;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    values: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      updateProfile(profile?.id, {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        address: data.address,
      }),
    onSuccess: (updatedData) => {
      updateProfileState(updatedData);
      queryClient.invalidateQueries(['profile']);
      setEditing(false);
      Alert.alert('Success', 'Profile updated!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update profile.');
    },
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  if (profileQuery.isLoading) return <LoadingScreen />;

  const initials = getInitials(profile?.first_name, profile?.last_name);

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-indigo-600 pt-14 pb-12 items-center rounded-b-3xl">
        <View className="bg-white/20 w-20 h-20 rounded-full items-center justify-center mb-3">
          <Text className="text-white text-2xl font-bold">{initials}</Text>
        </View>
        <Text className="text-white text-xl font-bold">
          {profile?.first_name} {profile?.last_name}
        </Text>
        <Text className="text-indigo-200 text-sm mt-1">
          {profile?.email || 'user@example.com'}
        </Text>
      </View>

      <View className="px-5 -mt-6">
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-semibold text-slate-900">
              Personal Info
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (editing) {
                  reset();
                }
                setEditing(!editing);
              }}
            >
              <Text className="text-indigo-600 text-sm font-medium">
                {editing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {editing ? (
            <View>
              <View className="mb-3">
                <Text className="text-xs text-slate-500 mb-1">First Name</Text>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className={`border ${
                        errors.firstName ? 'border-red-400' : 'border-slate-200'
                      } rounded-xl px-4 py-3 text-sm text-slate-900`}
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.firstName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </Text>
                )}
              </View>

              <View className="mb-3">
                <Text className="text-xs text-slate-500 mb-1">Last Name</Text>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className={`border ${
                        errors.lastName ? 'border-red-400' : 'border-slate-200'
                      } rounded-xl px-4 py-3 text-sm text-slate-900`}
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.lastName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </Text>
                )}
              </View>

              <View className="mb-3">
                <Text className="text-xs text-slate-500 mb-1">Phone</Text>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                    />
                  )}
                />
              </View>

              <View className="mb-4">
                <Text className="text-xs text-slate-500 mb-1">Address</Text>
                <Controller
                  control={control}
                  name="address"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                      value={value}
                      onChangeText={onChange}
                      multiline
                    />
                  )}
                />
              </View>

              <TouchableOpacity
                onPress={handleSubmit((data) => updateMutation.mutate(data))}
                disabled={updateMutation.isPending}
                className="bg-indigo-600 py-3.5 rounded-xl items-center"
              >
                {updateMutation.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <ProfileRow label="First Name" value={profile?.first_name} />
              <ProfileRow label="Last Name" value={profile?.last_name} />
              <ProfileRow label="Phone" value={profile?.phone || 'Not set'} />
              <ProfileRow
                label="Address"
                value={profile?.address || 'Not set'}
                isLast
              />
            </View>
          )}
        </View>

        {/* Settings */}
        <View className="bg-white rounded-2xl shadow-sm mb-4">
          {[
            { icon: '🔔', label: 'Notifications', onPress: () => {} },
            { icon: '🔒', label: 'Privacy', onPress: () => {} },
            { icon: '❓', label: 'Help & Support', onPress: () => {} },
          ].map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center px-5 py-4 ${
                idx < 2 ? 'border-b border-slate-100' : ''
              }`}
            >
              <Text className="text-lg mr-3">{item.icon}</Text>
              <Text className="flex-1 text-sm text-slate-800">{item.label}</Text>
              <Text className="text-slate-300">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-white rounded-2xl py-4 items-center mb-10 shadow-sm"
        >
          <Text className="text-red-500 font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const ProfileRow = ({ label, value, isLast }) => (
  <View
    className={`py-3 ${!isLast ? 'border-b border-slate-50' : ''}`}
  >
    <Text className="text-xs text-slate-400 mb-1">{label}</Text>
    <Text className="text-sm text-slate-800">{value || '-'}</Text>
  </View>
);

export default ProfileScreen;
