import { useState, useMemo } from "react";
import rawExercises from "../../data/exercises.json";

const MUSCLE_GROUPS = {
  "Ngực": ["Ngực"],
  "Lưng": ["Lưng rộng", "Lưng giữa", "Lưng dưới", "Thang lưng"],
  "Chân": ["Đùi trước", "Đùi sau", "Mông", "Bắp chân", "Dạng đùi", "Khép đùi"],
  "Vai & Tay": ["Vai", "Tay trước (Biceps)", "Tay sau (Triceps)", "Cẳng tay"],
  "Core": ["Bụng", "Cổ"],
};

const CATEGORIES = Object.keys(MUSCLE_GROUPS);

function muscleToCategory(primaryMuscles) {
  for (const muscle of primaryMuscles) {
    for (const [cat, muscles] of Object.entries(MUSCLE_GROUPS)) {
      if (muscles.includes(muscle)) return cat;
    }
  }
  return "Core";
}

const mappedExercises = rawExercises.map((ex) => ({
  ...ex,
  muscle: ex.primaryMuscles[0] || "Khác",
  categoryGroup: muscleToCategory(ex.primaryMuscles),
}));

export function useExercises() {
  return { exercises: mappedExercises, categories: CATEGORIES, loading: false };
}

export function useExerciseSearch(exercises, categories) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0] || "Ngực");

  const filtered = useMemo(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return exercises.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.nameVi && e.nameVi.toLowerCase().includes(q)) ||
          e.muscle.toLowerCase().includes(q)
      );
    }
    return exercises.filter((e) => e.categoryGroup === activeCategory);
  }, [exercises, searchQuery, activeCategory]);

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    filtered,
  };
}
