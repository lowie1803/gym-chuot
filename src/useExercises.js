/**
 * useExercises.js — React hook để load và search bài tập
 *
 * Ưu tiên load từ /data/exercises.json (sau khi chạy import script).
 * Fallback về SAMPLE_EXERCISES nếu chưa có data.
 */

import { useState, useEffect, useMemo } from "react";

// Fallback data (subset) — dùng khi chưa chạy import script
const FALLBACK_EXERCISES = [
  {
    id: "Bench_Press_-_Barbell",
    name: "Bench Press",
    nameVi: "Đẩy ngực Barbell",
    category: "Ngực",
    equipment: "Barbell",
    level: "intermediate",
    mechanic: "compound",
    force: "push",
    primaryMuscles: ["Ngực"],
    secondaryMuscles: ["Tay sau (Triceps)", "Vai"],
    instructions: ["Nằm trên ghế phẳng...", "Hạ tạ xuống ngực..."],
    images: [],
    commonMistakes: [],
    videoUrl: null,
    gymchuotVerified: false,
  },
  // ... thêm bài tập fallback tại đây nếu cần
];

export function useExercises() {
  const [exercises, setExercises] = useState(FALLBACK_EXERCISES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/data/exercises.json")
      .then((r) => {
        if (!r.ok) throw new Error("Data file not found — using fallback");
        return r.json();
      })
      .then((data) => {
        setExercises(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("[useExercises]", err.message);
        setError(err.message);
        setLoading(false);
        // Keep fallback data
      });
  }, []);

  return { exercises, loading, error };
}

export function useExerciseSearch(exercises, query, filters = {}) {
  return useMemo(() => {
    let results = exercises;

    if (query?.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.nameVi?.toLowerCase().includes(q) ||
          ex.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
          ex.category?.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      results = results.filter((ex) => ex.category === filters.category);
    }

    if (filters.equipment) {
      results = results.filter((ex) => ex.equipment === filters.equipment);
    }

    if (filters.level) {
      results = results.filter((ex) => ex.level === filters.level);
    }

    if (filters.muscle) {
      results = results.filter(
        (ex) =>
          ex.primaryMuscles.includes(filters.muscle) ||
          ex.secondaryMuscles.includes(filters.muscle)
      );
    }

    return results;
  }, [exercises, query, filters]);
}

export function groupByCategory(exercises) {
  return exercises.reduce((acc, ex) => {
    const cat = ex.category || "Khác";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ex);
    return acc;
  }, {});
}
