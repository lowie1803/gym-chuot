import { useState } from "react";

export default function WorkoutMessageCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.05))", border: "1px solid rgba(255,107,53,0.3)", borderRadius: "12px 4px 12px 12px", overflow: "hidden", minWidth: 260 }}>
      <div style={{ padding: "12px 14px", borderBottom: expanded ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>💪</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff" }}>{data.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{data.exercises.length} bài tập · {data.exercises.reduce((a, e) => a + e.sets.length, 0)} sets tổng</div>
          </div>
          <button onClick={() => setExpanded(!expanded)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#aaa", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "10px 14px" }}>
          {data.exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{ex.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{ex.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                  {ex.sets.length} sets × {ex.sets[0].reps} reps
                  {ex.sets[0].weight > 0 && ` @ ${ex.sets[0].weight}kg`}
                </div>
              </div>
            </div>
          ))}
          <button style={{ marginTop: 6, width: "100%", background: "linear-gradient(135deg, #FF6B35, #ff9f35)", border: "none", color: "#fff", borderRadius: 8, padding: "8px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, cursor: "pointer" }}>
            🏋️ BẮT ĐẦU TẬP
          </button>
        </div>
      )}
    </div>
  );
}
