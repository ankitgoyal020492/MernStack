import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = ({
    loading: false,
    error: null,
    emailSent: false,
    isUpdated: false
});
export const forgotPasswordApi = createAsyncThunk("forgotPasswordApi", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        return await axios.post("/api/v1/forgot-password", userData, config);
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const resetPasswordApi = createAsyncThunk("resetPasswordApi", async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        return await axios.put("/api/v1/password/reset/"+userData["token"], userData, config);
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const ForgotPasswordSlice = createSlice({
    name: 'forgot_password',
    initialState,
    reducers: {
        setEmailSent: (state, action) => {
            state.emailSent = action.payload;
        },
        setIsUpdated: (state, action) => {
            state.isUpdated = action.payload;
        },
        clearErrors: (state, action) => {
            state.error= "";
        }
    },
    extraReducers: builder => {
        builder.addMatcher(isAnyOf(forgotPasswordApi.pending, resetPasswordApi.pending), (state, action) => {
            state.loading = true;
            state.emailSent = false;
            state.isUpdated = false;
        });
        builder.addMatcher(isAnyOf(forgotPasswordApi.fulfilled, resetPasswordApi.fulfilled), (state, action) => {
            state.loading = false;
            state.emailSent = true;
            state.true = false;
        });
        builder.addMatcher(isAnyOf(forgotPasswordApi.rejected, resetPasswordApi.rejected), (state, action) => {
            state.loading = false;
            state.emailSent = false;
            state.isUpdated = false;
            state.error = action.payload.response.data.error || action.payload.message || action.error.message
        });
    }
});
export const { setEmailSent, clearErrors, setIsUpdated } = ForgotPasswordSlice.actions;
export default ForgotPasswordSlice.reducer;