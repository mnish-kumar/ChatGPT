import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "../userAction";

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
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
    // builder
    //   .addCase(loginUser.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(loginUser.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.user = action.payload.user;
    //     state.accessToken = action.payload.accessToken;
    //     state.isAuthenticated = true;
    //   })
    //   .addCase(loginUser.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload;
    //   });

    // // ─── Logout ────────────────────────────────
    // builder
    //   .addCase(logoutUser.fulfilled, (state) => {
    //     state.user = null;
    //     state.accessToken = null;
    //     state.isAuthenticated = false;
    //     state.isLoading = false;
    //     state.error = null;
    //   });

    // // ─── Check Auth ────────────────────────────
    // builder
    //   .addCase(checkAuth.pending, (state) => {
    //     state.isLoading = true;
    //   })
    //   .addCase(checkAuth.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     state.user = action.payload.user;
    //     state.accessToken = action.payload.accessToken;
    //     state.isAuthenticated = true;
    //   })
    //   .addCase(checkAuth.rejected, (state) => {
    //     state.isLoading = false;
    //     state.user = null;
    //     state.accessToken = null;
    //     state.isAuthenticated = false;
    //   });
  },
});

export const { setAccessToken, clearError, resetAuth } = userSlice.actions;
export default userSlice.reducer;
