import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import productDefault from '../../assets/images/product-1.png';
const initialState = {
    products: [],
    loading: true,
    error: null,
    productCount: 0,
    product: [],
    productDefaultImage: productDefault,
    resultPerPage:10,
    filteredProductsCount: 0
};

export const getAllProduct = createAsyncThunk("getAllProduct", async (args, { rejectWithValue }) => {
    try {         
        const price = args["price"] ?? null;
        const ratings = args["ratings"] ?? null;
        delete args["price"];
        delete args["ratings"];
        let linkArgs = args ? "?"+new URLSearchParams(args).toString() : "";
        if(price) {
            let key0 = Object.keys(price)[0];
            let key1 = Object.keys(price)[1];
            linkArgs += `&price[${key0}]=${price[key0]}&price[${key1}]=${price[key1]}`
        }
        if(ratings){
            linkArgs += `&ratings[gte]=${ratings}`
        }
        return await axios.get(`/api/v1/products${linkArgs}`);
    } catch (err) {
        return rejectWithValue(err)
    }
});
export const getProductDetail = createAsyncThunk("getProductDetail", async (args, { rejectWithValue }) => {
    try {
        return await axios.get(`/api/v1/product/${args}`);
    } catch (err) {
        return rejectWithValue(err)
    }
});

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setLoadingState: (state, action) =>{
            state.loading = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getAllProduct.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAllProduct.fulfilled, (state, action) => {
            state.products = action.payload.data.products;
            state.productCount = action.payload.data.productCount;
            state.resultPerPage = action.payload.data.resultPerPage;
            state.filteredProductsCount = action.payload.data.filteredProductsCount;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getAllProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.response.data.error || action.payload.message || action.error.message
        });

        //Product Detail
        builder.addCase(getProductDetail.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getProductDetail.fulfilled, (state, action) => {
            state.product = action.payload.data.product;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(getProductDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.response.data.error || action.payload.message || action.error.message
        });

    }
});

export const {setLoadingState} = productSlice.actions;
export default productSlice.reducer;