let localProfile = {
  id: 'prof_123456',
  clerk_user_id: 'usr_123456',
  first_name: 'Aveenash',
  last_name: 'Kumar',
  email: 'aveenash@example.com',
  phone: '+1 (555) 019-2834',
  address: '123 Tax Ave, Suite 100, San Francisco, CA',
};

export const fetchProfile = async (userId) => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 300));
  return localProfile;
};

export const updateProfile = async (profileId, updates) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  localProfile = {
    ...localProfile,
    first_name: updates.first_name ?? localProfile.first_name,
    last_name: updates.last_name ?? localProfile.last_name,
    phone: updates.phone ?? localProfile.phone,
    address: updates.address ?? localProfile.address,
  };
  return localProfile;
};

export const createProfile = async (profileData) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  localProfile = {
    id: 'prof_' + Date.now(),
    clerk_user_id: profileData.clerk_user_id || 'usr_123',
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    email: profileData.email,
    phone: '',
    address: '',
  };
  return localProfile;
};
