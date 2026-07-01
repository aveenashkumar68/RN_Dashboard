let mockRefunds = [
  { id: '1', title: 'Federal Tax Refund', amount: 3250.00, status: 'processing', tax_year: '2025', created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: '2', title: 'State Tax Refund', amount: 1000.00, status: 'approved', tax_year: '2025', created_at: new Date(Date.now() - 3600000 * 120).toISOString() },
  { id: '3', title: 'Health Credit Refund', amount: 450.00, status: 'rejected', tax_year: '2024', created_at: new Date(Date.now() - 3600000 * 480).toISOString() },
];

export const fetchRefunds = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockRefunds;
};

export const fetchRefundById = async (refundId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockRefunds.find((r) => r.id === refundId) || null;
};

export const createRefund = async (refundData) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const newRefund = {
    id: Math.random().toString(),
    title: refundData.title || 'Tax Refund',
    amount: Number(refundData.amount) || 0,
    status: refundData.status || 'pending',
    tax_year: refundData.tax_year || '2025',
    created_at: new Date().toISOString(),
  };
  mockRefunds = [newRefund, ...mockRefunds];
  return newRefund;
};
