import { useState } from "react";
import { EXERCISE_LIBRARY, EQUIPMENT_COLOR } from "../../constants";

export default function ExerciseLibrary({ addExercise, setDraggingFromLibrary }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Ngực");

  const filteredExercises = Object.entries(EXERCISE_LIBRARY).reduce((acc, [cat, exs]) => {
    if (searchQuery) {
      const filtered = exs.filter(e =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.muscle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length) acc[cat] = filtered;
    } else if (cat === activeCategory) {
      acc[cat] = exs;
    }
    return acc;
  }, {});

  return (
    <div style={{ width: 260, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "16px 14px 12px" }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10 }}>
          Thư viện bài tập
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(255,255,255,0.2)" }}>🔍</span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm bài tập..."
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 10px 8px 32px", color: "#fff", fontSize: 13, outline: "none" }}
          />
        </div>

        {!searchQuery && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
            {Object.keys(EXERCISE_LIBRARY).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${activeCategory === cat ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color: activeCategory === cat ? "#00d4ff" : "rgba(255,255,255,0.5)",
                  borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 16px" }}>
        {Object.entries(filteredExercises).map(([cat, exs]) => (
          <div key={cat}>
            {searchQuery && (
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase", padding: "8px 4px 4px", fontWeight: 700 }}>{cat}</div>
            )}
            {exs.map(ex => (
              <div
                key={ex.id}
                draggable
                onDragStart={(e) => { setDraggingFromLibrary(ex); e.dataTransfer.effectAllowed = "copy"; }}
                onDragEnd={() => setDraggingFromLibrary(null)}
                onDoubleClick={() => addExercise(ex)}
                title="Kéo vào builder hoặc double-click để thêm"
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "grab", marginBottom: 3,
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,212,255,0.07)"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}
              >
                <span style={{ fontSize: 18, width: 26, textAlign: "center" }}>{ex.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ex.name}</div>
                  <div style={{ fontSize: 10, marginTop: 1 }}>
                    <span style={{ color: EQUIPMENT_COLOR[ex.equipment] || "#888", fontWeight: 600 }}>{ex.equipment}</span>
                    <span style={{ color: "rgba(255,255,255,0.25)" }}> · {ex.muscle}</span>
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.15)" }}>⋮⋮</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
