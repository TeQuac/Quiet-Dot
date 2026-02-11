-- Silentap: Split-Mode-Highscores global speichern
-- Im Supabase SQL Editor komplett ausführen.

begin;

create table if not exists public.game_scores (
  id bigserial primary key,
  username text not null unique,
  highscore integer not null default 0 check (highscore >= 0),
  split_highscore integer not null default 0 check (split_highscore >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.game_scores
  add column if not exists split_highscore integer not null default 0 check (split_highscore >= 0);

alter table public.game_scores
  add column if not exists created_at timestamptz not null default now();

alter table public.game_scores
  add column if not exists updated_at timestamptz not null default now();

create index if not exists game_scores_highscore_idx on public.game_scores (highscore desc);
create index if not exists game_scores_split_highscore_idx on public.game_scores (split_highscore desc);

create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_game_scores_updated_at on public.game_scores;
create trigger trg_game_scores_updated_at
before update on public.game_scores
for each row execute function public.tg_set_updated_at();

create or replace function public.submit_score_mode(
  p_username text,
  p_mode text,
  p_score integer
)
returns public.game_scores
language plpgsql
security definer
set search_path = public
as $$
declare
  v_mode text := lower(trim(coalesce(p_mode, 'normal')));
  v_row public.game_scores;
begin
  if p_username is null or length(trim(p_username)) = 0 then
    raise exception 'Username darf nicht leer sein';
  end if;

  if p_score is null or p_score < 0 then
    raise exception 'Score muss >= 0 sein';
  end if;

  if v_mode not in ('normal', 'split') then
    raise exception 'Ungültiger Modus: %', p_mode;
  end if;

  insert into public.game_scores (username, highscore, split_highscore)
  values (trim(p_username), 0, 0)
  on conflict (username) do nothing;

  if v_mode = 'normal' then
    update public.game_scores
    set highscore = greatest(highscore, p_score)
    where username = trim(p_username)
    returning * into v_row;
  else
    update public.game_scores
    set split_highscore = greatest(split_highscore, p_score)
    where username = trim(p_username)
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

revoke all on function public.submit_score_mode(text, text, integer) from public;
grant execute on function public.submit_score_mode(text, text, integer) to anon;
grant execute on function public.submit_score_mode(text, text, integer) to authenticated;

alter table public.game_scores enable row level security;

drop policy if exists "game_scores_select_all" on public.game_scores;
create policy "game_scores_select_all"
on public.game_scores
for select
to anon, authenticated
using (true);

drop policy if exists "game_scores_insert_initial" on public.game_scores;
create policy "game_scores_insert_initial"
on public.game_scores
for insert
to anon, authenticated
with check (highscore = 0 and split_highscore = 0);

commit;
