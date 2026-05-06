import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout, verify2FA } from "../api/auth.api";
import api from "../api/axios";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      return response;
    } catch (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : error?.message || error?.errors?.[0]?.msg || "Registration failed";
      return rejectWithValue(errorMsg);
    }
  },
);

// ─── Login ────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await login(credentials);

      // If 2FA is required, backend returns a temp token and no access token.
      if (data?.twoFactorRequired) {
        return data;
      }

      // Ensure we hydrate the latest user snapshot (includes `plan`, etc.)
      const accessToken = data?.accessToken;
      if (accessToken) {
        const meRes = await api.get("/api/auth/get-me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const user = meRes.data?.data;
        if (user) {
          return { ...data, user };
        }
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  },
);

// ─── Logout ───────────────────────────────────────────────
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  },
);

// ─── Check Auth (App start) ────────────────────────────
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const refreshRes = await api.post("/api/auth/refresh-token");
      const accessToken = refreshRes.data?.accessToken;

      if (!accessToken) {
        return rejectWithValue("Not authenticated");
      }

      // refresh-token does not return user
      const meRes = await api.get("/api/auth/get-me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = meRes.data?.data;

      return { accessToken, user };
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  },
);

// ─── Verify 2FA ─────────────────────────────────────────
export const verify2FALogin = createAsyncThunk(
  "user/verify2FA",
  async ({ tempToken, otp }, { rejectWithValue }) => {
    try {
      const data = await verify2FA({ tempToken, otp });

      // Backend verify2FA response may not include `plan`. Hydrate full user.
      const accessToken = data?.accessToken;
      if (accessToken) {
        const meRes = await api.get("/api/auth/get-me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const user = meRes.data?.data;
        if (user) {
          return { ...data, user };
        }
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Invalid OTP");
    }
  },
);
