import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const adminProductApi = createApi({
    reducerPath: "adminProductApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1/admin/product/`,
    }),
    tagTypes: ["products"],
    endpoints: (builder) => ({
        allProducts: builder.query({
            query: (review) => ({
                url: "all",
                method: "get",
                body: review
            }),  
            providesTags:["products"]          
        }),
        editProduct: builder.mutation({
            query: ({id, formData}) => ({
                url: `${id}`,
                method: "put",
                body: formData
            }),            
        }),
        addProduct: builder.mutation({
            query: (product) => ({
                url: `new`,
                method: "post",
                body: product,
               // headers: { 'Content-Type': 'multipart/form-data'}
            }),     
            invalidatesTags: ["products"]       
        }),
        deleteProduct: builder.mutation({
            query: (product) => ({
                url: `${product.id}`,
                method: "delete"
               // headers: { 'Content-Type': 'multipart/form-data'}
            }),            
            invalidatesTags: ["products"]
        }),
    }),
});

export const {useAllProductsQuery, useEditProductMutation, useAddProductMutation, useDeleteProductMutation} = adminProductApi;