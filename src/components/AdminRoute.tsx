import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const role = localStorage.getItem("role");

  if (role !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
