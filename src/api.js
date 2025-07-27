import axios from 'axios';


// Set up the backend base URL from environment variables or default to localhost
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
    throw error;
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
};

// Logout User
export const logoutUser = async () => {
  try {
    const response = await API.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await API.get('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('Fetch User Error:', error.response?.data || error.message);
    throw error;
  }
};

export default API;
