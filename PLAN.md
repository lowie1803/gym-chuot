# GymChuot — Product Plan

> **"Garmin Connect cho PT Việt Nam — nhưng giao diện đẹp hơn và có chat."**

---

## 1. Vision

GymChuot là nền tảng kết nối **PT online ↔ học viên** thông qua:
- Công cụ tạo bài tập chuyên nghiệp (drag & drop workout builder)
- Kênh giao tiếp dạng messenger hỗ trợ gửi workout card, video
- Thư viện bài tập chuẩn hóa cho thị trường Việt Nam

**Đối tượng ban đầu:** PT online Việt Nam đang quản lý học viên qua Zalo/Messenger — muốn công cụ xịn hơn mà không cần code.

---

## 2. Những gì đã làm (MVP v0.1)

### 2.1 Workout Builder

Tính năng đã hoạt động trong prototype:

- **Thư viện bài tập** bên trái: 19 bài tập mẫu, chia 5 nhóm cơ, có search + filter category
- **Drag & drop từ library → canvas**: Kéo bài tập từ thư viện vào builder
- **Drag để reorder**: Kéo thứ tự bài tập trong workout đã tạo
- **Double-click để thêm nhanh**: Thay thế cho drag nếu dùng mobile
- **Per-set configuration**: Mỗi set có Reps / Weight (kg) / Rest (giây) riêng
- **Thêm / xóa set** động
- **Summary bar realtime**: Tổng bài tập, tổng sets, thời gian ước tính
- **Chọn học viên** nhận bài tập
- **Đặt tên workout** trực tiếp trên header

### 2.2 Messenger

- Danh sách học viên bên trái với trạng thái online
- Chat bubble chuẩn (PT bên phải / học viên bên trái)
- **Workout card trong chat**: Khi PT gửi bài tập, xuất hiện dạng card đặc biệt — học viên expand ra xem danh sách bài, bấm "Bắt đầu tập"
- Slot đính kèm video (UI sẵn, cần backend)
- Toast notification khi gửi thành công

### 2.3 Kiến trúc prototype

```
gymchuot/
├── src/
│   ├── App.jsx          # Toàn bộ UI prototype (React, ~500 dòng)
│   └── useExercises.js  # Hook load & search bài tập
├── data/
│   ├── exercise-schema.json   # JSON Schema chuẩn của GymChuot
│   ├── exercises.json         # [Tạo bởi script] 800+ bài tập đã xử lý
│   └── exercises-raw.json     # [Tạo bởi script] Backup raw từ nguồn
├── scripts/
│   ├── import-exercises.js    # Pull data từ free-exercise-db
│   └── translate-vi.js        # Dịch tên bài tập sang tiếng Việt
└── package.json
```

---

## 3. Data Pipeline — free-exercise-db

### 3.1 Nguồn dữ liệu

| Nguồn | Bài tập | License | Dùng cho |
|---|---|---|---|
| **free-exercise-db** (yuhonas/GitHub) | 800+ | **Public Domain** ✅ | Import ngay — main source |
| ExerciseDB API | 1,300+ | Freemium | Backup, GIF animations |
| wrkout/exercises.json | 2,500+ | Commercial OK | Scale up sau |
| wger.de | ~200 | CC-BY-SA | Tham khảo, đóng góp lại |

**Quyết định:** Dùng `free-exercise-db` làm foundation vì:
1. Public Domain — không vướng license khi bán sản phẩm
2. Structured JSON sẵn với đầy đủ `primaryMuscles`, `secondaryMuscles`, `mechanic`, `force`
3. Kèm ảnh minh họa trên CDN GitHub

### 3.2 Chạy pipeline

```bash
# Bước 1: Pull và transform data
npm run data:import

# Bước 2: Dịch tên sang tiếng Việt (cần Anthropic API key)
ANTHROPIC_API_KEY=sk-... npm run data:translate

# Hoặc cả 2 bước:
ANTHROPIC_API_KEY=sk-... npm run data:all
```

**Output:** `data/exercises.json` — 800+ bài tập với:
- Tên EN + tên VI (sau bước translate)
- Nhóm cơ dịch sang tiếng Việt
- Equipment map chuẩn
- Fields mở rộng của GymChuot: `commonMistakes`, `videoUrl`, `gymchuotVerified`, `tags`

