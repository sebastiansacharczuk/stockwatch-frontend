import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../../api.js";

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("logout");
            if (response.data?.status === "success") {
                // Odpowiedź API: { status: "success" }
                localStorage.removeItem("user");
                return response.data.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Błąd logowania');
        }
    }
);

export const fetchUserInfo = createAsyncThunk(
    'auth/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("user_info");
            if (response.data.status === "success") {
                // Odpowiedź API: { status: "success", data: { username: "user123" } }
                return response.data.data;
            } else {
                return rejectWithValue(response.data);
            }
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("user_info");
            if (response.data.status === "success") {
                return response.data.data; // Zwraca dane użytkownika
            } else {
                localStorage.removeItem("user"); // Usuwa nieaktualne dane
                return rejectWithValue(response.data);
            }
        } catch (err) {
            localStorage.removeItem("user"); // Usuwa dane w przypadku błędu
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);