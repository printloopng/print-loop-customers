import { API_ROUTES, RTK_TAGS } from "@/constants";
import {
  PrintJob,
  CreatePrintJobRequest,
  UploadFileResponse,
  PrintOptions,
  PrintJobStats,
  CancelPrintJobRequest,
  PrintJobQueryParams
} from "@/types/printJob";
import { PaginatedResponse, ServiceResponse } from "@/types/statics";
import { apiSlice } from "./apiSlice";

export const printJobsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadPrintFile: builder.mutation<
      UploadFileResponse,
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

    getPrintOptions: builder.query<PrintOptions, void>({
      query: () => ({
        url: API_ROUTES.PRINT_JOBS.OPTIONS,
        method: "GET"
      }),
      transformResponse: (response: any) => {
        return response?.response || response;
      }
    }),

    getPrintJobStats: builder.query<
      PrintJobStats,
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: API_ROUTES.PRINT_JOBS.STATS,
        method: "GET",
        params
      }),
      transformResponse: (response: ServiceResponse<PrintJobStats>) => {
        return response?.response || response;
      },
      providesTags: [{ type: RTK_TAGS.PRINT_JOBS, id: "STATS" }]
    }),

    createPrintJob: builder.mutation<PrintJob, CreatePrintJobRequest>({
      query: (printJobData) => ({
        url: API_ROUTES.PRINT_JOBS.CREATE,
        method: "POST",
        body: printJobData
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
      invalidatesTags: [
        { type: RTK_TAGS.PRINT_JOBS, id: "LIST" },
        { type: RTK_TAGS.PRINT_JOBS, id: "STATS" }
      ]
    }),

    getUserPrintJobs: builder.query<
      PaginatedResponse<PrintJob>,
      PrintJobQueryParams
    >({
      query: (params) => ({
        url: API_ROUTES.PRINT_JOBS.LIST,
        method: "GET",
        params
      }),
      transformResponse: (response: any) => {
        // Handle response structure: { success, message, data, meta }
        if (response?.data && response?.meta) {
          return {
            data: response.data,
            meta: {
              total: response.meta.total || 0,
              page: typeof response.meta.page === 'string'
                ? parseInt(response.meta.page, 10)
                : response.meta.page || 1,
              limit: typeof response.meta.limit === 'string'
                ? parseInt(response.meta.limit, 10)
                : response.meta.limit || 10,
              totalPages: response.meta.totalPages || 1
            }
          };
        }
        // Fallback to old structure
        return response?.response || response;
      },
      providesTags: () => [{ type: RTK_TAGS.PRINT_JOBS, id: "LIST" }]
    }),

    getPrintJobById: builder.query<PrintJob, string>({
      query: (jobId) => ({
        url: API_ROUTES.PRINT_JOBS.DETAIL(jobId),
        method: "GET"
      }),
      transformResponse: (response: any) => {
        return response?.data || response?.response || response;
      },
      providesTags: (_result, _error, jobId) => [
        { type: RTK_TAGS.PRINT_JOBS, id: jobId }
      ]
    }),

    cancelPrintJob: builder.mutation<
      PrintJob,
      { jobId: string; data: CancelPrintJobRequest }
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

    deletePrintJob: builder.mutation<void, string>({
      query: (jobId) => ({
        url: API_ROUTES.PRINT_JOBS.DELETE(jobId),
        method: "DELETE"
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: RTK_TAGS.PRINT_JOBS, id: jobId },
        { type: RTK_TAGS.PRINT_JOBS, id: "LIST" },
        { type: RTK_TAGS.PRINT_JOBS, id: "STATS" }
      ]
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
  useDeletePrintJobMutation
} = printJobsApi;
