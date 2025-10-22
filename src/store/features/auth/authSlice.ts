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
  permissions:
    JSON.parse(decryptData(STORAGE_KEYS.USER_INFO) || null)?.permissions || [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user || null;
      state.permissions = action.payload.permissions || [];

      encryptData(
        {
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          user: action.payload.user,
          permissions: action.payload.permissions,
        },
        STORAGE_KEYS.USER_INFO
      );
    },
    setPermissions: (state, action: PayloadAction<any[]>) => {
      state.permissions = action.payload;
    },
    logOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.permissions = [];
      localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      localStorage.clear();
      localStorage.removeItem(STORAGE_KEYS.PUSH_SUBSCRIPTION);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_INFO);
      apiSlice.util.resetApiState();
    },
  },
});

export const { setCredentials, logOut, setPermissions } = authSlice.actions;
export default authSlice.reducer;
