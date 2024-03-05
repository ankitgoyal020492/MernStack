import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const adminOrderApi = createApi({
    reducerPath: "adminOrderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1/admin/order/`,
    }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        allOrders: builder.query({
            query: () => ({
                url: "all",
                method: "get"
            }),  
            providesTags:["orders"]          
        }),
        editOrder: builder.mutation({
            query: ({id, formData}) => ({
                url: `${id}`,
                method: "put",
                body: formData
            }),   
            invalidatesTags: ["orders"]         
        }),
        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `${id}`,
                method: "delete"
               // headers: { 'Content-Type': 'multipart/form-data'}
            }),            
            invalidatesTags: ["orders"]
        }),
    }),
});

export const {useAllOrdersQuery, useEditOrderMutation, useDeleteOrderMutation} = adminOrderApi;