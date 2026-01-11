import { API_ROUTES, RTK_TAGS } from "@/constants";
import {
  Payment,
  CreatePaymentRequest,
  VerifyPaymentResponse,
  PaymentQueryParams,
} from "@/types/payment";
import { PaginatedResponse, ServiceResponse } from "@/types/statics";
import { apiSlice } from "./apiSlice";

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create payment request
    createPayment: builder.mutation<Payment, CreatePaymentRequest>({
      query: (paymentData) => ({
        url: API_ROUTES.PAYMENTS.CREATE,
        method: "POST",
        body: paymentData,
      }),
      transformResponse: (response: ServiceResponse<Payment>) => {
        return response?.response || response;
      },
      invalidatesTags: [{ type: RTK_TAGS.PAYMENTS, id: "LIST" }],
    }),

    // Verify payment
    verifyPayment: builder.query<VerifyPaymentResponse, string>({
      query: (reference) => ({
        url: API_ROUTES.PAYMENTS.VERIFY(reference),
        method: "GET",
      }),
      transformResponse: (response: ServiceResponse<VerifyPaymentResponse>) => {
        return response?.response || response;
      },
    }),

    // Get user payments (paginated)
    getUserPayments: builder.query<PaginatedResponse<Payment>, PaymentQueryParams>({
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

    // Get payment by ID
    getPaymentById: builder.query<Payment, string>({
      query: (paymentId) => ({
        url: API_ROUTES.PAYMENTS.DETAIL(paymentId),
        method: "GET",
      }),
      transformResponse: (response: ServiceResponse<Payment>) => {
        return response?.response || response;
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
