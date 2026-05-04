import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuth,
  verify2FALogin,
} from "../userAction";

const initialState = {
  user: null,
  accessToken: null, // ← memory me store
  isAuthenticated: false,
  isLoading: true,
  error: null,
  twoFactorRequired: false,
  tempToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Access token set karo (refresh ke baad)
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    // Error clear karo
    clearError: (state) => {
      state.error = null;
    },
    // Manual logout (token expire pe)
    resetAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    cancelTwoFactor: (state) => {
      state.twoFactorRequired = false;
      state.tempToken = null;
      state.error = null;
      state.isLoading = false;
    },
    setPremium: (state) => {
      if (state.user) {
        state.user.plan = {
          type: "PREMIUM",
          startDate: new Date().toISOString(),
          expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
      }
    },
  },
  extraReducers: (builder) => {
    // ─── Register ──────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ─── Login ─────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload?.twoFactorRequired) {
          state.twoFactorRequired = true;
          state.tempToken = action.payload.tempToken;
          state.user = null;
          state.accessToken = null;
          state.isAuthenticated = false;
          return;
        }

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // ─── Logout ────────────────────────────────
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });

    // ─── Check Auth ────────────────────────────
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });

    // ─── Verify 2FA ─────────────────────────────────
    builder
      .addCase(verify2FALogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verify2FALogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.twoFactorRequired = false;
        state.tempToken = null;
      })
      .addCase(verify2FALogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setAccessToken, clearError, resetAuth, cancelTwoFactor, setPremium } =
  userSlice.actions;
export default userSlice.reducer;
