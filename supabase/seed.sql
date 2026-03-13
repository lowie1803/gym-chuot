-- GymChuot seed data (local dev only)
-- Runs automatically on `supabase db reset`

-- Fixed UUIDs for predictable references
-- PT accounts
-- pt1: Minh PT      = 00000000-0000-0000-0000-000000000001
-- pt2: Lan Coach    = 00000000-0000-0000-0000-000000000002
-- Student accounts
-- s1:  An Nguyễn    = 00000000-0000-0000-0000-000000000011
-- s2:  Bình Trần    = 00000000-0000-0000-0000-000000000012
-- s3:  Chi Lê       = 00000000-0000-0000-0000-000000000013
-- Workouts
-- w1:  Ngày chân    = 00000000-0000-0000-0000-0000000000a1
-- w2:  Ngày ngực+vai= 00000000-0000-0000-0000-0000000000a2
-- w3:  Cardio HIIT  = 00000000-0000-0000-0000-0000000000a3

------------------------------------------------------------------------
-- 1. Auth users (trigger auto-creates profiles)
------------------------------------------------------------------------
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  aud, role,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  is_sso_user, is_super_admin
) VALUES
  -- Minh PT
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'pt@test.com',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"pt","full_name":"Minh PT"}',
    'authenticated', 'authenticated',
    '', '', '', '',
    false, false
  ),
  -- Lan Coach
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'pt2@test.com',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"pt","full_name":"Lan Coach"}',
    'authenticated', 'authenticated',
    '', '', '', '',
    false, false
  ),
  -- An Nguyễn
  (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000000',
    'student1@test.com',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"student","full_name":"An Nguyễn"}',
    'authenticated', 'authenticated',
    '', '', '', '',
    false, false
  ),
  -- Bình Trần
  (
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000000',
    'student2@test.com',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"student","full_name":"Bình Trần"}',
    'authenticated', 'authenticated',
    '', '', '', '',
    false, false
  ),
  -- Chi Lê
  (
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000000',
    'student3@test.com',
    crypt('password123', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"student","full_name":"Chi Lê"}',
    'authenticated', 'authenticated',
    '', '', '', '',
    false, false
  );

-- Auth identities (required for email login to work)
INSERT INTO auth.identities (
  id, user_id, provider_id, provider,
  identity_data, last_sign_in_at, created_at, updated_at
) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'pt@test.com', 'email',
    '{"sub":"00000000-0000-0000-0000-000000000001","email":"pt@test.com","email_verified":true}',
    now(), now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'pt2@test.com', 'email',
    '{"sub":"00000000-0000-0000-0000-000000000002","email":"pt2@test.com","email_verified":true}',
    now(), now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000011',
    'student1@test.com', 'email',
    '{"sub":"00000000-0000-0000-0000-000000000011","email":"student1@test.com","email_verified":true}',
    now(), now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000012',
    '00000000-0000-0000-0000-000000000012',
    'student2@test.com', 'email',
    '{"sub":"00000000-0000-0000-0000-000000000012","email":"student2@test.com","email_verified":true}',
    now(), now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000013',
    'student3@test.com', 'email',
    '{"sub":"00000000-0000-0000-0000-000000000013","email":"student3@test.com","email_verified":true}',
    now(), now(), now()
  );

------------------------------------------------------------------------
-- 2. PT ↔ Student relationships
------------------------------------------------------------------------
INSERT INTO public.pt_students (pt_id, student_id, status) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'active'),   -- Minh → An
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', 'active'),   -- Minh → Bình
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000013', 'pending'),  -- Minh → Chi
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012', 'active');   -- Lan  → Bình

------------------------------------------------------------------------
-- 3. Workouts (created by Minh PT)
------------------------------------------------------------------------
INSERT INTO public.workouts (id, name, created_by) VALUES
  ('00000000-0000-0000-0000-0000000000a1', 'Ngày chân',        '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-0000000000a2', 'Ngày ngực + vai',  '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-0000000000a3', 'Cardio HIIT',      '00000000-0000-0000-0000-000000000001');

------------------------------------------------------------------------
-- 4. Workout exercises
------------------------------------------------------------------------
-- Ngày chân
INSERT INTO public.workout_exercises (workout_id, exercise_name, exercise_icon, order_index, sets, notes) VALUES
  (
    '00000000-0000-0000-0000-0000000000a1',
    'Squat', '🦵', 0,
    '[{"reps":10,"weight":60,"rest":90},{"reps":10,"weight":60,"rest":90},{"reps":8,"weight":70,"rest":120}]',
    'Giữ lưng thẳng, đầu gối không vượt mũi chân'
  ),
  (
    '00000000-0000-0000-0000-0000000000a1',
    'Leg Press', '🦵', 1,
    '[{"reps":12,"weight":100,"rest":60},{"reps":12,"weight":100,"rest":60},{"reps":10,"weight":120,"rest":90}]',
    NULL
  ),
  (
    '00000000-0000-0000-0000-0000000000a1',
    'Leg Curl', '🦵', 2,
    '[{"reps":12,"weight":30,"rest":60},{"reps":12,"weight":30,"rest":60},{"reps":12,"weight":30,"rest":60}]',
    'Tập chậm, giữ đỉnh 1 giây'
  ),
  (
    '00000000-0000-0000-0000-0000000000a1',
    'Calf Raise', '🦵', 3,
    '[{"reps":15,"weight":40,"rest":45},{"reps":15,"weight":40,"rest":45},{"reps":15,"weight":40,"rest":45}]',
    NULL
  );

