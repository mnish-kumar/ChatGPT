import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout } from "../api/auth.api";
import api from "../api/axios";

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      return response;
    } catch (error) {
      const errorMsg = typeof error === 'string' ? error : error?.message || error?.errors?.[0]?.msg || "Registration failed";
      return rejectWithValue(errorMsg);
    }
  }
);


// ─── Login ────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await login(credentials);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
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
  }
);

// ─── Check Auth (App start) ────────────────────────────
export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/refresh-token");
      return response.data; // { accessToken, user }
    } catch (error) {
      return rejectWithValue("Not authenticated");
    }
  }
);