import axios from 'axios';

// Base url backend 
const api = axios.create({
    // Base URL fetch from .env.local 
    baseURL : process.env.NEXT_PUBLIC_API_URL,
    headers : {
        'Accept': "application/json",
        'Content-Type': 'application/json',
    },
    // Wajib diaktifkan untuk mengirim Cookie Session dan mengambil XSRF Token
    withCredentials: true,
    withXSRFToken: true 
});

// Interceptor Auto Response if unauthorized (401)
api.interceptors.response.use(
    (response) => response,
    (error)   =>
    {
        if(error.response && error.response.status == 401)
        {
            if(typeof window !== 'undefined')
            {
                // Redirect to auth page when session expires
                window.location.href= '/auth';            
            }
        }
        return Promise.reject(error);
    }
)

export default api;