import axios from "axios";
import {useDispatch} from "react-redux";
import {logoutUser} from "./redux/auth/authThunks.js";
import {calculateFromTimestamp, currentTimestamp} from "./components/ChartComponent/chartUtils.js";

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

export const addTickerToWatchlist = (id, ticker, companyName) => {
    const truncateName = (name, maxLength = 150) => {
        if (name.length <= maxLength) {
            return name;
        }
        const substring = name.substring(0, maxLength);
        const lastIndex = substring.lastIndexOf(",");
        if (lastIndex !== -1) {
            return substring.substring(0, lastIndex);
        } else {
            return substring;
        }
    };
    const truncatedName = truncateName(companyName);

    return api.post(`watchlists/${id}/add_ticker`, {
        ticker: ticker,
        name: truncatedName
    });
};

export const searchTickers = (search = '', market = 'stocks', limit = 50, date = '', tickerType = '', active = true) => {
    return api.get('/search_tickers', {
        params: {
            search,
            market,
            limit,
            date,
            tickerType,
            active
        }})
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

export const getStockAggregateData = (
    stockTicker,
    timeInterval,
    adjusted = true,
    sort = 'asc',
    limit = 5000
) => {
    if (!stockTicker || !timeInterval) {
        throw new Error('Missing required parameters');
    }
    const from = calculateFromTimestamp(timeInterval);
    const to = currentTimestamp;

    return api.get('/stock_aggregate_data', {
        params: {
            stockTicker,
            multiplier: timeInterval.multiplier,
            timespan: timeInterval.timespan,
            from,
            to,
            adjusted,
            sort,
            limit
        }
    })
}



export const getTickerDetails = (ticker) => {
    return api.get('stocks/details', {
        params: { ticker }
    })
        .then((response) => {
            console.log(response.data);
            return response.data.data; // Zwracaj dane poprawnie
        })
        .catch((error) => {
            console.error("Błąd pobierania danych:", error);
            throw error;
        });
};
