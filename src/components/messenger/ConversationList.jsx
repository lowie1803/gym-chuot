export default function ConversationList({ selectedStudent, setSelectedStudent, workoutSent, students }) {
  return (
    <div style={{ width: 240, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 0.5, marginBottom: 10 }}>Tin nhắn</div>
        <input placeholder="Tìm học viên..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", color: "#fff", fontSize: 12, outline: "none" }} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
        {students.length === 0 ? (
          <div style={{ padding: "20px 10px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
            Chưa có cuộc trò chuyện
          </div>
        ) : (
          students.map((student, i) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: student.id === selectedStudent?.id ? "rgba(0,212,255,0.1)" : "transparent", border: student.id === selectedStudent?.id ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent" }}
            >
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${i * 80 + 180}, 70%, 40%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, position: "relative" }}>
                🧑
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: student.id === selectedStudent?.id ? "#00d4ff" : "#d0d0d0" }}>{student.full_name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Nhấn để nhắn tin
                </div>
              </div>
              {i === 0 && workoutSent && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d4ff", flexShrink: 0 }} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
