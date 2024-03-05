import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import axios from "axios";
import userDefault from "../../../assets/images/default-profile.jpg";

const initialState = {
    user: [],
    loading: true,
    error: null,
    isAuthenticated: false,
    defaultImage: userDefault
};

export const loginUser = createAsyncThunk("loginUser", async ({ email, password }, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        return await axios.post("/api/v1/login", { email, password }, config);
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const registerUser = createAsyncThunk("registerUser", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        return await axios.post("/api/v1/register", userData, config);
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const getLoggedInUser = createAsyncThunk("getLoggedInUser", async (args, { rejectWithValue }) => {
    try {
        return await axios.get("/api/v1/profile");
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const logoutUser = createAsyncThunk("logoutUser", async (args, { rejectWithValue }) => {
    try {
        return await axios.get("/api/v1/logout");
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const userLoginRegisterSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoadingState: (state, action) => {
            state.loading = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(logoutUser.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(logoutUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        });
        builder.addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.response.data.error || action.payload.message || action.error.message
        });
        builder.addMatcher(isAnyOf(loginUser.pending, registerUser.pending, getLoggedInUser.pending), (state, action) => {
            state.loading = true;
            state.error = null;
            state.isAuthenticated = false;
            state.user = null;
        });
        builder.addMatcher(isAnyOf(loginUser.fulfilled, registerUser.fulfilled, getLoggedInUser.fulfilled), (state, action) => {
            state.user = action.payload.data.user;
            state.loading = false;
            state.error = null;
            state.isAuthenticated = true;
        });
        builder.addMatcher(isAnyOf(loginUser.rejected, registerUser.rejected, getLoggedInUser.rejected), (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload.response.data.error || action.payload.message || action.error.message
        });
    }
});

export const { setLoadingState } = userLoginRegisterSlice.actions;
export default userLoginRegisterSlice.reducer;