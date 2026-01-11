import { API_ROUTES, RTK_TAGS } from "@/constants";
import {
  Wallet,
  WalletTransaction,
  FundWalletRequest,
  FundWalletResponse,
  VerifyWalletFundingResponse,
  WalletTransactionsQueryParams
} from "@/types/wallet";
import { PaginatedResponse } from "@/types/statics";
import { apiSlice } from "./apiSlice";

export const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fundWallet: builder.mutation<FundWalletResponse, FundWalletRequest>({
      query: (fundData) => ({
        url: API_ROUTES.WALLET.FUND,
        method: "POST",
        body: fundData
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
      invalidatesTags: [
        { type: RTK_TAGS.WALLET, id: "BALANCE" },
        { type: RTK_TAGS.WALLET, id: "TRANSACTIONS" }
      ]
    }),

    verifyWalletFunding: builder.query<VerifyWalletFundingResponse, string>({
      query: (reference) => ({
        url: API_ROUTES.WALLET.VERIFY(reference),
        method: "GET"
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      }
    }),

    getWalletBalance: builder.query<Wallet, void>({
      query: () => ({
        url: API_ROUTES.WALLET.BALANCE,
        method: "GET"
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
      providesTags: [{ type: RTK_TAGS.WALLET, id: "BALANCE" }]
    }),

    getWalletTransactions: builder.query<
      PaginatedResponse<WalletTransaction>,
      WalletTransactionsQueryParams
    >({
      query: (params) => ({
        url: API_ROUTES.WALLET.TRANSACTIONS,
        method: "GET",
        params
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
      providesTags: () => [{ type: RTK_TAGS.WALLET, id: "TRANSACTIONS" }]
    })
  })
});

export const {
  useFundWalletMutation,
  useVerifyWalletFundingQuery,
  useLazyVerifyWalletFundingQuery,
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery
} = walletApi;
