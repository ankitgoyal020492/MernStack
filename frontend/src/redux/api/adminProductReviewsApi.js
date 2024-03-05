import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const adminProductReviewsApi = createApi({
    reducerPath: "adminProductReviewsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1/admin/product/reviews`,
    }),
    tagTypes: ["review"],
    endpoints: (builder) => ({
        productReviews: builder.query({
            query: (id) => ({
                url: `${id}`,
                method: "get"
            }),  
            providesTags:["review"]          
        }),
        deleteReview: builder.mutation({
            query: (data) => ({
                url: `${data.id}`,
                method: "delete",
                body:{productId: data.productId}
            }),
            invalidatesTags: ["review"]       
        }),
 
    }),
});

export const {useDeleteReviewMutation, useProductReviewsQuery} = adminProductReviewsApi;