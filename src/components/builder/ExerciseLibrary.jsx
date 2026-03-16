import { useState, useEffect } from "react";
import { useExerciseSearch } from "../../hooks/useExercises";
import ExerciseTile from "./ExerciseTile";

const VIEW_MODES = [
  { key: "grid-2", icon: "▦" },
  { key: "grid-3", icon: "▤" },
  { key: "list", icon: "≡" },
];

export default function ExerciseLibrary({ exercises, categories, addExercise }) {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("gymchuot-library-view") || "grid-2";
  });

  useEffect(() => {
    localStorage.setItem("gymchuot-library-view", viewMode);
  }, [viewMode]);

  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    filtered,
  } = useExerciseSearch(exercises, categories);

  const gridStyle =
    viewMode === "grid-2"
      ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }
      : viewMode === "grid-3"
        ? { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }
        : { display: "flex", flexDirection: "column", gap: 2 };

  return (
    <div
      style={{
        width: 320,
        background: "#0d0d16",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "16px 14px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
            }}
          >
            Thư viện bài tập
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {VIEW_MODES.map((vm) => (
              <button
                key={vm.key}
                onClick={() => setViewMode(vm.key)}
                style={{
                  background:
                    viewMode === vm.key
                      ? "rgba(0,212,255,0.15)"
                      : "rgba(255,255,255,0.04)",
                  border:
                    viewMode === vm.key
                      ? "1px solid rgba(0,212,255,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color:
                    viewMode === vm.key ? "#00d4ff" : "rgba(255,255,255,0.4)",
                  borderRadius: 4,
                  width: 26,
                  height: 24,
                  cursor: "pointer",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                {vm.icon}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              color: "rgba(255,255,255,0.2)",
            }}
          >
            🔍
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài tập..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "8px 10px 8px 32px",
              color: "#fff",
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {!searchQuery && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background:
                    activeCategory === cat
                      ? "rgba(0,212,255,0.15)"
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${activeCategory === cat ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color:
                    activeCategory === cat
                      ? "#00d4ff"
                      : "rgba(255,255,255,0.5)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 16px" }}>
        <div style={gridStyle}>
          {filtered.map((ex) => (
            <ExerciseTile
              key={ex.id}
              exercise={ex}
              viewMode={viewMode}
              onDoubleClick={() => addExercise(ex)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "30px 10px",
              color: "rgba(255,255,255,0.25)",
              fontSize: 13,
            }}
          >
            Không tìm thấy bài tập
          </div>
        )}
      </div>
    </div>
  );
}
