import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("sairna_token");

  // إذا لم يكن المستخدم مسجلًا، نعيده إلى صفحة الدخول
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
