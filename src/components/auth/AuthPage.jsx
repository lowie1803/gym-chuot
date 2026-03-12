import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("pt");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = isLogin
      ? await signIn({ email, password })
      : await signUp({ email, password, fullName, role });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate("/");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "12px 14px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      color: "#fff",
    }}>
      <div style={{
        width: 380,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "40px 32px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #00d4ff, #0070ff)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, marginBottom: 12,
            boxShadow: "0 0 30px rgba(0,212,255,0.3)",
          }}>
            🐭
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 28, fontWeight: 800, letterSpacing: 1,
          }}>
            GymChuot
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
            {isLogin ? "Đăng nhập vào tài khoản" : "Tạo tài khoản mới"}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Họ tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { value: "pt", label: "🏆 Personal Trainer" },
                  { value: "student", label: "🧑 Học viên" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 10,
                      border: role === opt.value
                        ? "1px solid rgba(0,212,255,0.5)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: role === opt.value
                        ? "rgba(0,212,255,0.1)"
                        : "rgba(255,255,255,0.03)",
                      color: role === opt.value ? "#00d4ff" : "rgba(255,255,255,0.5)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          {error && (
            <div style={{
              background: "rgba(255,59,48,0.1)",
              border: "1px solid rgba(255,59,48,0.3)",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              color: "#ff6b6b",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #00d4ff, #0070ff)",
              border: "none",
              borderRadius: 10,
              padding: "12px",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: 1,
              boxShadow: "0 4px 20px rgba(0,212,255,0.3)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "..." : isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </button>
        </form>

        <div style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 13,
          color: "rgba(255,255,255,0.4)",
        }}>
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{
              background: "none",
              border: "none",
              color: "#00d4ff",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </div>
      </div>
    </div>
  );
}
