import { useState, useCallback } from "react";
import { EXERCISE_LIBRARY, SAMPLE_MESSAGES } from "./constants";
import LeftSidebar from "./components/LeftSidebar";
import Toast from "./components/Toast";
import Placeholder from "./components/Placeholder";
import ExerciseLibrary from "./components/builder/ExerciseLibrary";
import WorkoutBuilder from "./components/builder/WorkoutBuilder";
import Messenger from "./components/messenger/Messenger";

export default function GymChuot() {
  const [activeTab, setActiveTab] = useState("builder");
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
  const [selectedStudent, setSelectedStudent] = useState("Tuấn Anh");
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [workoutSent, setWorkoutSent] = useState(false);
  const [showSentToast, setShowSentToast] = useState(false);
  const [draggingFromLibrary, setDraggingFromLibrary] = useState(null);

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

  const reorderExercises = useCallback((reordered) => {
    setExercises(reordered);
  }, []);

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

  const sendMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(), from: "pt", name: "Coach Minh", avatar: "🏆",
      text,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    }]);
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
        <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "builder" && (
          <>
            <ExerciseLibrary
              addExercise={addExercise}
              setDraggingFromLibrary={setDraggingFromLibrary}
            />
            <WorkoutBuilder
              workoutName={workoutName}
              setWorkoutName={setWorkoutName}
              exercises={exercises}
              updateExercise={updateExercise}
              removeExercise={removeExercise}
              addExercise={addExercise}
              reorderExercises={reorderExercises}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              sendWorkout={sendWorkout}
              draggingFromLibrary={draggingFromLibrary}
              setDraggingFromLibrary={setDraggingFromLibrary}
            />
          </>
        )}

        {activeTab === "messenger" && (
          <Messenger
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            workoutSent={workoutSent}
            messages={messages}
            sendMessage={sendMessage}
            setActiveTab={setActiveTab}
          />
        )}

        {(activeTab === "students" || activeTab === "analytics") && (
          <Placeholder tab={activeTab} />
        )}
      </div>

      <Toast show={showSentToast} workoutName={workoutName} studentName={selectedStudent} />
    </>
  );
}
