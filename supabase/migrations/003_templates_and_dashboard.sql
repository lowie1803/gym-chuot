-- Add template support to workouts
alter table public.workouts
  add column is_template boolean not null default false;

-- Index for fast template lookup by PT
create index idx_workouts_templates
  on public.workouts (created_by, is_template)
  where is_template = true;
