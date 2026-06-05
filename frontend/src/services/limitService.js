import { api } from './api';

export const limitService = {
  async create(data) {
    const response = await api.post('/limits', data);
    return response.data;
  },

  async getByMonth(referenceMonth) {
    const response = await api.get('/limits', {
      params: { referenceMonth },
    });
    return response.data;
  },

  async update(limitId, data) {
    const response = await api.put(`/limits/${limitId}`, data);
    return response.data;
  },

  async remove(limitId) {
    await api.delete(`/limits/${limitId}`);
  },
};
