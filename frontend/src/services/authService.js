import api from './api';
import { decodeToken } from '../utils/helpers';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    
    const decoded = decodeToken(access_token);
    // Standardize role to lowercase for frontend routing consistency
    const role = decoded ? decoded.role.toLowerCase() : 'restaurant';
    const name = decoded ? (decoded.name || `Demo ${decoded.role}`) : 'Demo User';
    
    localStorage.setItem('auth_token', access_token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_info', JSON.stringify({ name, email, role }));
    
    return {
      data: {
        token: access_token,
        user: { name, email, role }
      }
    };
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_info');
    return { data: { success: true } };
  },

  getMe: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Unauthorized');
    
    const userInfoStr = localStorage.getItem('user_info');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    if (userInfo) {
      return { data: userInfo };
    }
    
    const decoded = decodeToken(token);
    if (!decoded) throw new Error('Unauthorized');
    
    const role = decoded.role.toLowerCase();
    const name = decoded.name || `Demo ${decoded.role}`;
    const email = `${role}@example.com`;
    return {
      data: { name, email, role }
    };
  }
};

export default authService;
