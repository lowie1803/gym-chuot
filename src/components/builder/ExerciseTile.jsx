import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CATEGORY_EMOJI, EQUIPMENT_COLOR } from "../../constants";

export default function ExerciseTile({ exercise, viewMode, onDoubleClick }) {
  const [imgStatus, setImgStatus] = useState("loading");
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: "library-" + exercise.id,
    data: { exercise, source: "library" },
  });

  const hasImage = exercise.images && exercise.images.length > 0;
  const emoji = CATEGORY_EMOJI[exercise.muscle] || "💪";
  const equipColor = EQUIPMENT_COLOR[exercise.equipment] || "#888";
  const displayName = exercise.nameVi || exercise.name;

  if (viewMode === "list") {
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onDoubleClick={onDoubleClick}
        title="Kéo vào builder hoặc double-click để thêm"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 10px",
          borderRadius: 8,
          cursor: isDragging ? "grabbing" : "grab",
          marginBottom: 3,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
          opacity: isDragging ? 0.4 : 1,
          transition: "all 0.15s",
          touchAction: "none",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
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
              alt={displayName}
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
            <span style={{ fontSize: 20 }}>{emoji}</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#e8e8e8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {displayName}
          </div>
          <div style={{ fontSize: 10, marginTop: 1 }}>
            <span style={{ color: equipColor, fontWeight: 600 }}>
              {exercise.equipment}
            </span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>
              {" · "}
              {exercise.muscle}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Grid mode (grid-2 or grid-3)
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onDoubleClick={onDoubleClick}
      title="Kéo vào builder hoặc double-click để thêm"
      style={{
        aspectRatio: "1",
        borderRadius: 10,
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.4 : 1,
        position: "relative",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "all 0.15s",
        touchAction: "none",
      }}
    >
      {hasImage && imgStatus !== "error" ? (
        <img
          src={exercise.images[0]}
          alt={displayName}
          loading="lazy"
          onLoad={() => setImgStatus("loaded")}
          onError={() => setImgStatus("error")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            inset: 0,
            display: imgStatus === "loading" ? "none" : "block",
          }}
        />
      ) : null}

      {(!hasImage || imgStatus === "error") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: viewMode === "grid-3" ? 28 : 36,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {emoji}
        </div>
      )}

      {imgStatus === "loading" && hasImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: viewMode === "grid-3" ? 28 : 36,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {emoji}
        </div>
      )}

      {/* Dark gradient overlay at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
          padding: viewMode === "grid-3" ? "16px 6px 6px" : "20px 8px 8px",
        }}
      >
        <div
          style={{
            fontSize: viewMode === "grid-3" ? 10 : 11,
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {displayName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: equipColor,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: viewMode === "grid-3" ? 8 : 9,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {exercise.equipment}
          </span>
        </div>
      </div>
    </div>
  );
}

// Lightweight version for DragOverlay (no dnd hooks)
export function ExerciseTileOverlay({ exercise, viewMode }) {
  const hasImage = exercise.images && exercise.images.length > 0;
  const emoji = CATEGORY_EMOJI[exercise.muscle] || "💪";
  const displayName = exercise.nameVi || exercise.name;
  const equipColor = EQUIPMENT_COLOR[exercise.equipment] || "#888";

  if (viewMode === "list") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 10px",
          borderRadius: 8,
          background: "rgba(13,13,22,0.95)",
          border: "1px solid rgba(0,212,255,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          width: 280,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 6,
            overflow: "hidden",
            flexShrink: 0,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasImage ? (
            <img
              src={exercise.images[0]}
              alt={displayName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 20 }}>{emoji}</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8e8" }}>{displayName}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{exercise.equipment}</div>
        </div>
      </div>
    );
  }

  const size = viewMode === "grid-3" ? 95 : 140;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
        background: "rgba(13,13,22,0.95)",
        border: "1px solid rgba(0,212,255,0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        transform: "scale(1.05)",
      }}
    >
      {hasImage ? (
        <img
          src={exercise.images[0]}
          alt={displayName}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: viewMode === "grid-3" ? 28 : 36,
          }}
        >
          {emoji}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
          padding: "16px 6px 6px",
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, color: "#fff" }}>{displayName}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: equipColor }} />
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>{exercise.equipment}</span>
        </div>
      </div>
    </div>
  );
}
