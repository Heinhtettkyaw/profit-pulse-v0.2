import API from './api';

export const login = async (credentials) => {
    try {
        const response = await API.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await API.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        throw error;
    }
};
