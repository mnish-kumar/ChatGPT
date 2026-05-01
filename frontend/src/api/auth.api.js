import api from "../api/axios";

// ─── Register ───────────────────────────────
export async function register({ fullname, username, email, password }) {
  try {
    const response = await api.post("/auth/register", {
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      username,
      email,
      password,
    });
    
    console.log("Registration successful:", response.data);
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
}

// ─── Login ─────────────────────────────────
export async function login({ username, email, password }) {
  try {
    const response = await api.post("/auth/login", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
}


// ─── Logout ───────────────────────────────
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    throw error.response?.data || { message: "Logout failed" };
  }
}

// ─── Check Authentication ───────────────────────────────
export async function getMe() {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user data" };
  }
}

// ─── Request Password Reset ───────────────────────────────
export async function requestPasswordReset({ email }) {
  try {
    const response = await api.post("/auth/request-password-reset", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to send reset email" };
  }
}

// ─── Verify Reset Token ───────────────────────────────────
export async function verifyResetToken({ token, id }) {
  try {
    const response = await api.post("/auth/verify-reset-token", { token, id });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Invalid or expired token" };
  }
}

// ─── Reset Password ───────────────────────────────────────
export async function resetPassword({
  token,
  id,
  newPassword,
  confirmPassword,
}) {
  try {
    const response = await api.post("/auth/reset-password", {
      token,
      id,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to reset password" };
  }
}

// ─── Send Verification Email ──────────────────────────────
export async function sendVerificationEmail({ email }) {
  try {
    const response = await api.post("/auth/send-verification-email", { email });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to send verification email" }
    );
  }
}

// ─── Resend Verification Email ────────────────────────────
export async function resendVerificationEmail({ email }) {
  try {
    const response = await api.post("/auth/resend-verification-email", {
      email,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to resend verification email" }
    );
  }
}

// ─── Google Login ─────────────────────────────────────────
export function googleLogin() {
  // Browser redirect hoga — axios nahi
  window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google`;
}

// ─── 2FA Setup ────────────────────────────────────────────
export async function setup2FA() {
  try {
    const response = await api.post("/auth/2fa/setup");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to setup 2FA" };
  }
}

// ─── 2FA Enable ───────────────────────────────────────────
export async function enable2FA({ otp }) {
  try {
    const response = await api.post("/auth/2fa/enable", { otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to enable 2FA" };
  }
}

// ─── 2FA Verify ───────────────────────────────────────────
export async function verify2FA({ userId, otp }) {
  try {
    const response = await api.post("/auth/2fa/verify", { userId, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Invalid OTP" };
  }
}

// ─── 2FA Disable ──────────────────────────────────────────
export async function disable2FA({ otp }) {
  try {
    const response = await api.post("/auth/2fa/disable", { otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to disable 2FA" };
  }
}
