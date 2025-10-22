import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { logOut } from "@/store/features/auth/authSlice";
import { RootState } from "@/store";
import { ApiErrorData } from "@/utils/apiErrorHandler";
import { CONST_CONFIG, RTK_TAGS } from "@/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: CONST_CONFIG.baseUrl,
  timeout: CONST_CONFIG.timeout,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

type CustomError = FetchBaseQueryError & {
  data: ApiErrorData;
};

type CustomBaseQuery = BaseQueryFn<
  string | { url: string; method?: string; body?: unknown },
  unknown,
  CustomError,
  object
>;

const customBaseQuery: CustomBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logOut());
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result as any;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: Object.values(RTK_TAGS),
  endpoints: () => ({}),
});
