let mockNotifications = [
  { id: '1', title: 'Refund status updated', message: 'Your Federal Refund status is now Processing.', read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', title: 'New Task Due soon', message: 'Upload W-2 forms is due in 3 days.', read: false, created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: '3', title: 'Welcome to TaxBuddy', message: 'We are glad to help you manage your taxes.', read: true, created_at: new Date(Date.now() - 3600000 * 240).toISOString() },
];

export const fetchNotifications = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockNotifications;
};

export const markAsRead = async (notificationId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  mockNotifications = mockNotifications.map((n) =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  return mockNotifications.find((n) => n.id === notificationId);
};

export const markAllAsRead = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  mockNotifications = mockNotifications.map((n) => ({ ...n, read: true }));
};
