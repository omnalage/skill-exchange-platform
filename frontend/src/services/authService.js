import axios from 'axios';

const API_URL = 'https://skill-exchange-platform-x98i.onrender.com/api/auth';

export const register = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    localStorage.setItem('token', response.data.token);
    return response;
};

export const logout = () => {
    localStorage.removeItem('token');
};
