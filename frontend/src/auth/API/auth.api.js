import axios from "axios";

const api = axios.create({
  withCredentials: true,
});

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export async function login({ email, password, username }) {
  try {
    const response = await api.post(
      `${BASE_URL}/api/auth/login`,
      { email, password, username }
    );

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data || { message: "Login failed" };
  }
}

export async function register({ fullname, email, password, username }) {
  const formatedData = {
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email: email,
    password: password,
    username: username
  };

  try {
    const response = await api.post(
      `${BASE_URL}/api/auth/register`,
      formatedData
    );
    
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error.response?.data || { message: "Registration failed" };
  }
}

export async function logout() {
  try {
    const response = await api.post(`${BASE_URL}/api/auth/logout`);

    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error.response?.data || { message: "Logout failed" };
  }
}

export async function getMe() {
  try {
    const response = await api.get(`${BASE_URL}/api/auth/get-me`);

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error.response?.data || { message: "Failed to get user data" };
  }
}
