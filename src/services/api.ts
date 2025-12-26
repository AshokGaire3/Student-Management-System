const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to set auth token
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  register: async (userData: any) => {
    const response = await apiRequest<{ token: string; user: any; student: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response.token) {
      setToken(response.token);
    }
    return response;
  },

  getCurrentUser: async () => {
    return apiRequest<{ user: any }>('/auth/me');
  },

  logout: () => {
    removeToken();
  },
};

// Students API
export const studentsAPI = {
  getAll: () => apiRequest<any[]>('/students'),
  getById: (id: string) => apiRequest<any>(`/students/${id}`),
  create: (student: any) => apiRequest<any>('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  }),
  update: (id: string, student: any) => apiRequest<any>(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(student),
  }),
  delete: (id: string) => apiRequest<{ message: string }>(`/students/${id}`, {
    method: 'DELETE',
  }),
};

// Courses API
export const coursesAPI = {
  getAll: () => apiRequest<any[]>('/courses'),
  getById: (id: string) => apiRequest<any>(`/courses/${id}`),
  getByMajor: (majorId: string) => apiRequest<any[]>(`/courses/major/${majorId}`),
  create: (course: any) => apiRequest<any>('/courses', {
    method: 'POST',
    body: JSON.stringify(course),
  }),
  update: (id: string, course: any) => apiRequest<any>(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(course),
  }),
  delete: (id: string) => apiRequest<{ message: string }>(`/courses/${id}`, {
    method: 'DELETE',
  }),
};

// Grades API
export const gradesAPI = {
  getAll: () => apiRequest<any[]>('/grades'),
  getById: (id: string) => apiRequest<any>(`/grades/${id}`),
  getByStudent: (studentId: string) => apiRequest<any[]>(`/grades/student/${studentId}`),
  create: (grade: any) => apiRequest<any>('/grades', {
    method: 'POST',
    body: JSON.stringify(grade),
  }),
  update: (id: string, grade: any) => apiRequest<any>(`/grades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(grade),
  }),
  delete: (id: string) => apiRequest<{ message: string }>(`/grades/${id}`, {
    method: 'DELETE',
  }),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: () => apiRequest<any[]>('/enrollments'),
  getById: (id: string) => apiRequest<any>(`/enrollments/${id}`),
  getByStudent: (studentId: string) => apiRequest<any[]>(`/enrollments/student/${studentId}`),
  create: (enrollment: any) => apiRequest<any>('/enrollments', {
    method: 'POST',
    body: JSON.stringify(enrollment),
  }),
  update: (id: string, enrollment: any) => apiRequest<any>(`/enrollments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(enrollment),
  }),
  delete: (id: string) => apiRequest<{ message: string }>(`/enrollments/${id}`, {
    method: 'DELETE',
  }),
};

// Majors API
export const majorsAPI = {
  getAll: () => apiRequest<any[]>('/majors'),
  getById: (id: string) => apiRequest<any>(`/majors/${id}`),
  create: (major: any) => apiRequest<any>('/majors', {
    method: 'POST',
    body: JSON.stringify(major),
  }),
  update: (id: string, major: any) => apiRequest<any>(`/majors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(major),
  }),
  delete: (id: string) => apiRequest<{ message: string }>(`/majors/${id}`, {
    method: 'DELETE',
  }),
};

// Major Change Requests API
export const majorChangeRequestsAPI = {
  getAll: () => apiRequest<any[]>('/major-change-requests'),
  getById: (id: string) => apiRequest<any>(`/major-change-requests/${id}`),
  create: (request: any) => apiRequest<any>('/major-change-requests', {
    method: 'POST',
    body: JSON.stringify(request),
  }),
  review: (id: string, status: 'approved' | 'denied', adminComments?: string) =>
    apiRequest<any>(`/major-change-requests/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminComments }),
    }),
  delete: (id: string) => apiRequest<{ message: string }>(`/major-change-requests/${id}`, {
    method: 'DELETE',
  }),
};

