export default function WorkoutSummaryCard({ exercises }) {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalRest = exercises.reduce((acc, ex) => acc + ex.sets.reduce((a, s) => a + s.rest, 0), 0);
  const estTime = Math.round((totalSets * 60 + totalRest) / 60);

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      {[
        { label: "Bài tập", value: exercises.length, icon: "📋", color: "#A78BFA" },
        { label: "Tổng sets", value: totalSets, icon: "🔄", color: "#00d4ff" },
        { label: "Est. time", value: `~${estTime}ph`, icon: "⏱️", color: "#FF6B35" },
      ].map(item => (
        <div key={item.label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 18 }}>{item.icon}</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: item.color, lineHeight: 1.1 }}>{item.value}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
