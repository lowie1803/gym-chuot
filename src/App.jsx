import { useState, useCallback, useEffect, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { useStudents } from "./hooks/useStudents";
import { useWorkouts } from "./hooks/useWorkouts";
import { useDashboard } from "./hooks/useDashboard";
import { useMessages } from "./hooks/useMessages";
import { useConversationPreviews } from "./hooks/useConversationPreviews";
import { useExercises, findExerciseByName } from "./hooks/useExercises";
import { getConversationId } from "./lib/utils";
import AuthPage from "./components/auth/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LeftSidebar from "./components/LeftSidebar";
import Toast from "./components/Toast";
import BuilderDndWrapper from "./components/builder/BuilderDndWrapper";
import ExerciseLibrary from "./components/builder/ExerciseLibrary";
import WorkoutBuilder from "./components/builder/WorkoutBuilder";
import TemplatePanel from "./components/builder/TemplatePanel";
import Messenger from "./components/messenger/Messenger";
import StudentManagement from "./components/students/StudentManagement";
import PTDashboard from "./components/dashboard/PTDashboard";

function GymChuotApp() {
  const { user, profile, signOut } = useAuth();
  const { students } = useStudents();
  const { sendWorkout: sendWorkoutToSupabase, saving, saveAsTemplate, fetchTemplates, deleteTemplate, templates, loadWorkout } = useWorkouts();
  const { recentWorkouts, loading: dashboardLoading } = useDashboard();
  const { exercises: exerciseLibrary, categories } = useExercises();

  const [activeTab, setActiveTab] = useState(
    profile?.role === "student" ? "messenger" : "builder"
  );
  const [workoutName, setWorkoutName] = useState("Push Day A - Tuần 3");
  const [exercises, setExercises] = useState(() => [
    {
      id: "ex1", ...findExerciseByName("Barbell Bench Press - Medium Grip"),
      sets: [{ reps: 8, weight: 80, rest: 90 }, { reps: 8, weight: 80, rest: 90 }, { reps: 6, weight: 85, rest: 120 }]
    },
    {
      id: "ex2", ...findExerciseByName("Incline Dumbbell Press"),
      sets: [{ reps: 10, weight: 20, rest: 75 }, { reps: 10, weight: 20, rest: 75 }, { reps: 8, weight: 22, rest: 90 }]
    },
    {
      id: "ex3", ...findExerciseByName("Standing Military Press"),
      sets: [{ reps: 10, weight: 50, rest: 90 }, { reps: 8, weight: 55, rest: 90 }]
    },
  ]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showSentToast, setShowSentToast] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const activeStudents = students.filter((s) => s.status === "active");
  const selectedStudent = activeStudents.find((s) => s.id === selectedStudentId) || activeStudents[0] || null;
  const conversationId = selectedStudent ? getConversationId(user.id, selectedStudent.id) : null;
  const { messages, sendMessage: sendChatMessage } = useMessages(conversationId);

  const conversationIds = useMemo(
    () => activeStudents.map((s) => getConversationId(user.id, s.id)),
    [activeStudents.map((s) => s.id).join(","), user.id]
  );
  const { previews, markAsRead } = useConversationPreviews(conversationIds, conversationId);

  useEffect(() => {
    if (conversationId) markAsRead(conversationId);
  }, [conversationId, markAsRead]);

  useEffect(() => {
    if (profile?.role === "pt") fetchTemplates();
  }, [profile?.role]);

  const handleTabChange = (tab) => {
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
      } else if (field === "_bulkUpdate") {
        const { field: f, value: v } = value;
        ex.sets = sets.map(s => ({ ...s, [f]: v }));
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

  const handleSaveAsTemplate = async () => {
    if (exercises.length === 0) return;
    const { error } = await saveAsTemplate({
      name: workoutName,
      exercises: exercises.map(e => ({ name: e.name, icon: e.icon, sets: e.sets })),
    });
    if (!error) {
      fetchTemplates();
      setShowSentToast(true);
      setTimeout(() => setShowSentToast(false), 3000);
    }
  };

  const handleLoadTemplate = async (workoutId) => {
    const workout = await loadWorkout(workoutId);
    if (workout) {
      setWorkoutName(workout.name);
      setExercises(
        (workout.workout_exercises || [])
          .sort((a, b) => a.order_index - b.order_index)
          .map((e, i) => ({
            id: `ex_${Date.now()}_${i}`,
            name: e.exercise_name,
            icon: e.exercise_icon,
            sets: e.sets || [],
          }))
      );
      setShowTemplates(false);
    }
  };

  const handleDeleteTemplate = async (workoutId) => {
    const { error } = await deleteTemplate(workoutId);
    if (!error) fetchTemplates();
  };

  const sendWorkout = async () => {
    if (!selectedStudent) return;

    const { error } = await sendWorkoutToSupabase({
      name: workoutName,
      exercises: exercises.map(e => ({ name: e.name, icon: e.icon, sets: e.sets })),
      receiverId: selectedStudent.id,
    });

    if (!error) {
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
        <BuilderDndWrapper
          exercises={exercises}
          addExercise={addExercise}
          reorderExercises={reorderExercises}
        >
          <ExerciseLibrary
            exercises={exerciseLibrary}
            categories={categories}
            addExercise={addExercise}
          />
          <WorkoutBuilder
            workoutName={workoutName}
            setWorkoutName={setWorkoutName}
            exercises={exercises}
            updateExercise={updateExercise}
            removeExercise={removeExercise}
            selectedStudent={selectedStudentName}
            setSelectedStudent={(id) => setSelectedStudentId(id)}
            sendWorkout={sendWorkout}
            students={activeStudents}
            saving={saving}
            onSaveAsTemplate={handleSaveAsTemplate}
            onShowTemplates={() => setShowTemplates(prev => !prev)}
            templateCount={templates.length}
          />
          {showTemplates && (
            <TemplatePanel
              templates={templates}
              onLoad={handleLoadTemplate}
              onDelete={handleDeleteTemplate}
              onClose={() => setShowTemplates(false)}
            />
          )}
        </BuilderDndWrapper>
      )}

      {activeTab === "messenger" && (
        <Messenger
          selectedStudent={selectedStudent}
          setSelectedStudent={(s) => setSelectedStudentId(s?.id || s)}
          previews={previews}
          messages={messages}
          sendMessage={sendMessage}
          setActiveTab={handleTabChange}
          students={activeStudents}
          currentUserId={user.id}
        />
      )}

      {activeTab === "students" && <StudentManagement />}

      {activeTab === "dashboard" && profile?.role === "pt" && (
        <PTDashboard
          students={activeStudents}
          recentWorkouts={recentWorkouts}
          loading={dashboardLoading}
          onNavigateToStudent={(id) => { setSelectedStudentId(id); setActiveTab("messenger"); }}
        />
      )}

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
