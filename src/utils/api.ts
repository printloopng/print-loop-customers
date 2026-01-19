const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
});

const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const api = {
  get: (endpoint: string) => apiRequest(endpoint),

  post: (endpoint: string, data: any) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (endpoint: string, data: any) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: (endpoint: string, data: any) =>
    apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (endpoint: string) =>
    apiRequest(endpoint, {
      method: 'DELETE',
    }),
};

export const userApi = {
  getUsers: () => api.get('/users'),
  getUser: (id: string | number) => api.get(`/users/${id}`),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: string | number, userData: any) =>
    api.put(`/users/${id}`, userData),
  deleteUser: (id: string | number) => api.delete(`/users/${id}`),
};

export default api;
