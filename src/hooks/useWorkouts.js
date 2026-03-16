import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { getConversationId } from "../lib/utils";

export function useWorkouts() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);

  async function saveWorkout({ name, exercises, isTemplate = false }) {
    const { data: workout, error: wErr } = await supabase
      .from("workouts")
      .insert({ name, created_by: user.id, is_template: isTemplate })
      .select()
      .single();

    if (wErr) return { error: wErr };

    const rows = exercises.map((ex, i) => ({
      workout_id: workout.id,
      exercise_name: ex.name,
      exercise_icon: ex.icon || "",
      order_index: i,
      sets: ex.sets,
      notes: ex.notes || null,
    }));

    const { error: exErr } = await supabase
      .from("workout_exercises")
      .insert(rows);

    if (exErr) return { error: exErr };

    return { data: workout };
  }

  async function saveAsTemplate({ name, exercises }) {
    return saveWorkout({ name, exercises, isTemplate: true });
  }

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from("workouts")
      .select("id, name, created_at, workout_exercises(exercise_name, exercise_icon, order_index)")
      .eq("created_by", user.id)
      .eq("is_template", true)
      .order("created_at", { ascending: false });

    if (!error) setTemplates(data || []);
    return { data, error };
  }

  async function deleteTemplate(workoutId) {
    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId)
      .eq("created_by", user.id);

    return { error };
  }

  async function sendWorkout({ name, exercises, receiverId }) {
    setSaving(true);

    const { data: workout, error } = await saveWorkout({ name, exercises });
    if (error) {
      setSaving(false);
      return { error };
    }

    const conversationId = getConversationId(user.id, receiverId);

    const { error: msgErr } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: receiverId,
      type: "workout",
      workout_id: workout.id,
    });

    setSaving(false);
    return { error: msgErr };
  }

  async function loadWorkout(workoutId) {
    const { data: workout } = await supabase
      .from("workouts")
      .select("*, workout_exercises(*)")
      .eq("id", workoutId)
      .single();

    return workout;
  }

  return { saveWorkout, sendWorkout, loadWorkout, saving, saveAsTemplate, fetchTemplates, deleteTemplate, templates };
}
