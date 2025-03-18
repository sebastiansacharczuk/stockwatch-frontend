import {createAsyncThunk} from "@reduxjs/toolkit";
import {api} from "../api.js";

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