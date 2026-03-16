import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CATEGORY_EMOJI, EQUIPMENT_COLOR } from "../../constants";
import SetInput from "./SetInput";

export default function ExerciseCard({ exercise, index, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(true);
  const [imgStatus, setImgStatus] = useState("loading");
  const hasImage = exercise.images?.length > 0;
  const showWeight = exercise.equipment !== "Bodyweight";
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: "builder-" + exercise.id,
    data: { exercise, source: "builder" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderLeft: `3px solid ${EQUIPMENT_COLOR[exercise.equipment] || "#888"}`,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 14px",
          gap: 10,
        }}
      >
        <span
          {...listeners}
          {...attributes}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            fontSize: 14,
            color: "rgba(255,255,255,0.25)",
            padding: "4px 2px",
            touchAction: "none",
          }}
        >
          ⋮⋮
        </span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            overflow: "hidden",
            flexShrink: 0,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasImage && imgStatus !== "error" ? (
            <img
              src={exercise.images[0]}
              alt={exercise.name}
              loading="lazy"
              onLoad={() => setImgStatus("loaded")}
              onError={() => setImgStatus("error")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: imgStatus === "loading" ? "none" : "block",
              }}
            />
          ) : null}
          {(!hasImage || imgStatus === "error" || imgStatus === "loading") && (
            <span style={{ fontSize: 20 }}>
              {exercise.icon || CATEGORY_EMOJI[exercise.muscle] || "💪"}
            </span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#fff",
              letterSpacing: 0.5,
            }}
          >
            {exercise.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.4)",
              marginTop: 1,
            }}
          >
            <span
              style={{
                color: EQUIPMENT_COLOR[exercise.equipment],
                fontWeight: 600,
              }}
            >
              {exercise.equipment}
            </span>
            {" · "}
            {exercise.muscle}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "none",
              color: "#aaa",
              width: 28,
              height: 28,
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {expanded ? "▲" : "▼"}
          </button>
          <button
            onClick={() => onRemove(index)}
            style={{
              background: "rgba(255,80,80,0.1)",
              border: "none",
              color: "#ff6b6b",
              width: 28,
              height: 28,
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ×
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "0 14px 14px" }}>
          {/* Bulk row — applies to all sets */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
              paddingBottom: 6,
              borderBottom: "1px dashed rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "6px 6px 0 0",
              padding: "6px 4px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "rgba(0,212,255,0.6)",
                width: 40,
                fontFamily: "monospace",
                fontWeight: 700,
              }}
            >
              Tất cả
            </div>
            <SetInput
              label="Reps"
              value={exercise.sets[0]?.reps ?? ""}
              unit="lần"
              onChange={(v) => onUpdate(index, -1, "_bulkUpdate", { field: "reps", value: v })}
              color="#00d4ff"
            />
            {showWeight && (
              <SetInput
                label="Weight"
                value={exercise.sets[0]?.weight ?? ""}
                unit="kg"
                onChange={(v) => onUpdate(index, -1, "_bulkUpdate", { field: "weight", value: v })}
                color="#FF6B35"
              />
            )}
            <SetInput
              label="Rest"
              value={exercise.sets[0]?.rest ?? ""}
              unit="s"
              onChange={(v) => onUpdate(index, -1, "_bulkUpdate", { field: "rest", value: v })}
              color="#34D399"
            />
          </div>
          {exercise.sets.map((set, si) => (
            <div
              key={si}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  width: 40,
                  fontFamily: "monospace",
                }}
              >
                Set {si + 1}
              </div>
              <SetInput
                label="Reps"
                value={set.reps}
                unit="lần"
                onChange={(v) => onUpdate(index, si, "reps", v)}
                color="#00d4ff"
              />
              {showWeight && (
                <SetInput
                  label="Weight"
                  value={set.weight}
                  unit="kg"
                  onChange={(v) => onUpdate(index, si, "weight", v)}
                  color="#FF6B35"
                />
              )}
              <SetInput
                label="Rest"
                value={set.rest}
                unit="s"
                onChange={(v) => onUpdate(index, si, "rest", v)}
                color="#34D399"
              />
              {exercise.sets.length > 1 && (
                <button
                  onClick={() => onUpdate(index, si, "_remove")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: "0 2px",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => onUpdate(index, -1, "_addSet")}
            style={{
              marginTop: 4,
              background: "rgba(255,255,255,0.04)",
              border: "1px dashed rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.4)",
              borderRadius: 6,
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: 12,
              width: "100%",
            }}
          >
            + Thêm set
          </button>
        </div>
      )}
    </div>
  );
}

// Lightweight overlay for drag preview (no dnd hooks)
export function ExerciseCardOverlay({ exercise }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid rgba(0,212,255,0.3)",
        borderLeft: `3px solid ${EQUIPMENT_COLOR[exercise.equipment] || "#888"}`,
        borderRadius: 12,
        padding: "12px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        transform: "scale(1.02)",
        width: 400,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          overflow: "hidden",
          flexShrink: 0,
          background: "rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {exercise.images?.length > 0 ? (
          <img
            src={exercise.images[0]}
            alt={exercise.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: 20 }}>
            {exercise.icon || CATEGORY_EMOJI[exercise.muscle] || "💪"}
          </span>
        )}
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: "#fff",
          }}
        >
          {exercise.name}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
          {exercise.equipment} · {exercise.muscle}
        </div>
      </div>
    </div>
  );
}
