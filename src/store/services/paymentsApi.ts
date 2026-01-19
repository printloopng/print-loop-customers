import { API_ROUTES, RTK_TAGS } from "@/constants";
import {
  Payment,
  CreatePaymentRequest,
} from "@/types/payment";
import { PaginatedResponse } from "@/types/statics";
import { apiSlice } from "./apiSlice";

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<Payment, CreatePaymentRequest>({
      query: (paymentData) => ({
        url: API_ROUTES.PAYMENTS.CREATE,
        method: "POST",
        body: paymentData,
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
      invalidatesTags: [{ type: RTK_TAGS.PAYMENTS, id: "LIST" }],
    }),

    verifyPayment: builder.query<any, string>({
      query: (reference) => ({
        url: API_ROUTES.PAYMENTS.VERIFY(reference),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
    }),

    getUserPayments: builder.query<PaginatedResponse<Payment>, any>({
      query: (params) => ({
        url: API_ROUTES.PAYMENTS.LIST,
        method: "GET",
        params,
      }),
      transformResponse: (response: any) => {
        return response?.response || response;
      },
      providesTags: (result) => [{ type: RTK_TAGS.PAYMENTS, id: "LIST" }],
    }),

    getPaymentById: builder.query<any, string>({
      query: (paymentId) => ({
        url: API_ROUTES.PAYMENTS.DETAIL(paymentId),
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
      providesTags: (result, error, paymentId) => [
        { type: RTK_TAGS.PAYMENTS, id: paymentId },
      ],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useVerifyPaymentQuery,
  useLazyVerifyPaymentQuery,
  useGetUserPaymentsQuery,
  useGetPaymentByIdQuery,
} = paymentsApi;
