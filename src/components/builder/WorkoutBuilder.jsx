import { useState } from "react";
import { SAMPLE_STUDENTS } from "../../constants";
import ExerciseCard from "./ExerciseCard";
import WorkoutSummaryCard from "./WorkoutSummaryCard";

export default function WorkoutBuilder({
  workoutName, setWorkoutName,
  exercises, updateExercise, removeExercise, addExercise, reorderExercises,
  selectedStudent, setSelectedStudent,
  sendWorkout,
  draggingFromLibrary, setDraggingFromLibrary,
}) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);

  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index) => setDragOverIndex(index);

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggingFromLibrary) {
      addExercise(draggingFromLibrary);
      setDraggingFromLibrary(null);
      setIsDropZoneActive(false);
      return;
    }
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null); setDragOverIndex(null); return;
    }
    const updated = [...exercises];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);
    reorderExercises(updated);
    setDragIndex(null); setDragOverIndex(null);
  };

  const handleDropZoneDrop = (e) => {
    e.preventDefault();
    if (draggingFromLibrary) {
      addExercise(draggingFromLibrary);
    }
    setDraggingFromLibrary(null);
    setIsDropZoneActive(false);
  };

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
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none", cursor: "pointer" }}
          >
            {SAMPLE_STUDENTS.map(s => <option key={s} style={{ background: "#1a1a2e" }}>{s}</option>)}
          </select>
          <button
            onClick={sendWorkout}
            style={{ background: "linear-gradient(135deg, #00d4ff, #0070ff)", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, boxShadow: "0 4px 20px rgba(0,212,255,0.3)" }}
          >
            📤 GỬI BÀI TẬP
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        style={{ flex: 1, overflowY: "auto", padding: 20 }}
        onDragOver={(e) => { e.preventDefault(); if (draggingFromLibrary) setIsDropZoneActive(true); }}
        onDragLeave={() => setIsDropZoneActive(false)}
        onDrop={handleDropZoneDrop}
      >
        <WorkoutSummaryCard exercises={exercises} />

        {exercises.length === 0 ? (
          <div style={{ border: "2px dashed rgba(0,212,255,0.2)", borderRadius: 16, padding: "60px 20px", textAlign: "center", color: "rgba(255,255,255,0.25)", animation: "pulse 2s infinite", background: isDropZoneActive ? "rgba(0,212,255,0.05)" : "transparent", transition: "all 0.2s" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💪</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Kéo bài tập vào đây</div>
            <div style={{ fontSize: 13 }}>hoặc double-click bài tập trong thư viện</div>
          </div>
        ) : (
          <>
            {isDropZoneActive && exercises.length > 0 && (
              <div style={{ border: "2px dashed rgba(0,212,255,0.4)", borderRadius: 12, padding: "14px", textAlign: "center", color: "#00d4ff", marginBottom: 8, background: "rgba(0,212,255,0.05)", fontSize: 13, fontWeight: 600 }}>
                ↓ Thả vào đây để thêm xuống cuối
              </div>
            )}
            {exercises.map((ex, i) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                index={i}
                onUpdate={updateExercise}
                onRemove={removeExercise}
                isDragging={dragIndex === i}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
