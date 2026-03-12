import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        background: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.3)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 14,
      }}>
        Đang tải...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return children;
}
