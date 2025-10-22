import { api } from "./client";
export const forgotPassword = (email: string) => api.post("/api/Account/forgotPassword", { email });
export const resetPassword = (email: string, token: string, newPassword: string) =>
  api.post("/api/Account/resetPassword", { email, token, newPassword });

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export async function changePassword(dto: ChangePasswordDto) {
  return api.post("/api/account/change-password", dto);
}