import { getConversationId } from "../../lib/utils";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function getSubtitle(preview) {
  if (!preview?.lastMessage) return "Nhấn để nhắn tin";
  const { type, text } = preview.lastMessage;
  if (type === "workout") return "\ud83d\udccb \u0110\u00e3 g\u1eedi b\u00e0i t\u1eadp";
  if (type === "video") return "\ud83d\udcce \u0110\u00e3 g\u1eedi video";
  if (text) return text.length > 30 ? text.slice(0, 30) + "\u2026" : text;
  return "Nhấn để nhắn tin";
}

export default function ConversationList({ selectedStudent, setSelectedStudent, previews, currentUserId, students }) {
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
          students.map((student, i) => {
            const convId = getConversationId(currentUserId, student.id);
            const preview = previews[convId];
            const unread = preview?.unreadCount || 0;
            const timestamp = preview?.lastMessage?.created_at;

            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: student.id === selectedStudent?.id ? "rgba(0,212,255,0.1)" : "transparent", border: student.id === selectedStudent?.id ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent" }}
              >
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${i * 80 + 180}, 70%, 40%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, position: "relative" }}>
                  🧑
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: student.id === selectedStudent?.id ? "#00d4ff" : "#d0d0d0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.full_name}</div>
                    {timestamp && (
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{formatTime(timestamp)}</div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {getSubtitle(preview)}
                  </div>
                </div>
                {unread > 0 && (
                  <div style={{ minWidth: 18, height: 18, borderRadius: 9, background: "#00d4ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#000", padding: "0 5px", flexShrink: 0 }}>
                    {unread}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
