import { createSlice } from '@reduxjs/toolkit';
import {checkAuth, fetchUserInfo, logoutUser} from "./authThunks.js";

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
            })
            .addCase(checkAuth.pending, (state) => {
                    state.status = 'loading';
                })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload)); // Aktualizuje localStorage
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = false;
                state.user = null;
                localStorage.removeItem("user");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
                localStorage.removeItem("user");
            });
    }
});

export const { login } = authSlice.actions;
export default authSlice.reducer;
