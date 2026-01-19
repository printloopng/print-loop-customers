import { API_ROUTES, RTK_TAGS } from "@/constants";
import {
  PaginatedResponse
} from "@/types/statics";
import { apiSlice } from "./apiSlice";

export const printJobsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadPrintFile: builder.mutation<
      any,
      { fileBase64: string; fileName: string; fileType: string }
    >({
      query: ({ fileBase64, fileName, fileType }) => ({
        url: API_ROUTES.PRINT_JOBS.UPLOAD,
        method: "POST",
        body: { fileBase64, fileName, fileType }
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      }
    }),

    getPrintOptions: builder.query<any, void>({
      query: () => ({
        url: API_ROUTES.PRINT_JOBS.OPTIONS,
        method: "GET"
      }),
      transformResponse: (response: any) => {
        return response?.response || response;
      }
    }),

    calculatePrice: builder.mutation<
      { price: number },
      {
        pageCount: number;
        paperSize: string;
        orientation: string;
        copies: number;
        pageRange?: string;
        staple?: boolean;
        colorType: string;
        resolution?: number;
        duplex: string;
      }
    >({
      query: (body) => ({
        url: API_ROUTES.PRINT_JOBS.CALCULATE_PRICE,
        method: "POST",
        body
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      }
    }),

    getPrintJobStats: builder.query<
      any,
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: API_ROUTES.PRINT_JOBS.STATS,
        method: "GET",
        params
      }),
      transformResponse: (response: any) => {
        return response?.response || response;
      },
      providesTags: [{ type: RTK_TAGS.PRINT_JOBS, id: "STATS" }]
    }),

    createPrintJob: builder.mutation<any, any>({
      query: (printJobData) => ({
        url: API_ROUTES.PRINT_JOBS.CREATE,
        method: "POST",
        body: printJobData
      }),
      transformResponse: (response: any) => {
        return response?.response;
      },
      invalidatesTags: [
        { type: RTK_TAGS.PRINT_JOBS, id: "LIST" },
        { type: RTK_TAGS.PRINT_JOBS, id: "STATS" }
      ]
    }),

    getUserPrintJobs: builder.query<
      PaginatedResponse<any>,
      any
    >({
      query: (params) => ({
        url: API_ROUTES.PRINT_JOBS.LIST,
        method: "GET",
        params
      }),
      transformResponse: (response: any) =>
        response?.response,
      providesTags: () => [{ type: RTK_TAGS.PRINT_JOBS, id: "LIST" }]
    }),

    getPrintJobById: builder.query<any, string>({
      query: (jobId) => ({
        url: API_ROUTES.PRINT_JOBS.DETAIL(jobId),
        method: "GET"
      }),
      transformResponse: (response: any) => {
        return response?.response || response;
      },
      providesTags: (_result, _error, jobId) => [
        { type: RTK_TAGS.PRINT_JOBS, id: jobId }
      ]
    }),

    cancelPrintJob: builder.mutation<
      any,
      { jobId: string; data: any }
    >({
      query: ({ jobId, data }) => ({
        url: API_ROUTES.PRINT_JOBS.CANCEL(jobId),
        method: "PATCH",
        body: data
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: RTK_TAGS.PRINT_JOBS, id: jobId },
        { type: RTK_TAGS.PRINT_JOBS, id: "LIST" },
        { type: RTK_TAGS.PRINT_JOBS, id: "STATS" }
      ]
    }),

    deletePrintJob: builder.mutation<any, string>({
      query: (jobId) => ({
        url: API_ROUTES.PRINT_JOBS.DELETE(jobId),
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: RTK_TAGS.PRINT_JOBS, id: jobId },
        { type: RTK_TAGS.PRINT_JOBS, id: "LIST" },
        { type: RTK_TAGS.PRINT_JOBS, id: "STATS" }
      ]
    }),

    getPresignedUrl: builder.mutation<
      {
        url: string;
        params: {
          api_key: string;
          timestamp: number;
          signature: string;
          folder?: string;
          allowed_formats?: string;
          public_id?: string;
          tags?: string;
        }
      },
      { fileName: string; fileType: string }
    >({
      query: (body) => ({
        url: API_ROUTES.UPLOAD.PRESIGNED_URL,
        method: "POST",
        body
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      }
    })
  })
});

export const {
  useUploadPrintFileMutation,
  useGetPrintOptionsQuery,
  useGetPrintJobStatsQuery,
  useCreatePrintJobMutation,
  useGetUserPrintJobsQuery,
  useGetPrintJobByIdQuery,
  useCancelPrintJobMutation,
  useDeletePrintJobMutation,
  useGetPresignedUrlMutation,
  useCalculatePriceMutation
} = printJobsApi;