### 3.3 Schema mở rộng so với nguồn gốc

```
free-exercise-db fields (giữ nguyên):
  id, name, category, equipment, level, mechanic, force,
  primaryMuscles, secondaryMuscles, instructions, images

GymChuot thêm vào:
  nameVi           — Tên tiếng Việt
  commonMistakes[] — Lỗi phổ biến (PT cộng đồng đóng góp)
  videoUrl         — Video demo (≤ 25MB hoặc YouTube embed)
  gymchuotVerified — Đã review bởi PT trên nền tảng
  tags[]           — ["mông to", "giảm mỡ", "bụng 6 múi"] v.v.
```

### 3.4 Chiến lược data dài hạn

**Phase 1 (Hiện tại):** Import free-exercise-db + AI dịch tên VI → 800 bài, tốn ~$0.50 API cost
**Phase 2:** PT trên nền tảng đóng góp `commonMistakes` + `videoUrl`
**Phase 3:** Mở community submission — bài tập đặc thù Việt Nam (ví dụ: bài tập không cần thiết bị, phù hợp phòng gym nhỏ)
**Phase 4 (moat):** Dataset GymChuot trở thành tài sản độc quyền — không đối thủ nào có bản tiếng Việt được review bởi PT Việt Nam

---

## 4. Roadmap tính năng

### Phase 1 — Foundation (Hiện tại → 1 tháng)

| # | Tính năng | Mô tả | Status |
|---|---|---|---|
| 1.1 | Workout Builder UI | Drag & drop, per-set config | ✅ Done (prototype) |
| 1.2 | Messenger UI | Chat + workout card | ✅ Done (prototype) |
| 1.3 | Exercise data pipeline | Import 800+ bài từ free-exercise-db | ✅ Script sẵn |
| 1.4 | Auth (PT vs Student) | Đăng ký / đăng nhập, 2 role | 🔲 Next |
| 1.5 | Backend + DB | Supabase: users, workouts, messages | 🔲 Next |
| 1.6 | Real-time messaging | Supabase Realtime hoặc WebSocket | 🔲 Next |

### Phase 2 — Core Product (Tháng 2-3)

| # | Tính năng | Mô tả |
|---|---|---|
| 2.1 | Student Workout Viewer | Màn hình tập: đếm giờ nghỉ giữa set, log kết quả thực tế |
| 2.2 | Workout Templates | PT lưu template, nhân bản cho nhiều học viên |
| 2.3 | Video attachment | Upload video ≤ 25MB, preview trong chat |
| 2.4 | Push notifications | Nhắc học viên khi có bài tập mới |
| 2.5 | Exercise search nâng cao | Filter theo nhóm cơ, equipment, level |

### Phase 3 — Engagement (Tháng 4-6)

| # | Tính năng | Mô tả |
|---|---|---|
| 3.1 | Progress tracking | Học viên log kết quả → biểu đồ tiến độ theo thời gian |
| 3.2 | PT Dashboard | Quản lý nhiều học viên cùng lúc, tổng quan tiến độ |
| 3.3 | Workout history | Lịch sử tập luyện với filter theo ngày/tuần/tháng |
| 3.4 | Exercise notes | PT gắn note vào từng bài tập khi gửi cho học viên cụ thể |
| 3.5 | Mobile PWA | Responsive đầy đủ, installable trên Android/iOS |

### Phase 4 — Community & Scale (Tháng 6+)

| # | Tính năng | Mô tả |
|---|---|---|
| 4.1 | Exercise community contributions | PT đóng góp video demo, commonMistakes |
| 4.2 | Exercise verification system | Review + approve bài tập do community submit |
| 4.3 | PT Marketplace | PT tạo profile public, học viên tìm và kết nối |
| 4.4 | Workout Programs | PT tạo chương trình nhiều tuần, bán hoặc tặng học viên |
| 4.5 | AI workout suggestion | Gợi ý bài tập dựa trên lịch sử và mục tiêu học viên |

---

## 5. Tech Stack đề xuất (Production)

