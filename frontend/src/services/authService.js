// Simulated authentication service returning mock responses structured like Axios requests
export const authService = {
  login: async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Determine mock role based on email context for developer ease
    let role = 'restaurant';
    if (email.includes('ngo')) role = 'ngo';
    else if (email.includes('volunteer')) role = 'volunteer';
    else if (email.includes('admin')) role = 'admin';

    const mockResponse = {
      data: {
        token: 'mock-jwt-token-string-xyz',
        user: {
          name: 'Alex Rivera',
          email: email,
          role: role,
        }
      }
    };
    localStorage.setItem('auth_token', mockResponse.data.token);
    return mockResponse;
  },

  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.removeItem('auth_token');
    return { data: { success: true } };
  },

  getMe: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Unauthorized');
    const role = localStorage.getItem('user_role') || 'restaurant';
    return {
      data: {
        name: 'Alex Rivera',
        email: `${role}@example.com`,
        role: role
      }
    };
  }
};

export default authService;
