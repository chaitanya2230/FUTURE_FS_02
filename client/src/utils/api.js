const API_BASE = '/api';

export const API_ROUTES = {
  login: `${API_BASE}/auth/login`,
  register: `${API_BASE}/auth/register`,
  leads: `${API_BASE}/leads`,
  leadDetail: (id) => `${API_BASE}/leads/${id}`,
};
