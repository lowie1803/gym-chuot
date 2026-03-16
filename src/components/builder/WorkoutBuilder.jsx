import { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import ExerciseCard from "./ExerciseCard";
import WorkoutSummaryCard from "./WorkoutSummaryCard";

export default function WorkoutBuilder({
  workoutName, setWorkoutName,
  exercises, updateExercise, removeExercise,
  selectedStudent, setSelectedStudent,
  sendWorkout, students = [], saving = false,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "builder-canvas" });

  const sortableItems = useMemo(
    () => exercises.map((e) => "builder-" + e.id),
    [exercises]
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <input
            value={workoutName}
            onChange={e => setWorkoutName(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: 0.5, width: "100%" }}
          />
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
            📍 Cho học viên: <span style={{ color: "#00d4ff" }}>{selectedStudent}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={selectedStudent || ""}
            onChange={e => setSelectedStudent(e.target.value)}
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", cursor: "pointer" }}
          >
            {students.length === 0 && <option style={{ background: "#1a1a2e" }}>Chưa có học viên</option>}
            {students.map(s => <option key={s.id} value={s.id} style={{ background: "#1a1a2e" }}>{s.full_name}</option>)}
          </select>
          <button
            onClick={sendWorkout}
            disabled={saving || students.length === 0}
            style={{ background: "linear-gradient(135deg, #00d4ff, #0070ff)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: saving ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, boxShadow: "0 4px 20px rgba(0,212,255,0.3)", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "⏳ ĐANG GỬI..." : "📤 GỬI BÀI TẬP"}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={setNodeRef} style={{ flex: 1, overflowY: "auto", padding: 20 }}>
        <WorkoutSummaryCard exercises={exercises} />

        {exercises.length === 0 ? (
          <div style={{
            border: `2px dashed ${isOver ? "rgba(0,212,255,0.5)" : "rgba(0,212,255,0.2)"}`,
            borderRadius: 16,
            padding: "60px 20px",
            textAlign: "center",
            color: "rgba(255,255,255,0.25)",
            background: isOver ? "rgba(0,212,255,0.08)" : "transparent",
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💪</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
              {isOver ? "Thả bài tập vào đây!" : "Kéo bài tập vào đây"}
            </div>
            <div style={{ fontSize: 13 }}>hoặc double-click bài tập trong thư viện</div>
          </div>
        ) : (
          <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
            {exercises.map((ex, i) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                index={i}
                onUpdate={updateExercise}
                onRemove={removeExercise}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
