import { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { EXERCISE_LIBRARY } from "./constants";
import { useAuth } from "./contexts/AuthContext";
import { useStudents } from "./hooks/useStudents";
import { useWorkouts } from "./hooks/useWorkouts";
import { useMessages } from "./hooks/useMessages";
import { getConversationId } from "./lib/utils";
import AuthPage from "./components/auth/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LeftSidebar from "./components/LeftSidebar";
import Toast from "./components/Toast";
import Placeholder from "./components/Placeholder";
import ExerciseLibrary from "./components/builder/ExerciseLibrary";
import WorkoutBuilder from "./components/builder/WorkoutBuilder";
import Messenger from "./components/messenger/Messenger";
import StudentManagement from "./components/students/StudentManagement";

function GymChuotApp() {
  const { user, profile, signOut } = useAuth();
  const { students } = useStudents();
  const { sendWorkout: sendWorkoutToSupabase, saving } = useWorkouts();

  const [activeTab, setActiveTab] = useState(
    profile?.role === "student" ? "messenger" : "builder"
  );
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
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [workoutSent, setWorkoutSent] = useState(false);
  const [showSentToast, setShowSentToast] = useState(false);

  const activeStudents = students.filter((s) => s.status === "active");
  const selectedStudent = activeStudents.find((s) => s.id === selectedStudentId) || activeStudents[0] || null;
  const conversationId = selectedStudent ? getConversationId(user.id, selectedStudent.id) : null;
  const { messages, sendMessage: sendChatMessage } = useMessages(conversationId);

  const handleTabChange = (tab) => {
    if (tab === "messenger") setWorkoutSent(false);
    setActiveTab(tab);
  };

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

  const sendWorkout = async () => {
    if (!selectedStudent) return;

    const { error } = await sendWorkoutToSupabase({
      name: workoutName,
      exercises: exercises.map(e => ({ name: e.name, icon: e.icon, sets: e.sets })),
      receiverId: selectedStudent.id,
    });

    if (!error) {
      setWorkoutSent(true);
      setShowSentToast(true);
      setTimeout(() => setShowSentToast(false), 3000);
      setTimeout(() => setActiveTab("messenger"), 400);
    }
  };

  const sendMessage = async (text) => {
    if (!selectedStudent) return;
    await sendChatMessage({ text, receiverId: selectedStudent.id });
  };

  const selectedStudentName = selectedStudent?.full_name || "";

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", background: "#0a0a0f", color: "#fff", overflow: "hidden" }}>
      <LeftSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        role={profile?.role}
        onSignOut={signOut}
      />

      {activeTab === "builder" && profile?.role === "pt" && (
        <>
          <ExerciseLibrary addExercise={addExercise} />
          <WorkoutBuilder
            workoutName={workoutName}
            setWorkoutName={setWorkoutName}
            exercises={exercises}
            updateExercise={updateExercise}
            removeExercise={removeExercise}
            addExercise={addExercise}
            reorderExercises={reorderExercises}
            selectedStudent={selectedStudentName}
            setSelectedStudent={(id) => setSelectedStudentId(id)}
            sendWorkout={sendWorkout}
            students={activeStudents}
            saving={saving}
          />
        </>
      )}

      {activeTab === "messenger" && (
        <Messenger
          selectedStudent={selectedStudent}
          setSelectedStudent={(s) => setSelectedStudentId(s?.id || s)}
          workoutSent={workoutSent}
          messages={messages}
          sendMessage={sendMessage}
          setActiveTab={handleTabChange}
          students={activeStudents}
          currentUserId={user.id}
        />
      )}

      {activeTab === "students" && <StudentManagement />}

      {activeTab === "analytics" && <Placeholder tab="analytics" />}

      <Toast show={showSentToast} workoutName={workoutName} studentName={selectedStudentName} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <GymChuotApp />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
