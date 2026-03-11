import { useState, useRef, useCallback, useEffect } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const EXERCISE_LIBRARY = {
  "Ngực": [
    { id: "e1", name: "Bench Press", icon: "🏋️", muscle: "Ngực", equipment: "Barbell", desc: "Bài tập ngực cổ điển" },
    { id: "e2", name: "Incline DB Press", icon: "💪", muscle: "Ngực trên", equipment: "Dumbbell", desc: "Tập ngực trên hiệu quả" },
    { id: "e3", name: "Cable Fly", icon: "🔗", muscle: "Ngực", equipment: "Cable", desc: "Co cơ ngực cô lập" },
    { id: "e4", name: "Push-up", icon: "⬆️", muscle: "Ngực", equipment: "Bodyweight", desc: "Không cần thiết bị" },
  ],
  "Lưng": [
    { id: "e5", name: "Deadlift", icon: "🏗️", muscle: "Lưng dưới", equipment: "Barbell", desc: "Vua của các bài tập" },
    { id: "e6", name: "Pull-up", icon: "🔝", muscle: "Lưng rộng", equipment: "Bodyweight", desc: "Kéo xà đơn" },
    { id: "e7", name: "Seated Row", icon: "🚣", muscle: "Lưng giữa", equipment: "Cable", desc: "Kéo cáp ngồi" },
    { id: "e8", name: "Lat Pulldown", icon: "⬇️", muscle: "Lưng rộng", equipment: "Cable", desc: "Kéo cáp trên" },
  ],
  "Chân": [
    { id: "e9", name: "Squat", icon: "🦵", muscle: "Đùi trước", equipment: "Barbell", desc: "Bài tập nền tảng" },
    { id: "e10", name: "Leg Press", icon: "🦿", muscle: "Đùi", equipment: "Machine", desc: "Máy đẩy chân" },
    { id: "e11", name: "Romanian DL", icon: "🔄", muscle: "Đùi sau", equipment: "Barbell", desc: "Deadlift Romania" },
    { id: "e12", name: "Calf Raise", icon: "👟", muscle: "Bắp chân", equipment: "Machine", desc: "Nâng gót chân" },
  ],
  "Vai & Tay": [
    { id: "e13", name: "Overhead Press", icon: "🎯", muscle: "Vai", equipment: "Barbell", desc: "Đẩy tạ đầu" },
    { id: "e14", name: "Lateral Raise", icon: "↔️", muscle: "Vai bên", equipment: "Dumbbell", desc: "Nâng tạ bên" },
    { id: "e15", name: "Bicep Curl", icon: "💪", muscle: "Tay trước", equipment: "Dumbbell", desc: "Cuốn tay trước" },
    { id: "e16", name: "Tricep Pushdown", icon: "🔻", muscle: "Tay sau", equipment: "Cable", desc: "Đẩy cáp tay sau" },
  ],
  "Core": [
    { id: "e17", name: "Plank", icon: "📐", muscle: "Core", equipment: "Bodyweight", desc: "Giữ tư thế tĩnh" },
    { id: "e18", name: "Cable Crunch", icon: "🌀", muscle: "Bụng", equipment: "Cable", desc: "Gập bụng cáp" },
    { id: "e19", name: "Leg Raise", icon: "🦵", muscle: "Bụng dưới", equipment: "Bodyweight", desc: "Nâng chân" },
  ],
};

const EQUIPMENT_COLOR = {
  Barbell: "#FF6B35",
  Dumbbell: "#4ECDC4",
  Cable: "#A78BFA",
  Machine: "#60A5FA",
  Bodyweight: "#34D399",
};

const SAMPLE_MESSAGES = [
  { id: 1, from: "pt", name: "Coach Minh", avatar: "🏆", text: "Chào Tuấn! Hôm nay tao gửi mày bài Push Day mới 💪", time: "09:00" },
  { id: 2, from: "student", name: "Tuấn", avatar: "🧑", text: "Ngon! Anh, lần trước bài ngực em vẫn còn đau 😅", time: "09:02" },
  { id: 3, from: "pt", name: "Coach Minh", avatar: "🏆", text: "Bình thường, cơ đang phục hồi. Hôm nay giảm volume xuống:", time: "09:03", workout: true },
];

// ── COMPONENTS ────────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, index, onUpdate, onRemove, isDragging, onDragStart, onDragOver, onDrop }) {
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
      {/* Header */}
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

      {/* Sets Config */}
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

