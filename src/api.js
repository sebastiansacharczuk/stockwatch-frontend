import axios from "axios";
import {useDispatch} from "react-redux";
import {logoutUser} from "./redux/authThunks.js";

axios.defaults.withCredentials = true;
export const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== 'refresh_token') {
            originalRequest._retry = true;


            try {
                await api.post('refresh_token');
                return api(originalRequest);
            } catch (refreshError) {
                const dispatch = useDispatch()
                dispatch(logoutUser())
                console.error('Błąd odświeżania tokenu:', refreshError.response?.data);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
