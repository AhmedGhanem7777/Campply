import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");
const getRole  = () => localStorage.getItem("role")  || sessionStorage.getItem("role")  || "";

export const ProtectedRoute = ({ children, allow }: { children: ReactNode; allow: string[] }) => {
  const location = useLocation();
  const token = getToken();
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  const role = getRole();
  if (!allow.includes(role)) return <Navigate to="/home" replace />;
  return <>{children}</>;
};

export const GuestOnlyRoute = ({ children }: { children: ReactNode }) => {
  const token = getToken();
  const role  = getRole();
  if (!token) return <>{children}</>;
  if (role === "مسؤول" || role === "صاحب_مخيم") return <Navigate to="/dashboard" replace />;
  return <Navigate to="/home" replace />;
};
