// src/api/endpoints.ts
import API from "./base";

// Login
export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/api/Account/login", { email, password });
  return res.data;
};

// Register
export const registerUser = async (data: {
  displayName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
}) => {
  const res = await API.post("/api/Account/register", data);
  return res.data;
};

// Forgot Password
export const forgotPassword = async (email: string) => {
  const res = await API.post("/Account/forgotPassword", { email });
  return res.data;
};

// Reset Password
export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const res = await API.post("/Account/resetPassword", { email, code, password: newPassword });
  return res.data;
};