function SetInput({ label, value, unit, onChange, color }) {
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

function WorkoutSummaryCard({ exercises }) {
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

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function GymChuot() {
  const [activeTab, setActiveTab] = useState("builder"); // builder | messenger
  const [workoutName, setWorkoutName] = useState("Push Day A - Tuần 3");
  const [exercises, setExercises] = useState([
    {
      id: "ex1", ...EXERCISE_LIBRARY["Ngực"][0],
      sets: [{ reps: 8, weight: 80, rest: 90 }, { reps: 8, weight: 80, rest: 90 }, { reps: 6, weight: 85, rest: 120 }]
    },
    {
      id: "ex2", ...EXERCISE_LIBRARY["Ngực"][1],
      sets: [{ reps: 10, weight: 20, rest: 75 }, { reps: 10, weight: 20, rest: 75 }, { reps: 8, weight: 22, rest: 90 }]
    },
    {
      id: "ex3", ...EXERCISE_LIBRARY["Vai & Tay"][0],
      sets: [{ reps: 10, weight: 50, rest: 90 }, { reps: 8, weight: 55, rest: 90 }]
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Ngực");
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggingFromLibrary, setDraggingFromLibrary] = useState(null);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [workoutSent, setWorkoutSent] = useState(false);
  const [showSentToast, setShowSentToast] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("Tuấn Anh");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredExercises = Object.entries(EXERCISE_LIBRARY).reduce((acc, [cat, exs]) => {
    if (searchQuery) {
      const filtered = exs.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.muscle.toLowerCase().includes(searchQuery.toLowerCase()));
      if (filtered.length) acc[cat] = filtered;
    } else if (cat === activeCategory) {
      acc[cat] = exs;
    }
    return acc;
  }, {});

  const addExercise = useCallback((ex) => {
    setExercises(prev => [...prev, {
      id: `ex_${Date.now()}`, ...ex,
      sets: [{ reps: 10, weight: 0, rest: 90 }, { reps: 10, weight: 0, rest: 90 }, { reps: 10, weight: 0, rest: 90 }]
    }]);
  }, []);

  const updateExercise = useCallback((exIdx, setIdx, field, value) => {
    setExercises(prev => {
      const updated = [...prev];
      const ex = { ...updated[exIdx] };
      const sets = [...ex.sets];
      if (field === "_addSet") {
        sets.push({ ...sets[sets.length - 1] });
      } else if (field === "_remove") {
        sets.splice(setIdx, 1);
      } else {
        sets[setIdx] = { ...sets[setIdx], [field]: value };
      }
      ex.sets = sets;
      updated[exIdx] = ex;
      return updated;
    });
  }, []);

  const removeExercise = useCallback((idx) => {
    setExercises(prev => prev.filter((_, i) => i !== idx));
  }, []);

  // Drag handlers for reordering
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
    setExercises(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, moved);
      return updated;
    });
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

  const sendWorkout = () => {
    const workoutMsg = {
      id: Date.now(), from: "pt", name: "Coach Minh", avatar: "🏆",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      type: "workout",
      workoutData: { name: workoutName, exercises: exercises.map(e => ({ name: e.name, icon: e.icon, sets: e.sets })) }
    };
    setMessages(prev => [...prev, workoutMsg]);
    setWorkoutSent(true);
    setShowSentToast(true);
    setTimeout(() => setShowSentToast(false), 3000);
    setTimeout(() => setActiveTab("messenger"), 400);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), from: "pt", name: "Coach Minh", avatar: "🏆",
      text: chatInput,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    }]);
    setChatInput("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes toastIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", color: "#fff", overflow: "hidden" }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: 64, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 8, flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #00d4ff, #0070ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16, boxShadow: "0 0 20px rgba(0,212,255,0.3)" }}>
            🐭
          </div>
          {[
            { id: "builder", icon: "📋", label: "Builder" },
            { id: "messenger", icon: "💬", label: "Tin nhắn" },
            { id: "students", icon: "👥", label: "Học viên" },
            { id: "analytics", icon: "📊", label: "Thống kê" },
          ].map(tab => (
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
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #ff9f35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏆</div>
        </div>

        {/* ── MAIN CONTENT ── */}
        {activeTab === "builder" && (
          <>
            {/* Exercise Library */}
            <div style={{ width: 260, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
              <div style={{ padding: "16px 14px 12px" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10 }}>
                  Thư viện bài tập
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(255,255,255,0.2)" }}>🔍</span>
                  <input
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); }}
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
                    {searchQuery && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 1.5, textTransform: "uppercase", padding: "8px 4px 4px", fontWeight: 700 }}>{cat}</div>}
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

            {/* Builder Canvas */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Builder Header */}
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
                    {["Tuấn Anh", "Minh Khoa", "Thu Hà", "Bảo Long"].map(s => <option key={s} style={{ background: "#1a1a2e" }}>{s}</option>)}
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
          </>
        )}

        {/* ── MESSENGER ── */}
        {activeTab === "messenger" && (
          <>
            {/* Conversation List */}
            <div style={{ width: 240, background: "#0d0d16", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "16px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 0.5, marginBottom: 10 }}>Tin nhắn</div>
                <input placeholder="Tìm học viên..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", color: "#fff", fontSize: 12, outline: "none" }} />
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
                {["Tuấn Anh", "Minh Khoa", "Thu Hà", "Bảo Long"].map((name, i) => (
                  <div
                    key={name}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: name === "Tuấn Anh" ? "rgba(0,212,255,0.1)" : "transparent", border: name === "Tuấn Anh" ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent" }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${i * 80 + 180}, 70%, 40%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, position: "relative" }}>
                      🧑
                      {i === 0 && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#34D399", border: "2px solid #0d0d16" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: name === "Tuấn Anh" ? "#00d4ff" : "#d0d0d0" }}>{name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {i === 0 ? "💪 Push Day A - Tuần 3" : "Xem lịch tập..."}
                      </div>
                    </div>
                    {i === 0 && workoutSent && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00d4ff", flexShrink: 0 }} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Chat Header */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #4ECDC4, #45B7D1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧑</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Tuấn Anh</div>
                  <div style={{ fontSize: 12, color: "#34D399", display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399" }} /> Online
                  </div>
                </div>
                <div style={{ flex: 1 }} />
                <button
                  onClick={() => setActiveTab("builder")}
                  style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5 }}
                >
                  📋 TẠO BÀI TẬP MỚI
                </button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.map((msg) => {
                  const isPT = msg.from === "pt";
                  return (
                    <div key={msg.id} style={{ display: "flex", flexDirection: isPT ? "row-reverse" : "row", gap: 8, alignItems: "flex-end", animation: "slideIn 0.2s ease" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: isPT ? "linear-gradient(135deg, #FF6B35, #ff9f35)" : "linear-gradient(135deg, #4ECDC4, #45B7D1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{msg.avatar}</div>
                      <div style={{ maxWidth: "70%" }}>
                        {msg.type === "workout" ? (
                          <WorkoutMessageCard data={msg.workoutData} />
                        ) : (
                          <div style={{
                            background: isPT ? "linear-gradient(135deg, rgba(0,100,200,0.4), rgba(0,180,255,0.2))" : "rgba(255,255,255,0.07)",
                            border: isPT ? "1px solid rgba(0,212,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                            borderRadius: isPT ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
                            padding: "10px 14px",
                          }}>
                            <div style={{ fontSize: 14, color: "#e8e8e8", lineHeight: 1.5 }}>{msg.text}</div>
                          </div>
                        )}
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4, textAlign: isPT ? "right" : "left" }}>{msg.time}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  onClick={() => setActiveTab("builder")}
                  title="Gửi bài tập"
                  style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff", fontSize: 18, cursor: "pointer", flexShrink: 0 }}
                >📋</button>
                <button title="Đính kèm video" style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer", flexShrink: 0 }}>📎</button>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Nhắn tin cho Tuấn Anh..."
                  style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }}
                />
                <button
                  onClick={sendMessage}
                  style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #00d4ff, #0070ff)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", flexShrink: 0 }}
                >
                  ↑
                </button>
              </div>
            </div>
          </>
        )}

        {/* Placeholder screens */}
        {(activeTab === "students" || activeTab === "analytics") && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: 48 }}>{activeTab === "students" ? "👥" : "📊"}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700 }}>
              {activeTab === "students" ? "Quản lý học viên" : "Thống kê tiến độ"}
            </div>
            <div style={{ fontSize: 13 }}>Tính năng đang phát triển · Coming soon</div>
          </div>
        )}
      </div>

      {/* Toast */}
      {showSentToast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "linear-gradient(135deg, #00d4ff, #0070ff)", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 30px rgba(0,212,255,0.4)", animation: "toastIn 0.3s ease", zIndex: 9999 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 15, letterSpacing: 0.5 }}>Đã gửi bài tập!</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Push Day A → Tuấn Anh</div>
          </div>
        </div>
      )}
    </>
  );
}

// Workout card in chat
function WorkoutMessageCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.05))", border: "1px solid rgba(255,107,53,0.3)", borderRadius: "12px 4px 12px 12px", overflow: "hidden", minWidth: 260 }}>
      <div style={{ padding: "12px 14px", borderBottom: expanded ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>💪</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff" }}>{data.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{data.exercises.length} bài tập · {data.exercises.reduce((a, e) => a + e.sets.length, 0)} sets tổng</div>
          </div>
          <button onClick={() => setExpanded(!expanded)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#aaa", width: 28, height: 28, borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "10px 14px" }}>
          {data.exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>{ex.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{ex.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                  {ex.sets.length} sets × {ex.sets[0].reps} reps
                  {ex.sets[0].weight > 0 && ` @ ${ex.sets[0].weight}kg`}
                </div>
              </div>
            </div>
          ))}
          <button style={{ marginTop: 6, width: "100%", background: "linear-gradient(135deg, #FF6B35, #ff9f35)", border: "none", color: "#fff", borderRadius: 8, padding: "8px", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 14, letterSpacing: 1, cursor: "pointer" }}>
            🏋️ BẮT ĐẦU TẬP
          </button>
        </div>
      )}
    </div>
  );
}
