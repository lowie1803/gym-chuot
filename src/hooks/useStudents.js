import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useStudents() {
  const { user, profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) return;
    fetchStudents();
  }, [user, profile]);

  async function fetchStudents() {
    setLoading(true);

    if (profile.role === "pt") {
      const { data } = await supabase
        .from("pt_students")
        .select("student_id, status, profiles!pt_students_student_id_fkey(id, full_name, avatar_url)")
        .eq("pt_id", user.id);

      setStudents(
        (data || []).map((r) => ({
          id: r.profiles.id,
          full_name: r.profiles.full_name,
          avatar_url: r.profiles.avatar_url,
          status: r.status,
        }))
      );
    } else {
      const { data } = await supabase
        .from("pt_students")
        .select("pt_id, status, profiles!pt_students_pt_id_fkey(id, full_name, avatar_url)")
        .eq("student_id", user.id);

      setStudents(
        (data || []).map((r) => ({
          id: r.profiles.id,
          full_name: r.profiles.full_name,
          avatar_url: r.profiles.avatar_url,
          status: r.status,
        }))
      );
    }

    setLoading(false);
  }

  async function addStudent(email) {
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", (await supabase.rpc("get_user_id_by_email", { email_input: email })).data)
      .single();

    if (!targetProfile) {
      // Fallback: search by looking up auth users isn't possible via client.
      // Instead, we use a simpler approach - the PT enters the student's email
      // and we look them up via a database function or just store pending.
      return { error: { message: "Không tìm thấy học viên với email này" } };
    }

    const { error } = await supabase.from("pt_students").insert({
      pt_id: user.id,
      student_id: targetProfile.id,
      status: "pending",
    });

    if (!error) await fetchStudents();
    return { error };
  }

  async function addStudentById(studentId) {
    const { error } = await supabase.from("pt_students").insert({
      pt_id: user.id,
      student_id: studentId,
      status: "pending",
    });

    if (!error) await fetchStudents();
    return { error };
  }

  async function acceptInvite(ptId) {
    const { error } = await supabase
      .from("pt_students")
      .update({ status: "active" })
      .eq("pt_id", ptId)
      .eq("student_id", user.id);

    if (!error) await fetchStudents();
    return { error };
  }

  async function removeStudent(studentId) {
    const { error } = await supabase
      .from("pt_students")
      .delete()
      .eq("pt_id", user.id)
      .eq("student_id", studentId);

    if (!error) await fetchStudents();
    return { error };
  }

  return { students, loading, addStudent, addStudentById, acceptInvite, removeStudent, refetch: fetchStudents };
}
