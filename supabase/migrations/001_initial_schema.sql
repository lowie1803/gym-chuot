-- GymChuot initial schema
-- Tables: profiles, pt_students, workouts, workout_exercises, messages

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('pt', 'student')),
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- PT <> Student relationships
create table public.pt_students (
  pt_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('active', 'pending')),
  created_at timestamptz not null default now(),
  primary key (pt_id, student_id)
);

alter table public.pt_students enable row level security;

create policy "PTs and students can read their relationships"
  on public.pt_students for select
  using (auth.uid() = pt_id or auth.uid() = student_id);

create policy "PTs can insert relationships"
  on public.pt_students for insert
  with check (auth.uid() = pt_id);

create policy "Students can update their pending invites"
  on public.pt_students for update
  using (auth.uid() = student_id);

create policy "PTs can delete relationships"
  on public.pt_students for delete
  using (auth.uid() = pt_id);

-- Workouts
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.workouts enable row level security;

create policy "Users can read workouts they created"
  on public.workouts for select
  using (auth.uid() = created_by);

create policy "Users can create workouts"
  on public.workouts for insert
  with check (auth.uid() = created_by);

create policy "Users can update their own workouts"
  on public.workouts for update
  using (auth.uid() = created_by);

create policy "Users can delete their own workouts"
  on public.workouts for delete
  using (auth.uid() = created_by);

-- Workout exercises
create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_name text not null,
  exercise_icon text not null default '',
  order_index int not null default 0,
  sets jsonb not null default '[]',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.workout_exercises enable row level security;

create policy "Users can read workout exercises for accessible workouts"
  on public.workout_exercises for select
  using (
    workout_id in (select id from public.workouts)
  );

create policy "Users can insert exercises for their workouts"
  on public.workout_exercises for insert
  with check (
    workout_id in (select id from public.workouts where created_by = auth.uid())
  );

create policy "Users can update exercises for their workouts"
  on public.workout_exercises for update
  using (
    workout_id in (select id from public.workouts where created_by = auth.uid())
  );

create policy "Users can delete exercises for their workouts"
  on public.workout_exercises for delete
  using (
    workout_id in (select id from public.workouts where created_by = auth.uid())
  );

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'text' check (type in ('text', 'workout', 'video')),
  text text,
  workout_id uuid references public.workouts(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_messages_conversation on public.messages(conversation_id, created_at);

alter table public.messages enable row level security;

create policy "Users can read their own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Deferred policies (depend on tables defined above)
create policy "Users can read profiles of connected users"
  on public.profiles for select
  using (
    id in (
      select student_id from public.pt_students where pt_id = auth.uid()
      union
      select pt_id from public.pt_students where student_id = auth.uid()
    )
  );

create policy "Users can read workouts shared with them via messages"
  on public.workouts for select
  using (
    id in (
      select workout_id from public.messages
      where workout_id is not null
        and (sender_id = auth.uid() or receiver_id = auth.uid())
    )
  );

-- Enable realtime for messages
alter publication supabase_realtime add table public.messages;
