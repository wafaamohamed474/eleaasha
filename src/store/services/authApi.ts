import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ChangePasswordResponse,
  ChangePasswordRequest,
  UpdateProfileResponse,
  ForgetPasswordResponse,
  ForgetPasswordRequest,
  resetPasswordRequest,
  ResetPasswordResponse,
} from "@/types/auth";
import {
  FooterDataResponse,
  GetCitiesResponse,
  NotificationsResponse,
  PagesResponse,
  UserInfoResponse,
} from "@/types/globals";
import { HomeResponse } from "@/types/dashboard";

import {
  AddOrderRequest,
  AddOrderResponse,
  DeleteSingleOrderResponse,
  GetAllOrdersResponse,
  GetSingleOrderResponse,
} from "@/types/orders";
import { GetAllMealsResponse, GetSingleMealResponse } from "@/types/meals";
import {
  AddLocationRequest,
  AddLocationResponse,
  DeleteSingleLocationResponse,
  GetAllLocationsResponse,
} from "@/types/locations";
import { getAuthTokenClient } from "@/lib/auth/authClient";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAuthTokenClient();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: ["Profile", "Location", "Order", "Notification"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest & { lang: string }>({
      query: ({ lang, ...credentials }) => ({
        url: "/login",
        method: "POST",
        body: credentials,
        params: { lang },
      }),
    }),
    register: builder.mutation<
      RegisterResponse,
      RegisterRequest & { lang: string }
    >({
      query: ({ lang, ...userData }) => ({
        url: "/register",
        method: "POST",
        body: { ...userData, type: "user" },
        params: { lang },
      }),
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest & { lang: string }
    >({
      query: ({ lang, ...body }) => ({
        url: "/profile/change-password",
        method: "POST",
        body,
        params: { lang },
      }),
    }),

    ForgetPassword: builder.mutation<
      ForgetPasswordResponse,
      ForgetPasswordRequest & { lang: string }
    >({
      query: ({ lang, ...body }) => ({
        url: "/forgot-password",
        method: "POST",
        body,
        params: { lang },
      }),
    }),
    ResetPassword: builder.mutation<
      ResetPasswordResponse,
      resetPasswordRequest & { lang: string }
    >({
      query: ({ lang, ...body }) => ({
        url: "/reset-Password",
        method: "POST",
        body,
        params: { lang },
      }),
    }),

    GetFooterData: builder.query<FooterDataResponse, string>({
      query: (lang) => ({
        url: "/settings/footer",
        method: "GET",
        params: { lang },
      }),
    }),
    GetUserInfo: builder.query<UserInfoResponse, string>({
      query: (lang) => ({
        url: "/getUserInfo",
        method: "GET",
        params: { lang },
      }),
      providesTags: ["Profile"],
    }),
    UpdateProfile: builder.mutation<
      UpdateProfileResponse,
      { lang: string; formData: FormData }
    >({
      query: ({ lang, formData }) => ({
        url: "/profile/update",
        method: "POST",
        body: formData,
        params: { lang },
      }),
      invalidatesTags: ["Profile"],
    }),
    GetNotifications: builder.query<NotificationsResponse, string>({
      query: (lang) => ({
        url: "/notifications",
        method: "GET",
        params: { lang },
      }),
      providesTags: ["Notification"],
    }),
    MarkSpecificNotificationAsRead: builder.mutation<
      any,
      { lang: string; id: string }
    >({
      query: ({ lang, id }) => ({
        url: `/notifications/${id}/read`,
        method: "POST",
        params: { lang },
      }),
      invalidatesTags: ["Notification"],
    }),
    DeleteSpecificNotification: builder.mutation<
      any,
      { lang: string; id: string }
    >({
      query: ({ lang, id }) => ({
        url: `/notifications/${id}/delete`,
        method: "DELETE",
        params: { lang },
      }),
      invalidatesTags: ["Notification"],
    }),
    GetPagesByType: builder.query<
      PagesResponse,
      { lang: string; type: string }
    >({
      query: ({ lang, type }) => ({
        url: "/settings/pages",
        method: "GET",
        params: { lang, type },
      }),
    }),
    GetHomeData: builder.query<HomeResponse, string>({
      query: (lang) => ({
        url: "/home",
        method: "GET",
        params: { lang },
      }),
      providesTags: ["Location"],
    }),
    GetAllMeals: builder.query<GetAllMealsResponse, string>({
      query: (lang) => ({
        url: "/meals",
        method: "GET",
        params: { lang },
      }),
    }),
    GetSingleMeal: builder.query<
      GetSingleMealResponse,
      { lang: string; id: string }
    >({
      query: ({ lang, id }) => ({
        url: `/meals/${id}`,
        method: "GET",
        params: { lang },
      }),
    }),
    GetAllLocations: builder.query<GetAllLocationsResponse, string>({
      query: (lang) => ({
        url: "/company/locations",
        method: "GET",
        params: { lang },
      }),
      providesTags: ["Location"],
    }),
    AddLocation: builder.mutation<
      AddLocationResponse,
      AddLocationRequest & { lang: string }
    >({
      query: ({ lang, ...body }) => ({
        url: "/company/Add-locations",
        method: "POST",
        params: { lang },
        body,
      }),
      invalidatesTags: ["Location", "Notification"],
    }),
    DeleteSingleLocation: builder.mutation<
      DeleteSingleLocationResponse,
      { lang: string; id: string }
    >({
      query: ({ lang, id }) => ({
        url: `/company/locations/${id}`,
        method: "DELETE",
        params: { lang },
      }),
      invalidatesTags: ["Location"],
    }),
    GetAllOrders: builder.query<
      GetAllOrdersResponse,
      { lang: string; status?: string }
    >({
      query: ({ lang, status }) => ({
        url: "/orders",
        method: "GET",
        params: { lang, status },
      }),
      providesTags: ["Order"],
    }),
    GetSingleOrder: builder.query<
      GetSingleOrderResponse,
      { lang: string; id: string }
    >({
      query: ({ lang, id }) => ({
        url: `/orders/${id}`,
        method: "GET",
        params: { lang },
      }),
    }),
    CreateOrder: builder.mutation<
      AddOrderResponse,
      AddOrderRequest & { lang: string }
    >({
      query: ({ lang, ...body }) => ({
        url: "/orders",
        method: "POST",
        params: { lang },
        body,
      }),
      invalidatesTags: ["Order", "Notification"],
    }),
    DeleteSingleOrder: builder.mutation<
      DeleteSingleOrderResponse,
      { lang: string; id: string }
    >({
      query: ({ lang, id }) => ({
        url: `/orders/${id}`,
        method: "DELETE",
        params: { lang },
      }),
      invalidatesTags: ["Order"],
    }),
    GetCities: builder.query<GetCitiesResponse, string>({
      query: (lang) => ({
        url: "/cities",
        method: "GET",
        params: { lang },
      }),
    }),
    logout: builder.mutation<void, string>({
      query: (lang) => ({
        url: "/logout",
        method: "POST",
        params: { lang },
      }),
    }),
    deleteAccount: builder.mutation<void, string>({
      query: (lang) => ({
        url: "/delete-account",
        method: "DELETE",
        params: { lang },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useChangePasswordMutation,
  useGetFooterDataQuery,
  useGetUserInfoQuery,
  useUpdateProfileMutation,
  useGetNotificationsQuery,
  useMarkSpecificNotificationAsReadMutation,
  useDeleteSpecificNotificationMutation,
  useGetPagesByTypeQuery,
  useGetHomeDataQuery,
  useGetAllMealsQuery,
  useGetAllLocationsQuery,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useGetSingleOrderQuery,
  useCreateOrderMutation,
  useDeleteSingleOrderMutation,
  useGetSingleMealQuery,
  useGetAllOrdersQuery,
  useAddLocationMutation,
  useDeleteSingleLocationMutation,
  useGetCitiesQuery,
  useLogoutMutation,
  useDeleteAccountMutation,
} = authApi;
