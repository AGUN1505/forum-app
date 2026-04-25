const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const getToken = () => localStorage.getItem('token');

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  const data = await response.json();
  if (data.status !== 'success') throw new Error(data.message);
  return data.data;
};

export const api = {
  register: (name, email, password) => fetchWithAuth('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }),

  login: (email, password) => fetchWithAuth('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  getUsers: () => fetchWithAuth('/users'),
  getProfile: () => fetchWithAuth('/users/me'),

  getThreads: () => fetchWithAuth('/threads'),
  getThreadDetail: (threadId) => fetchWithAuth(`/threads/${threadId}`),
  createThread: (title, body, category) => fetchWithAuth('/threads', {
    method: 'POST',
    body: JSON.stringify({ title, body, category }),
  }),

  createComment: (threadId, content) => fetchWithAuth(`/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  upvoteThread: (threadId) => fetchWithAuth(`/threads/${threadId}/up-vote`, { method: 'POST' }),
  downvoteThread: (threadId) => fetchWithAuth(`/threads/${threadId}/down-vote`, { method: 'POST' }),
  neutralvoteThread: (threadId) => fetchWithAuth(`/threads/${threadId}/neutral-vote`, { method: 'POST' }),

  upvoteComment: (threadId, commentId) => fetchWithAuth(
    `/threads/${threadId}/comments/${commentId}/up-vote`,
    { method: 'POST' },
  ),
  downvoteComment: (threadId, commentId) => fetchWithAuth(
    `/threads/${threadId}/comments/${commentId}/down-vote`,
    { method: 'POST' },
  ),
  neutralvoteComment: (threadId, commentId) => fetchWithAuth(
    `/threads/${threadId}/comments/${commentId}/neutral-vote`,
    { method: 'POST' },
  ),

  getLeaderboards: () => fetchWithAuth('/leaderboards'),
};
