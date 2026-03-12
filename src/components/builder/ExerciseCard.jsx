import { useState } from "react";
import { EQUIPMENT_COLOR } from "../../constants";
import SetInput from "./SetInput";

export default function ExerciseCard({ exercise, index, onUpdate, onRemove, isDragging, onDragStart, onDragOver, onDrop }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
      onDrop={(e) => onDrop(e, index)}
      style={{
        opacity: isDragging ? 0.4 : 1,
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: `3px solid ${EQUIPMENT_COLOR[exercise.equipment] || "#888"}`,
        borderRadius: 12,
        marginBottom: 8,
        overflow: "hidden",
        cursor: "grab",
        transition: "all 0.2s",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", gap: 10 }}>
        <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>{exercise.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", letterSpacing: 0.5 }}>
            {exercise.name}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>
            <span style={{ color: EQUIPMENT_COLOR[exercise.equipment], fontWeight: 600 }}>{exercise.equipment}</span>
            {" · "}{exercise.muscle}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setExpanded(!expanded)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#aaa", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            {expanded ? "▲" : "▼"}
          </button>
          <button onClick={() => onRemove(index)} style={{ background: "rgba(255,80,80,0.1)", border: "none", color: "#ff6b6b", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
            ×
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 14px 14px" }}>
          {exercise.sets.map((set, si) => (
            <div key={si} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", width: 40, fontFamily: "monospace" }}>Set {si + 1}</div>
              <SetInput label="Reps" value={set.reps} unit="lần" onChange={v => onUpdate(index, si, "reps", v)} color="#00d4ff" />
              <SetInput label="Weight" value={set.weight} unit="kg" onChange={v => onUpdate(index, si, "weight", v)} color="#FF6B35" />
              <SetInput label="Rest" value={set.rest} unit="s" onChange={v => onUpdate(index, si, "rest", v)} color="#34D399" />
              {exercise.sets.length > 1 && (
                <button onClick={() => onUpdate(index, si, "_remove")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer", fontSize: 14, padding: "0 2px" }}>×</button>
              )}
            </div>
          ))}
          <button
            onClick={() => onUpdate(index, -1, "_addSet")}
            style={{ marginTop: 4, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 12, width: "100%" }}
          >
            + Thêm set
          </button>
        </div>
      )}
    </div>
  );
}
