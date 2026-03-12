# GymChuot — PT ↔ Student Workout Platform

## What this is
Kết nối PT online ↔ học viên qua drag-and-drop workout builder + messenger với workout cards. Currently a React prototype — no backend yet. Target: PT Việt Nam đang quản lý học viên qua Zalo/Messenger.

## Tech stack
React + Vite + Tailwind CSS (prototype)
Planned production: Next.js 14 + dnd-kit + Supabase + Vercel

## Commands
```
npm run dev           # Start dev server
npm run build         # Production build
npm run data:import   # Pull + transform exercises from free-exercise-db
npm run data:translate # Translate exercise names to Vietnamese (needs ANTHROPIC_API_KEY)
npm run data:all      # Both data steps
```

## Key constraints & preferences
- `data/exercises.json` is generated, don't edit by hand — re-run the pipeline instead
- DnD uses native HTML5 API now; migrate to dnd-kit when going to production (touch support)
- Vietnamese-first: UI labels, exercise names, and error messages should be in Vietnamese
- Video uploads hard-capped at 25MB (gym clips, not full videos)
- Plain prop drilling (no Context/Zustand) — max 2-3 levels deep; introduce Context when Supabase replaces local state

## What's in progress right now
Phase 1: building auth + Supabase backend to turn prototype into a real product.

## Where to find things
- Backlog: `.project/backlog/BACKLOG.md` (table + inbox)
- Architecture decisions: `.project/decisions/`
- Roadmap: `.project/product/ROADMAP.md`
- Skills: `.claude/skills/architecture/SKILL.md` — App.jsx structure, useExercises hook, data pipeline
- Full product plan: `PLAN.md`
