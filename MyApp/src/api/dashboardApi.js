const mockStats = {
  tax_score: 85,
  total_income: 125000.00,
  total_tax: 28450.00,
  total_refund: 4250.00,
  documents_count: 8,
  refund_status: 'processing',
};

const mockActivities = [
  { id: '1', title: 'W2 Document Uploaded', created_at: new Date(Date.now() - 3600000 * 2).toISOString(), icon: '📄' },
  { id: '2', title: 'Tax Return Filed', created_at: new Date(Date.now() - 3600000 * 24).toISOString(), icon: '📤' },
  { id: '3', title: 'Deductions Reviewed', created_at: new Date(Date.now() - 3600000 * 48).toISOString(), icon: '🔍' },
  { id: '4', title: 'Profile Info Updated', created_at: new Date(Date.now() - 3600000 * 72).toISOString(), icon: '👤' },
];

const mockDueDates = [
  { id: '1', title: 'Q2 Estimated Tax Payment', due_date: new Date(Date.now() + 3600000 * 240).toISOString(), status: 'pending' },
  { id: '2', title: 'Upload Missing 1099-INT', due_date: new Date(Date.now() + 3600000 * 480).toISOString(), status: 'pending' },
];

export const fetchDashboardStats = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockStats;
};

export const fetchRecentActivities = async (userId, limit = 10) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockActivities.slice(0, limit);
};

export const fetchDueDates = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockDueDates;
};
