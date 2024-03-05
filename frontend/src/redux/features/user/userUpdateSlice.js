import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = ({
    loading: false,
    error: null,
    isUpdated: false
});
export const updateUser = createAsyncThunk("updateUser", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        return await axios.put("/api/v1/update-profile", userData, config);
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const updateUserPassword = createAsyncThunk("updateUserPassword", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        return await axios.put("/api/v1/update-password", userData, config);
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const userUpdateSlice = createSlice({
    name: 'user_update',
    initialState,
    reducers: {
        setIsUpdated: (state, action) => {
            state.isUpdated = action.payload;
        },
        clearErrors: (state, action) => {
            state.error= "";
        }
    },
    extraReducers: builder => {
        builder.addMatcher(isAnyOf(updateUser.pending, updateUserPassword.pending), (state, action) => {
            state.loading = true;
            state.isUpdated = false;
        });
        builder.addMatcher(isAnyOf(updateUser.fulfilled, updateUserPassword.fulfilled), (state, action) => {
            state.loading = false;
            state.isUpdated = true;
        });
        builder.addMatcher(isAnyOf(updateUser.rejected, updateUserPassword.rejected), (state, action) => {
            state.loading = false;
            state.isUpdated = false;
            state.error = action.payload.response.data.error || action.payload.message || action.error.message
        });
    }
});
export const { setIsUpdated, clearErrors } = userUpdateSlice.actions;
export default userUpdateSlice.reducer;

