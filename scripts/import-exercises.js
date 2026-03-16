/**
 * gymchuot — Import script: free-exercise-db → exercises.json
 *
 * Nguồn: https://github.com/yuhonas/free-exercise-db
 * License: Public Domain
 *
 * Chạy: node scripts/import-exercises.js
 * Output: data/exercises.json + data/exercises-vi.json (bản tiếng Việt)
 *
 * Cần cài: npm install node-fetch
 */

const fs = require("fs");
const path = require("path");

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const SOURCE_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

const OUTPUT_DIR = path.join(__dirname, "../data");
const OUTPUT_RAW = path.join(OUTPUT_DIR, "exercises-raw.json");
const OUTPUT_CLEAN = path.join(OUTPUT_DIR, "exercises.json");

// Map muscle names: free-exercise-db (EN) → GymChuot schema
const MUSCLE_MAP_EN = {
  abdominals: "Bụng",
  abductors: "Dạng đùi",
  adductors: "Khép đùi",
  biceps: "Tay trước (Biceps)",
  calves: "Bắp chân",
  chest: "Ngực",
  forearms: "Cẳng tay",
  glutes: "Mông",
  hamstrings: "Đùi sau",
  "hip flexors": "Gấp háng",
  "it band": "Dải IT",
  lats: "Lưng rộng",
  "lower back": "Lưng dưới",
  "middle back": "Lưng giữa",
  neck: "Cổ",
  quadriceps: "Đùi trước",
  shoulders: "Vai",
  traps: "Thang lưng",
  triceps: "Tay sau (Triceps)",
};

const EQUIPMENT_MAP_EN = {
  barbell: "Barbell",
  "cable": "Cable",
  dumbbell: "Dumbbell",
  "e-z curl bar": "EZ Bar",
  "exercise ball": "Exercise Ball",
  "foam roll": "Foam Roller",
  "kettlebells": "Kettlebell",
  "machine": "Machine",
  "medicine ball": "Medicine Ball",
  "body only": "Bodyweight",
  bands: "Resistance Band",
  other: "Other",
};

const CATEGORY_MAP = {
  chest: "Ngực",
  back: "Lưng",
  shoulders: "Vai",
  arms: "Tay",
  legs: "Chân",
  core: "Core",
  cardio: "Cardio",
  "olympic weightlifting": "Olympic",
  powerlifting: "Powerlifting",
  stretching: "Khởi động / Giãn cơ",
  plyometrics: "Plyometrics",
  strongman: "Strongman",
};

// ─── TRANSFORM ────────────────────────────────────────────────────────────────

function transformExercise(raw) {
  return {
    id: raw.id,
    name: raw.name,
    nameVi: null, // Filled later by translate step or AI
    category: CATEGORY_MAP[raw.category?.toLowerCase()] || raw.category,
    equipment: EQUIPMENT_MAP_EN[raw.equipment?.toLowerCase()] || raw.equipment || "Other",
    level: raw.level, // beginner | intermediate | expert
    mechanic: raw.mechanic, // compound | isolation | null
    force: raw.force, // push | pull | static | null
    primaryMuscles: (raw.primaryMuscles || []).map(
      (m) => MUSCLE_MAP_EN[m.toLowerCase()] || m
    ),
    secondaryMuscles: (raw.secondaryMuscles || []).map(
      (m) => MUSCLE_MAP_EN[m.toLowerCase()] || m
    ),
    instructions: raw.instructions || [],
    images: (raw.images || []).map(
      (img) =>
        `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`
    ),
    // GymChuot-specific fields (to be filled by PT community)
    commonMistakes: [],
    videoUrl: null,
    gymchuotVerified: false,
  };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("📥 Fetching free-exercise-db...");

  let raw;
  try {
    // Node 18+ has built-in fetch; for older Node use node-fetch
    const fetch = globalThis.fetch || require("node-fetch");
    const res = await fetch(SOURCE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.json();
  } catch (err) {
    console.error("❌ Fetch failed:", err.message);
    console.log("💡 Thử chạy lại hoặc tải file thủ công từ:");
    console.log("   https://github.com/yuhonas/free-exercise-db/blob/main/dist/exercises.json");
    process.exit(1);
  }

  console.log(`✅ Fetched ${raw.length} exercises`);

  // Save raw backup
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_RAW, JSON.stringify(raw, null, 2));
  console.log(`💾 Raw saved → ${OUTPUT_RAW}`);

  // Transform
  const exercises = raw.map(transformExercise);

  // Stats
  const byCategory = exercises.reduce((acc, ex) => {
    acc[ex.category] = (acc[ex.category] || 0) + 1;
    return acc;
  }, {});
  console.log("\n📊 Phân bổ theo nhóm:");
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`   ${cat}: ${count}`));

  const byEquipment = exercises.reduce((acc, ex) => {
    acc[ex.equipment] = (acc[ex.equipment] || 0) + 1;
    return acc;
  }, {});
  console.log("\n🏋️  Phân bổ theo thiết bị:");
  Object.entries(byEquipment)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .forEach(([eq, count]) => console.log(`   ${eq}: ${count}`));

  // Save clean
  fs.writeFileSync(OUTPUT_CLEAN, JSON.stringify(exercises, null, 2));
  console.log(`\n✅ Clean data saved → ${OUTPUT_CLEAN}`);
  console.log(`   Tổng: ${exercises.length} bài tập`);

  // Generate index file for fast lookup
  const index = {
    total: exercises.length,
    byCategory: byCategory,
    byEquipment: byEquipment,
    muscles: [...new Set(exercises.flatMap((e) => e.primaryMuscles))].sort(),
    lastUpdated: new Date().toISOString(),
    source: "https://github.com/yuhonas/free-exercise-db",
    license: "Public Domain",
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "exercises-index.json"),
    JSON.stringify(index, null, 2)
  );
  console.log("📋 Index saved → data/exercises-index.json");
}

main().catch(console.error);
