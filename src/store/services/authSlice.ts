import { apiSlice } from "./apiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { API_ROUTES, RTK_TAGS } from "@/constants";
import {
  User,
  ChangePasswordRequest,
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from "@/types/user";

export const hqAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: { ...credentials, loginOption: "email" },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials(data?.response));
      },
    }),
    forgotPassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: { ...credentials, modeOfReset: "email" },
      }),
    }),

    validateOtp: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "auth/validate-otp",
        method: "POST",
        body: credentials,
      }),
    }),

    resendOtp: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "auth/resend-otp",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfileDetails: builder.query({
      query: (params): any => ({
        url: API_ROUTES.AUTH.USER,
        method: "GET",
        params,
      }),
      providesTags: [{ type: RTK_TAGS.AUTH }] as any,
      transformResponse: (response: any) => response.response,
    }),

    resetPassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "auth/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    updateProfile: builder.mutation<User, any>({
      query: (profileData) => ({
        url: "auth/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: [{ type: RTK_TAGS.AUTH }],
      transformResponse: (response: any) => response.data || response,
    }),

    changePassword: builder.mutation<any, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: "auth/change-password",
        method: "PUT",
        body: passwordData,
      }),
    }),

    getNotificationSettings: builder.query<NotificationSettings, void>({
      query: () => "auth/notification-settings",
      providesTags: [{ type: RTK_TAGS.AUTH }],
      transformResponse: (response: any) => response.data || response,
    }),

    updateNotificationSettings: builder.mutation<
      NotificationSettings,
      UpdateNotificationSettingsRequest
    >({
      query: (settings) => ({
        url: "auth/notification-settings",
        method: "PUT",
        body: settings,
      }),
      invalidatesTags: [{ type: RTK_TAGS.AUTH }],
      transformResponse: (response: any) => response.data || response,
    }),

    uploadProfileImage: builder.mutation<any, { avatarBase64: string }>({
      query: ({ avatarBase64 }) => ({
        url: "auth/profile/avatar",
        method: "PUT",
        body: { avatarBase64 },
      }),
      invalidatesTags: [{ type: RTK_TAGS.AUTH }],
      transformResponse: (response: any) => response.data || response,
    }),

    deleteAccount: builder.mutation<
      void,
      { password: string; confirmation: string }
    >({
      query: ({ password, confirmation }) => ({
        url: "auth/delete-account",
        method: "DELETE",
        body: { password, confirmation },
      }),
    }),

    verifyEmail: builder.mutation<any, { token: string; email: string }>({
      query: (body) => ({
        url: "auth/verify-email",
        method: "POST",
        body,
      }),
    }),

    resendVerificationEmail: builder.mutation<any, { email: string }>({
      query: ({ email }) => ({
        url: "auth/send-verification-email",
        method: "POST",
        body: { email },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useValidateOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useRegisterMutation,
  useGetProfileDetailsQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useUploadProfileImageMutation,
  useDeleteAccountMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} = hqAuthApi;
