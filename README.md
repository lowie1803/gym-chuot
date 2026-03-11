# 🐭 GymChuot

> Cổng giao tiếp bài tập giữa PT online và học viên — Workout builder + Messenger.

## Quick Start (Prototype)

Mở `src/App.jsx` trong [StackBlitz](https://stackblitz.com) hoặc bất kỳ React playground nào (CodeSandbox, v.v.).

Hoặc chạy local:

```bash
npm install
npm run dev
```

## Data Pipeline

Pull 800+ bài tập từ [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (Public Domain):

```bash
# Import và transform
npm run data:import

# Dịch tên sang tiếng Việt (cần ANTHROPIC_API_KEY)
ANTHROPIC_API_KEY=sk-... npm run data:translate
```

Xem chi tiết trong `PLAN.md`.

## Cấu trúc project

```
src/
  App.jsx            # UI prototype — Workout Builder + Messenger
  useExercises.js    # React hook load & search bài tập

data/
  exercise-schema.json  # JSON Schema chuẩn
  exercises.json        # [Generated] 800+ bài tập (sau khi chạy script)

scripts/
  import-exercises.js   # Pull data từ free-exercise-db
  translate-vi.js       # Dịch tên sang tiếng Việt

PLAN.md  # Bản kế hoạch đầy đủ
```

## License

Code: MIT  
Exercise data (sau khi import): Public Domain (từ free-exercise-db)