-- Ngày ngực + vai
INSERT INTO public.workout_exercises (workout_id, exercise_name, exercise_icon, order_index, sets, notes) VALUES
  (
    '00000000-0000-0000-0000-0000000000a2',
    'Bench Press', '💪', 0,
    '[{"reps":10,"weight":50,"rest":90},{"reps":8,"weight":60,"rest":120},{"reps":6,"weight":70,"rest":120}]',
    'Hít vào khi hạ, thở ra khi đẩy'
  ),
  (
    '00000000-0000-0000-0000-0000000000a2',
    'Incline Dumbbell Press', '💪', 1,
    '[{"reps":12,"weight":20,"rest":60},{"reps":12,"weight":20,"rest":60},{"reps":10,"weight":22,"rest":90}]',
    NULL
  ),
  (
    '00000000-0000-0000-0000-0000000000a2',
    'Overhead Press', '💪', 2,
    '[{"reps":10,"weight":30,"rest":90},{"reps":10,"weight":30,"rest":90},{"reps":8,"weight":35,"rest":90}]',
    'Đứng thẳng, core siết chặt'
  ),
  (
    '00000000-0000-0000-0000-0000000000a2',
    'Lateral Raise', '💪', 3,
    '[{"reps":15,"weight":8,"rest":45},{"reps":15,"weight":8,"rest":45},{"reps":12,"weight":10,"rest":45}]',
    NULL
  );

-- Cardio HIIT
INSERT INTO public.workout_exercises (workout_id, exercise_name, exercise_icon, order_index, sets, notes) VALUES
  (
    '00000000-0000-0000-0000-0000000000a3',
    'Burpees', '🔥', 0,
    '[{"reps":10,"weight":0,"rest":30},{"reps":10,"weight":0,"rest":30},{"reps":10,"weight":0,"rest":30}]',
    NULL
  ),
  (
    '00000000-0000-0000-0000-0000000000a3',
    'Mountain Climbers', '🔥', 1,
    '[{"reps":20,"weight":0,"rest":30},{"reps":20,"weight":0,"rest":30},{"reps":20,"weight":0,"rest":30}]',
    '20 reps = 10 mỗi bên'
  ),
  (
    '00000000-0000-0000-0000-0000000000a3',
    'Jump Squat', '🔥', 2,
    '[{"reps":15,"weight":0,"rest":45},{"reps":15,"weight":0,"rest":45},{"reps":12,"weight":0,"rest":45}]',
    NULL
  );

------------------------------------------------------------------------
-- 5. Messages (Minh PT ↔ An Nguyễn)
------------------------------------------------------------------------
-- conversation_id format: sorted UUIDs joined with underscore
INSERT INTO public.messages (conversation_id, sender_id, receiver_id, type, text, workout_id, created_at) VALUES
  (
    '00000000-0000-0000-0000-000000000001_00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'text',
    'Chào An! Anh gửi bài tập tuần này cho em nhé 💪',
    NULL,
    now() - interval '2 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000001_00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'workout',
    NULL,
    '00000000-0000-0000-0000-0000000000a1',
    now() - interval '1 hour 55 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000001_00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'text',
    'Cảm ơn anh! Em sẽ tập chiều nay. Squat 70kg có nặng quá không anh?',
    NULL,
    now() - interval '1 hour 30 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000001_00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000011',
    'text',
    'Set cuối thôi em, 8 reps là vừa. Nếu khó quá thì giảm xuống 65kg nhé!',
    NULL,
    now() - interval '1 hour 20 minutes'
  ),
  (
    '00000000-0000-0000-0000-000000000001_00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000001',
    'text',
    'Ok anh, em hiểu rồi 👍',
    NULL,
    now() - interval '1 hour 15 minutes'
  );

------------------------------------------------------------------------
-- 6. Conversation reads (mark seeded messages as read)
------------------------------------------------------------------------
INSERT INTO public.conversation_reads (user_id, conversation_id, last_read_at) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001_00000000-0000-0000-0000-000000000011', now()),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001_00000000-0000-0000-0000-000000000011', now());
