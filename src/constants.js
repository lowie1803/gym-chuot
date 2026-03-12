export const EXERCISE_LIBRARY = {
  "Ngực": [
    { id: "e1", name: "Bench Press", icon: "🏋️", muscle: "Ngực", equipment: "Barbell", desc: "Bài tập ngực cổ điển" },
    { id: "e2", name: "Incline DB Press", icon: "💪", muscle: "Ngực trên", equipment: "Dumbbell", desc: "Tập ngực trên hiệu quả" },
    { id: "e3", name: "Cable Fly", icon: "🔗", muscle: "Ngực", equipment: "Cable", desc: "Co cơ ngực cô lập" },
    { id: "e4", name: "Push-up", icon: "⬆️", muscle: "Ngực", equipment: "Bodyweight", desc: "Không cần thiết bị" },
  ],
  "Lưng": [
    { id: "e5", name: "Deadlift", icon: "🏗️", muscle: "Lưng dưới", equipment: "Barbell", desc: "Vua của các bài tập" },
    { id: "e6", name: "Pull-up", icon: "🔝", muscle: "Lưng rộng", equipment: "Bodyweight", desc: "Kéo xà đơn" },
    { id: "e7", name: "Seated Row", icon: "🚣", muscle: "Lưng giữa", equipment: "Cable", desc: "Kéo cáp ngồi" },
    { id: "e8", name: "Lat Pulldown", icon: "⬇️", muscle: "Lưng rộng", equipment: "Cable", desc: "Kéo cáp trên" },
  ],
  "Chân": [
    { id: "e9", name: "Squat", icon: "🦵", muscle: "Đùi trước", equipment: "Barbell", desc: "Bài tập nền tảng" },
    { id: "e10", name: "Leg Press", icon: "🦿", muscle: "Đùi", equipment: "Machine", desc: "Máy đẩy chân" },
    { id: "e11", name: "Romanian DL", icon: "🔄", muscle: "Đùi sau", equipment: "Barbell", desc: "Deadlift Romania" },
    { id: "e12", name: "Calf Raise", icon: "👟", muscle: "Bắp chân", equipment: "Machine", desc: "Nâng gót chân" },
  ],
  "Vai & Tay": [
    { id: "e13", name: "Overhead Press", icon: "🎯", muscle: "Vai", equipment: "Barbell", desc: "Đẩy tạ đầu" },
    { id: "e14", name: "Lateral Raise", icon: "↔️", muscle: "Vai bên", equipment: "Dumbbell", desc: "Nâng tạ bên" },
    { id: "e15", name: "Bicep Curl", icon: "💪", muscle: "Tay trước", equipment: "Dumbbell", desc: "Cuốn tay trước" },
    { id: "e16", name: "Tricep Pushdown", icon: "🔻", muscle: "Tay sau", equipment: "Cable", desc: "Đẩy cáp tay sau" },
  ],
  "Core": [
    { id: "e17", name: "Plank", icon: "📐", muscle: "Core", equipment: "Bodyweight", desc: "Giữ tư thế tĩnh" },
    { id: "e18", name: "Cable Crunch", icon: "🌀", muscle: "Bụng", equipment: "Cable", desc: "Gập bụng cáp" },
    { id: "e19", name: "Leg Raise", icon: "🦵", muscle: "Bụng dưới", equipment: "Bodyweight", desc: "Nâng chân" },
  ],
};

export const EQUIPMENT_COLOR = {
  Barbell: "#FF6B35",
  Dumbbell: "#4ECDC4",
  Cable: "#A78BFA",
  Machine: "#60A5FA",
  Bodyweight: "#34D399",
};

export const SAMPLE_STUDENTS = ["Tuấn Anh", "Minh Khoa", "Thu Hà", "Bảo Long"];

export const SAMPLE_MESSAGES = [
  { id: 1, from: "pt", name: "Coach Minh", avatar: "🏆", text: "Chào Tuấn! Hôm nay tao gửi mày bài Push Day mới 💪", time: "09:00" },
  { id: 2, from: "student", name: "Tuấn", avatar: "🧑", text: "Ngon! Anh, lần trước bài ngực em vẫn còn đau 😅", time: "09:02" },
  { id: 3, from: "pt", name: "Coach Minh", avatar: "🏆", text: "Bình thường, cơ đang phục hồi. Hôm nay giảm volume xuống:", time: "09:03", workout: true },
];
