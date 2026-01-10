import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ChangePasswordResponse,
  ChangePasswordRequest,
  UpdateProfileResponse,
} from "@/types/auth";
import {
  FooterDataResponse,
  NotificationsResponse,
  PagesResponse,
  UserInfoResponse,
} from "@/types/globals";
import { GetAllLocationsResponse, GetAllMealsResponse, HomeResponse } from "@/types/dashboard";
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
  tagTypes: ["Profile"],
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
    }),
     GetAllMeals: builder.query<GetAllMealsResponse, string>({
      query: (lang) => ({
        url: "/meals",
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
  useGetPagesByTypeQuery,
  useGetHomeDataQuery,
  useGetAllMealsQuery,
  useGetAllLocationsQuery,
} = authApi;
