import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5260/api', // Backend URL
    paramsSerializer: {
        indexes: null // Serialize arrays as key=value&key=value (ASP.NET Core default binding)
    }
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors (like 401)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Handle unauthorized access (e.g., redirect to login)
            console.error('Unauthorized access. Redirecting to login...');
            // window.location.href = '/login'; // Use with caution, might cause loops
        }
        return Promise.reject(error);
    }
);

export default api;