```
Frontend
├── Next.js 14 (App Router)
├── dnd-kit           # Drag & drop (thay thế native HTML5 DnD)
├── Tailwind CSS
└── Framer Motion     # Animations

Backend
├── Supabase
│   ├── PostgreSQL    # Database
│   ├── Auth          # Đăng nhập (email + Google)
│   ├── Realtime      # WebSocket cho chat
│   └── Storage       # Video ≤ 25MB
└── Edge Functions    # Serverless cho business logic

Data
├── free-exercise-db  # Base exercise data (public domain)
├── Anthropic API     # Dịch VI + AI suggestions
└── Supabase DB       # Custom exercises, PT contributions

Deploy
├── Vercel (Frontend + Edge Functions)
└── Supabase Cloud (DB + Storage)
```

**Ước tính cost giai đoạn đầu (< 100 PT active):**
- Supabase Free tier: $0
- Vercel Hobby: $0
- Supabase Storage 1GB cho video: $0.021/GB
- Anthropic API để dịch data: ~$0.50 một lần

---

## 6. Database Schema (Supabase PostgreSQL)

```sql
-- Users & Roles
users (id, email, full_name, role: 'pt' | 'student', avatar_url, created_at)

-- PT ↔ Student relationship
pt_students (pt_id, student_id, status: 'active' | 'pending', created_at)

-- Exercise Library
exercises (
  id, name, name_vi, category, equipment, level,
  primary_muscles[], secondary_muscles[],
  instructions[], image_urls[], video_url,
  common_mistakes[], tags[],
  gymchuot_verified, source, created_by, created_at
)

-- Workouts (tạo bởi PT)
workouts (id, pt_id, name, student_id, status: 'draft'|'sent'|'completed', created_at, sent_at)

-- Exercises trong một workout
workout_exercises (
  id, workout_id, exercise_id, order_index,
  sets: jsonb  -- [{reps, weight, rest}, ...]
  notes
)

-- Messages
messages (
  id, conversation_id, sender_id, type: 'text'|'workout'|'video',
  content, workout_id, video_url, created_at, read_at
)

-- Workout logs (học viên tập xong ghi lại)
workout_logs (
  id, workout_id, student_id, completed_at,
  exercises_log: jsonb  -- actual reps/weight thực hiện được
  notes, rating
)
```

---

## 7. Competitive Landscape

| Sản phẩm | Mạnh | Yếu | GymChuot vs |
|---|---|---|---|
| Garmin Connect | Data chính xác, ecosystem | UI phức tạp, không có chat | GymChuot UX đơn giản hơn + chat |
| Trainerize | Professional, đầy đủ | $20+/tháng, tiếng Anh | GymChuot giá thấp hơn, tiếng Việt |
| TrueCoach | Đẹp, mobile first | Không có ở VN, đắt | GymChuot local, hiểu thị trường VN |
| Zalo/Messenger | PT đang dùng rồi | Không có workout format | GymChuot built-for-purpose |

**Unique advantage:** Duy nhất có thư viện bài tập tiếng Việt + được PT Việt review.

---

## 8. Ghi chú kỹ thuật

### Tại sao không dùng thư viện DnD ngay trong prototype?
Prototype hiện dùng HTML5 native Drag & Drop API để tối giản dependency. Production nên migrate sang **dnd-kit** vì:
- Hỗ trợ touch (mobile quan trọng vì học viên tập ở gym)
- Accessible (keyboard navigation)
- Smoother animations
- Virtual list support cho 800+ bài tập

### Video ≤ 25MB — tại sao giới hạn này?
- PT hay quay clip kỹ thuật ngắn (~30-60 giây) để gửi học viên
- 25MB đủ cho clip Full HD 30s hoặc HD 60s
- Supabase Storage free tier: 1GB → ~40 video clips
- Nên giới hạn hard ở client trước khi upload

### Offline support cho học viên tại gym
Học viên cần xem bài tập trong lúc tập, nhiều gym sóng yếu. Giải pháp:
- Service Worker cache workout của ngày
- PWA installable → load offline được
- Bài tập đã nhận → luôn cache local

---

*Last updated: 2026-03 | Version: 0.1.0-mvp*
