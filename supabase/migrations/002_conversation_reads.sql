-- Track when a user last read a conversation (for unread counts)

create table public.conversation_reads (
  user_id uuid not null references public.profiles(id) on delete cascade,
  conversation_id text not null,
  last_read_at timestamptz not null default now(),
  primary key (user_id, conversation_id)
);

alter table public.conversation_reads enable row level security;

create policy "Users can read own conversation_reads"
  on public.conversation_reads for select
  using (auth.uid() = user_id);

create policy "Users can upsert own conversation_reads"
  on public.conversation_reads for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversation_reads"
  on public.conversation_reads for update
  using (auth.uid() = user_id);

-- Get unread message counts for a list of conversations
create or replace function public.get_unread_counts(
  p_user_id uuid,
  p_conversation_ids text[]
)
returns table(conversation_id text, unread_count bigint)
language sql stable security definer
as $$
  select
    m.conversation_id,
    count(*)::bigint as unread_count
  from public.messages m
  left join public.conversation_reads cr
    on cr.user_id = p_user_id
    and cr.conversation_id = m.conversation_id
  where m.conversation_id = any(p_conversation_ids)
    and m.sender_id != p_user_id
    and m.created_at > coalesce(cr.last_read_at, '1970-01-01'::timestamptz)
  group by m.conversation_id;
$$;

-- Get the last message per conversation
create or replace function public.get_last_messages(
  p_conversation_ids text[]
)
returns table(
  conversation_id text,
  type text,
  text text,
  sender_id uuid,
  created_at timestamptz
)
language sql stable security definer
as $$
  select distinct on (m.conversation_id)
    m.conversation_id,
    m.type,
    m.text,
    m.sender_id,
    m.created_at
  from public.messages m
  where m.conversation_id = any(p_conversation_ids)
  order by m.conversation_id, m.created_at desc;
$$;
