const API_URL = 'http://localhost:9500/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const api = {
  auth: {
    login: (credentials: any) => 
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }).then(handleResponse),
    register: (data: any) =>
      fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(handleResponse),
    getUsers: (token: string) => 
      fetch(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(handleResponse),
    updateUser: (id: string, data: any, token: string) =>
      fetch(`${API_URL}/auth/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      }).then(handleResponse),
    deleteUser: (id: string, token: string) =>
      fetch(`${API_URL}/auth/users/${id}`, { 
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).then(handleResponse),
    getProfile: (token: string) =>
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(handleResponse)
  },
  rooms: {
    getAll: () => fetch(`${API_URL}/rooms`).then(handleResponse),
    getById: (id: string) => fetch(`${API_URL}/rooms/${id}`).then(handleResponse),
    create: (data: any) =>
      fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(handleResponse),
    update: (id: string, data: any) =>
      fetch(`${API_URL}/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(handleResponse),
    delete: (id: string) =>
      fetch(`${API_URL}/rooms/${id}`, { method: 'DELETE' }).then(handleResponse)
  },
  designs: {
    getAll: () => fetch(`${API_URL}/designs`).then(handleResponse),
    create: (data: any) =>
      fetch(`${API_URL}/designs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(handleResponse),
    delete: (id: string) =>
      fetch(`${API_URL}/designs/${id}`, { method: 'DELETE' }).then(handleResponse)
  },
  furniture: {
    getByRoom: (roomId: string) => fetch(`${API_URL}/furniture/room/${roomId}`).then(handleResponse),
    add: (data: any) =>
      fetch(`${API_URL}/furniture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(handleResponse),
    update: (id: string, data: any) =>
      fetch(`${API_URL}/furniture/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(handleResponse),
    remove: (id: string) =>
      fetch(`${API_URL}/furniture/${id}`, { method: 'DELETE' }).then(handleResponse)
  }
};
