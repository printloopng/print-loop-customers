import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/store/services/apiSlice";
import authReducer from "@/store/features/auth/authSlice";
import { errorMiddleware } from "@/utils/apiErrorHandler";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, errorMiddleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
