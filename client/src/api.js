const BASE = '/api';

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  engineers: {
    list: (q) => request(`/engineers${q ? `?q=${encodeURIComponent(q)}` : ''}`),
    get: (id) => request(`/engineers/${id}`),
    related: (id) => request(`/engineers/${id}/related`),
    bridge: (fromId, toId) => request(`/engineers/${fromId}/bridge/${toId}`),
  },
  skills: {
    list: () => request('/skills'),
    get: (id) => request(`/skills/${id}`),
  },
  companies: {
    list: () => request('/companies'),
  },
  explore: {
    connectedSkills: () => request('/explore/skills/connected'),
    roles: () => request('/explore/roles'),
    matchRole: (id) => request(`/explore/roles/${id}/match`),
  },
};
