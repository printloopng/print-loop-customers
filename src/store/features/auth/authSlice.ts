import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "./types";
import { STORAGE_KEYS } from "@/constants";
import { decryptData, encryptData } from "@/utils/encryptData";
import { apiSlice } from "@/store/services/apiSlice";

const initialState: AuthState = {
  accessToken:
    JSON.parse(decryptData(STORAGE_KEYS.USER_INFO) || null)?.accessToken ||
    null,
  refreshToken:
    JSON.parse(decryptData(STORAGE_KEYS.USER_INFO) || null)?.refreshToken ||
    null,
  user: JSON.parse(decryptData(STORAGE_KEYS.USER_INFO) || null)?.user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user || null;

      encryptData(
        {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          user: action.payload.user,
        },
        STORAGE_KEYS.USER_INFO
      );
    },
    logOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      localStorage.clear();
      localStorage.removeItem(STORAGE_KEYS.PUSH_SUBSCRIPTION);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_INFO);
      apiSlice.util.resetApiState();
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
