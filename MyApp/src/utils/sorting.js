export const sortByDate = (items, order = 'newest') => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
};

export const sortByAmount = (items, order = 'highest') => {
  return [...items].sort((a, b) => {
    return order === 'highest' ? b.amount - a.amount : a.amount - b.amount;
  });
};

export const sortTasks = (tasks, sortBy = 'pending_first') => {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'pending_first') {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === 'completed_first') {
      if (a.status === 'completed' && b.status !== 'completed') return -1;
      if (a.status !== 'completed' && b.status === 'completed') return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });
};
