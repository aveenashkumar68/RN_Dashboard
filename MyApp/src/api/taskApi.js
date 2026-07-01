let mockTasks = [
  { id: '1', title: 'Upload W-2 forms', description: 'Need to upload W-2 forms from last employer.', due_date: '2026-07-15', priority: 'high', status: 'pending', created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: '2', title: 'Review business deductions', description: 'Review receipts from Q1 business travel.', due_date: '2026-07-20', priority: 'medium', status: 'pending', created_at: new Date(Date.now() - 3600000 * 48).toISOString() },
  { id: '3', title: 'Submit 1099-MISC', description: 'Submit independent contractor payments info.', due_date: '2026-06-15', priority: 'low', status: 'completed', created_at: new Date(Date.now() - 3600000 * 120).toISOString() },
];

export const fetchTasks = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockTasks;
};

export const fetchTaskById = async (taskId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockTasks.find((t) => t.id === taskId) || null;
};

export const createTask = async (taskData) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const newTask = {
    id: Math.random().toString(),
    title: taskData.title,
    description: taskData.description || '',
    due_date: taskData.due_date,
    priority: taskData.priority || 'medium',
    status: taskData.status || 'pending',
    created_at: new Date().toISOString(),
  };
  mockTasks = [newTask, ...mockTasks];
  return newTask;
};

export const updateTask = async (taskId, updates) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  mockTasks = mockTasks.map((t) =>
    t.id === taskId ? { ...t, ...updates } : t
  );
  return mockTasks.find((t) => t.id === taskId);
};

export const deleteTask = async (taskId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  mockTasks = mockTasks.filter((t) => t.id !== taskId);
};
