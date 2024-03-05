import { configureStore } from '@reduxjs/toolkit'
import { productSlice } from './features/productSlice';
import { userLoginRegisterSlice } from './features/user/userLoginRegisterSlice';
import {userUpdateSlice} from './features/user/userUpdateSlice';
import {ForgotPasswordSlice} from './features/forgot_password/ForgotPasswordSlice';
import { cartSlice } from './features/product/cartSlice';
import { orderApi } from './api/orderApi';
import { productApi } from './api/productApi';
import { adminProductApi } from './api/adminProductApi';
import { adminOrderApi } from './api/adminOrderApi';
import { adminUserApi } from './api/adminUserApi';
import { adminProductReviewsApi } from './api/adminProductReviewsApi';

const store = configureStore({
    reducer: {
        [productSlice.name]: productSlice.reducer,
        [userLoginRegisterSlice.name]: userLoginRegisterSlice.reducer,
        [userUpdateSlice.name]: userUpdateSlice.reducer,
        [ForgotPasswordSlice.name]: ForgotPasswordSlice.reducer,
        [cartSlice.name]: cartSlice.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [adminProductApi.reducerPath]: adminProductApi.reducer,
        [adminOrderApi.reducerPath]: adminOrderApi.reducer,
        [adminUserApi.reducerPath]: adminUserApi.reducer,
        [adminProductReviewsApi.reducerPath]: adminProductReviewsApi.reducer,
    },
    middleware: (mid) => [
        ...mid({serializableCheck: false}),
        orderApi.middleware,
        productApi.middleware,
        adminProductApi.middleware,
        adminOrderApi.middleware,
        adminUserApi.middleware,
        adminProductReviewsApi.middleware,
    ]        
});

export default store;
