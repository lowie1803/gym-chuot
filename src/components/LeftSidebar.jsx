const PT_TABS = [
  { id: "builder", icon: "📋", label: "Builder" },
  { id: "messenger", icon: "💬", label: "Tin nhắn" },
  { id: "students", icon: "👥", label: "Học viên" },
  { id: "dashboard", icon: "📊", label: "Tổng quan" },
];

const STUDENT_TABS = [
  { id: "messenger", icon: "💬", label: "Tin nhắn" },
  { id: "students", icon: "👥", label: "PT của tôi" },
];

export default function LeftSidebar({ activeTab, setActiveTab, role, onSignOut }) {
  const tabs = role === "student" ? STUDENT_TABS : PT_TABS;

  return (
    <div style={{ width: 64, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 8, flexShrink: 0 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #00d4ff, #0070ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16, boxShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
        🐭
      </div>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          title={tab.label}
          style={{
            width: 44, height: 44, borderRadius: 10, border: "none", cursor: "pointer",
            background: activeTab === tab.id ? "rgba(0,212,255,0.15)" : "transparent",
            color: activeTab === tab.id ? "#00d4ff" : "rgba(255,255,255,0.3)",
            fontSize: 20, transition: "all 0.2s",
            boxShadow: activeTab === tab.id ? "inset 0 0 0 1px rgba(0,212,255,0.3)" : "none",
          }}
        >
          {tab.icon}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      {onSignOut && (
        <button
          onClick={onSignOut}
          title="Đăng xuất"
          style={{
            width: 44, height: 44, borderRadius: 10, border: "none", cursor: "pointer",
            background: "transparent", color: "rgba(255,255,255,0.2)", fontSize: 18,
            transition: "all 0.2s", marginBottom: 8,
          }}
        >
          🚪
        </button>
      )}
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #ff9f35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
        {role === "student" ? "🧑" : "🏆"}
      </div>
    </div>
  );
}
