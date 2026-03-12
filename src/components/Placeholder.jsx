export default function Placeholder({ tab }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "rgba(255,255,255,0.2)" }}>
      <div style={{ fontSize: 48 }}>{tab === "students" ? "👥" : "📊"}</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700 }}>
        {tab === "students" ? "Quản lý học viên" : "Thống kê tiến độ"}
      </div>
      <div style={{ fontSize: 13 }}>Tính năng đang phát triển · Coming soon</div>
    </div>
  );
}
