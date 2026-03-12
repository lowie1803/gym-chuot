import { SAMPLE_STUDENTS } from "../../constants";

export default function ConversationList({ selectedStudent, setSelectedStudent, workoutSent }) {
  return (
    <div style={{ width: 240, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 0.5, marginBottom: 10 }}>Tin nhắn</div>
        <input placeholder="Tìm học viên..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", color: "#fff", fontSize: 12, outline: "none" }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        {SAMPLE_STUDENTS.map((name, i) => (
          <div
            key={name}
            onClick={() => setSelectedStudent(name)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: name === selectedStudent ? "rgba(0,212,255,0.1)" : "transparent", border: name === selectedStudent ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent" }}
          >
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${i * 80 + 180}, 70%, 40%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, position: "relative" }}>
              🧑
              {i === 0 && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#34D399", border: "2px solid #0d0d16" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: name === selectedStudent ? "#00d4ff" : "#d0d0d0" }}>{name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {i === 0 ? "💪 Push Day A - Tuần 3" : "Xem lịch tập..."}
              </div>
            </div>
            {i === 0 && workoutSent && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d4ff", flexShrink: 0 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
