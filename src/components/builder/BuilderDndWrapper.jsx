import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ExerciseTileOverlay } from "./ExerciseTile";
import { ExerciseCardOverlay } from "./ExerciseCard";

export default function BuilderDndWrapper({
  exercises,
  addExercise,
  reorderExercises,
  children,
}) {
  const [activeData, setActiveData] = useState(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const handleDragStart = useCallback((event) => {
    setActiveData(event.active.data.current);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      setActiveData(null);
      const { active, over } = event;
      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      // Library → Builder (copy)
      if (activeId.startsWith("library-")) {
        if (overId.startsWith("builder-") || overId === "builder-canvas") {
          const exercise = active.data.current?.exercise;
          if (exercise) addExercise(exercise);
        }
        return;
      }

      // Builder → Builder (reorder)
      if (activeId.startsWith("builder-") && overId.startsWith("builder-")) {
        if (activeId === overId) return;
        const oldIndex = exercises.findIndex(
          (e) => "builder-" + e.id === activeId
        );
        const newIndex = exercises.findIndex(
          (e) => "builder-" + e.id === overId
        );
        if (oldIndex !== -1 && newIndex !== -1) {
          reorderExercises(arrayMove(exercises, oldIndex, newIndex));
        }
      }
    },
    [exercises, addExercise, reorderExercises]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeData?.source === "library" && activeData.exercise ? (
          <ExerciseTileOverlay
            exercise={activeData.exercise}
            viewMode="grid-2"
          />
        ) : activeData?.source === "builder" && activeData.exercise ? (
          <ExerciseCardOverlay exercise={activeData.exercise} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
