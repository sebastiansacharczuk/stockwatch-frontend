import { createSlice } from '@reduxjs/toolkit';
import {fetchUserInfo} from "./authThunks.js";

const initialState = {
    isAuthenticated: false,
    user: null,
    status: 'idle',
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem("user");
        },
        checkAuth(state) {
            const user = localStorage.getItem("user");
            if (user) {
                state.isAuthenticated = true;
                state.user = JSON.parse(user);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            });
    }
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
