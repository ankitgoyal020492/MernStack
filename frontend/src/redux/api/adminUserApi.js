import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const adminUserApi = createApi({
    reducerPath: "adminUserApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/v1/admin/user/`,
    }),
    tagTypes: ["users"],
    endpoints: (builder) => ({
        allUsers: builder.query({
            query: () => ({
                url: "all",
                method: "get"
            }),  
            providesTags:["users"]          
        }),
        updateUser: builder.mutation({
            query: (user) => ({
                url: `${user.id}`,
                method: "put",
                body: user
            }),   
            invalidatesTags: ["users"]         
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${id}`,
                method: "delete"
               // headers: { 'Content-Type': 'multipart/form-data'}
            }),            
            invalidatesTags: ["users"]
        }),
    }),
});

export const {useAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation} = adminUserApi;