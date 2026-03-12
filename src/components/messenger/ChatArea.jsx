import { useState, useRef, useEffect } from "react";
import WorkoutMessageCard from "./WorkoutMessageCard";

export default function ChatArea({ selectedStudent, messages, sendMessage, setActiveTab, currentUserId }) {
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput);
    setChatInput("");
  };

  if (!selectedStudent) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
        Chọn một cuộc trò chuyện để bắt đầu
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #4ECDC4, #45B7D1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧑</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedStudent.full_name}</div>
          <div style={{ fontSize: 12, color: "#34D399", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399" }} /> Online
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setActiveTab("builder")}
          style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5 }}
        >
          📋 TẠO BÀI TẬP MỚI
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg) => {
          const isSelf = msg.sender_id === currentUserId;
          const senderName = msg.sender?.full_name || "";

          // Build workout data for card if it's a workout message
          const workoutData = msg.workout ? {
            name: msg.workout.name,
            exercises: (msg.workout.workout_exercises || [])
              .sort((a, b) => a.order_index - b.order_index)
              .map(e => ({ name: e.exercise_name, icon: e.exercise_icon, sets: e.sets })),
          } : null;

          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: isSelf ? "row-reverse" : "row", gap: 8, alignItems: "flex-end", animation: "slideIn 0.2s ease" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: isSelf ? "linear-gradient(135deg, #FF6B35, #ff9f35)" : "linear-gradient(135deg, #4ECDC4, #45B7D1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                {isSelf ? "🏆" : "🧑"}
              </div>
              <div style={{ maxWidth: "70%" }}>
                {msg.type === "workout" && workoutData ? (
                  <WorkoutMessageCard data={workoutData} />
                ) : (
                  <div style={{
                    background: isSelf ? "linear-gradient(135deg, rgba(0,100,200,0.4), rgba(0,180,255,0.2))" : "rgba(255,255,255,0.07)",
                    border: isSelf ? "1px solid rgba(0,212,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: isSelf ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
                    padding: "10px 14px",
                  }}>
                    <div style={{ fontSize: 14, color: "#e8e8e8", lineHeight: 1.5 }}>{msg.text}</div>
                  </div>
                )}
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4, textAlign: isSelf ? "right" : "left" }}>
                  {new Date(msg.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, alignItems: "center" }}>
        <button
          onClick={() => setActiveTab("builder")}
          title="Gửi bài tập"
          style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff", fontSize: 18, cursor: "pointer", flexShrink: 0 }}
        >📋</button>
        <button title="Đính kèm video" style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer", flexShrink: 0 }}>📎</button>
        <input
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder={`Nhắn tin cho ${selectedStudent.full_name}...`}
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }}
        />
        <button
          onClick={handleSend}
          style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #00d4ff, #0070ff)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", flexShrink: 0 }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
