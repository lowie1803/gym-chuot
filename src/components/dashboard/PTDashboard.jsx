import { formatRelativeTime } from "../../lib/utils";

export default function PTDashboard({ students, recentWorkouts, loading, onNavigateToStudent }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
      {/* Students section */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: 0.5 }}>
          Học viên
        </h2>
        {students.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Chưa có học viên nào</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {students.map(s => (
              <button
                key={s.id}
                onClick={() => onNavigateToStudent(s.id)}
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: 16, cursor: "pointer", textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(0,212,255,0.08)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", margin: "0 auto 10px",
                  background: "linear-gradient(135deg, #FF6B35, #ff9f35)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>
                  {s.avatar_url ? (
                    <img src={s.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                  ) : "🧑"}
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  {s.full_name}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 6 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: s.status === "active" ? "#4ade80" : "rgba(255,255,255,0.2)",
                  }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                    {s.status === "active" ? "Đang tập" : "Chờ"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent workouts section */}
      <div>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: 0.5 }}>
          Bài tập gần đây
        </h2>
        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Đang tải...</div>
        ) : recentWorkouts.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>Chưa gửi bài tập nào</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recentWorkouts.map(w => (
              <div key={w.id} style={{
                background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    {w.workoutName}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
                    → {w.studentName}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
                  {formatRelativeTime(w.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
