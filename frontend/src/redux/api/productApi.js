import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1/product/`,
    }),
    endpoints: (builder) => ({
        newReview: builder.mutation({
            query: (review) => ({
                url: "review",
                method: "put",
                body: review
            }),            
        }),
    }),
});

export const {useNewReviewMutation} = productApi;