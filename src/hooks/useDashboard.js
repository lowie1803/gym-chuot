import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useDashboard() {
  const { user } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetch() {
      setLoading(true);
      const { data } = await supabase
        .from("messages")
        .select("id, created_at, receiver_id, workout_id, workouts(name), profiles!messages_receiver_id_fkey(full_name)")
        .eq("sender_id", user.id)
        .eq("type", "workout")
        .order("created_at", { ascending: false })
        .limit(20);

      setRecentWorkouts(
        (data || []).map((m) => ({
          id: m.id,
          workoutName: m.workouts?.name || "Bài tập",
          studentName: m.profiles?.full_name || "",
          createdAt: m.created_at,
        }))
      );
      setLoading(false);
    }

    fetch();
  }, [user]);

  return { recentWorkouts, loading };
}
