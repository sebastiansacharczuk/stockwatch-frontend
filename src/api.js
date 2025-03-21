import axios from "axios";
import {useDispatch} from "react-redux";
import {logoutUser} from "./redux/auth/authThunks.js";

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

export const getAllTickers = () => {
    api.get("ticker_list")
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error("Błąd logowania:", error);
        });
};

export const getNews = () => {
    return api.get("news")
}

export const getAllWatchlists = () => {
    return api.get("watchlists/all")
}

export const getWatchlistById = (id) => {
    return api.get(`watchlists/${id}`)
}

export const searchTickers = () => {
    return api.get("search_tickers/")
}


export const createWatchlist = (name) => {
    api.post("watchlists/create", { name })
        .then((response) => {
            console.log(response.data);
            return response.data.data;
        })
        .catch((error) => {
            console.log(error);
            return Promise.reject(error);
        })
}