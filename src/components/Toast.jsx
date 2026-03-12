export default function Toast({ show, workoutName, studentName }) {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: "linear-gradient(135deg, #00d4ff, #0070ff)", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,212,255,0.4)", animation: "toastIn 0.3s ease", zIndex: 9999 }}>
      <span style={{ fontSize: 20 }}>✅</span>
      <div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>Đã gửi bài tập!</div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>{workoutName} → {studentName}</div>
      </div>
    </div>
  );
}
