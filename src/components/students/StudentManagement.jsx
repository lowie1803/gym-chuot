import { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

export default function StudentManagement() {
  const { profile } = useAuth();
  const { students, loading, addStudentById, acceptInvite, removeStudent } = useStudents();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Look up user by email via profiles (requires a db function or workaround)
    // For now, we search profiles joined with auth - but Supabase client can't query auth.users
    // So we use a simple RPC or just search by email in a custom way
    // Simplest: ask PT to enter student's user ID or use an invite code system
    // For MVP: use email-based lookup via a server function

    // Attempt: look up by email using Supabase admin or RPC
    // Fallback for MVP: use the profiles table if we add email to it
    const { data: foundProfiles } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .ilike("full_name", `%${email}%`);

    if (!foundProfiles || foundProfiles.length === 0) {
      setError("Không tìm thấy người dùng. Hãy nhập tên chính xác.");
      return;
    }

    const target = foundProfiles.find((p) => p.role === "student");
    if (!target) {
      setError("Người dùng này không phải là học viên.");
      return;
    }

    const { error: addErr } = await addStudentById(target.id);
    if (addErr) {
      setError(addErr.message);
    } else {
      setSuccess(`Đã gửi lời mời cho ${target.full_name}`);
      setEmail("");
    }
  };

  const isPT = profile?.role === "pt";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: 0.5 }}>
          {isPT ? "Quản lý học viên" : "PT của tôi"}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        {isPT && (
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tìm học viên theo tên..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #00d4ff, #0070ff)",
                border: "none",
                borderRadius: 10,
                padding: "10px 18px",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: 1,
              }}
            >
              THÊM
            </button>
          </form>
        )}

        {error && (
          <div style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#ff6b6b", marginBottom: 12 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#34D399", marginBottom: 12 }}>
            {success}
          </div>
        )}

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, textAlign: "center", padding: 40 }}>Đang tải...</div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
              {isPT ? "Chưa có học viên" : "Chưa có PT"}
            </div>
            <div style={{ fontSize: 13 }}>
              {isPT ? "Thêm học viên bằng cách nhập tên ở trên" : "Đợi PT gửi lời mời cho bạn"}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {students.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #4ECDC4, #45B7D1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>
                  {isPT ? "🧑" : "🏆"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.full_name}</div>
                  <div style={{ fontSize: 12, color: s.status === "active" ? "#34D399" : "#FBBF24" }}>
                    {s.status === "active" ? "Đang hoạt động" : "Chờ xác nhận"}
                  </div>
                </div>
                {!isPT && s.status === "pending" && (
                  <button
                    onClick={() => acceptInvite(s.id)}
                    style={{
                      background: "rgba(52,211,153,0.15)",
                      border: "1px solid rgba(52,211,153,0.3)",
                      borderRadius: 8,
                      padding: "6px 14px",
                      color: "#34D399",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Chấp nhận
                  </button>
                )}
                {isPT && (
                  <button
                    onClick={() => removeStudent(s.id)}
                    style={{
                      background: "rgba(255,59,48,0.1)",
                      border: "1px solid rgba(255,59,48,0.2)",
                      borderRadius: 8,
                      padding: "6px 14px",
                      color: "#ff6b6b",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
