export default function SetInput({ label, value, unit, onChange, color }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 2, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", borderRadius: 6, border: `1px solid ${color}22`, overflow: "hidden" }}>
        <input
          type="number"
          value={value}
          onChange={e => onChange(parseInt(e.target.value) || 0)}
          style={{ width: 36, background: "none", border: "none", color, fontFamily: "'Barlow Condensed', monospace", fontSize: 15, fontWeight: 700, textAlign: "center", outline: "none", padding: "4px 2px" }}
        />
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", paddingRight: 4 }}>{unit}</span>
      </div>
    </div>
  );
}
