import { api } from './api';

export const expenseService = {
  async create(data) {
    const response = await api.post('/expenses', data);
    return response.data;
  },

  async listByMonth(referenceMonth) {
    const response = await api.get('/expenses', {
      params: { referenceMonth },
    });
    return response.data;
  },

  async update(expenseId, data) {
    const response = await api.put(`/expenses/${expenseId}`, data);
    return response.data;
  },

  async remove(expenseId) {
    await api.delete(`/expenses/${expenseId}`);
  },
};
