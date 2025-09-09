import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export default function Protected({ children }: { children: ReactNode }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
