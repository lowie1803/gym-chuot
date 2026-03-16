export default function TemplatePanel({ templates, onLoad, onDelete, onClose }) {
  return (
    <div style={{
      width: 340, background: "#12121f", borderLeft: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff" }}>
          Mẫu bài tập
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}
        >
          ✕
        </button>
      </div>

      {/* Template list */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {templates.length === 0 ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "40px 16px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              Chưa có mẫu nào
            </div>
            <div style={{ fontSize: 12 }}>Tạo bài tập rồi bấm "Lưu mẫu" để lưu lại</div>
          </div>
        ) : (
          templates.map(t => {
            const exerciseList = (t.workout_exercises || [])
              .sort((a, b) => a.order_index - b.order_index);
            return (
              <div key={t.id} style={{
                background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14,
                marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                  {exerciseList.map(e => `${e.exercise_icon || "💪"} ${e.exercise_name}`).join(" · ")}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 10 }}>
                  {exerciseList.length} bài tập · {new Date(t.created_at).toLocaleDateString("vi-VN")}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => onLoad(t.id)}
                    style={{
                      flex: 1, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)",
                      color: "#00d4ff", borderRadius: 8, padding: "6px 12px", fontSize: 12,
                      fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
                    }}
                  >
                    TẢI VÀO
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    style={{
                      background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)",
                      color: "rgba(255,80,80,0.7)", borderRadius: 8, padding: "6px 12px", fontSize: 12,
                      fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
                    }}
                  >
                    XÓA
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
