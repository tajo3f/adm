-- TAJO ADMIN V1 - Core seguro: Auth profiles, Clients, Dynamic Links, audit e resolver público.
-- Execute uma única vez no SQL Editor do projeto Supabase ou via Supabase CLI migrations.

begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create type public.app_role as enum ('SUPER_ADMIN','ADMIN','COMERCIAL','FINANCEIRO','OPERADOR','VISUALIZADOR');
create type public.client_status as enum ('LEAD','NEGOCIACAO','CLIENTE','INATIVO');
create type public.destination_type as enum ('google','whatsapp','instagram','site','cardapio','catalogo','localizacao','formulario','outro');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.app_role not null default 'VISUALIZADOR',
  is_active boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  company text check (company is null or char_length(company) <= 160),
  phone text check (phone is null or char_length(phone) <= 30),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 30),
  email text check (email is null or char_length(email) <= 180),
  instagram text check (instagram is null or char_length(instagram) <= 120),
  city text check (city is null or char_length(city) <= 120),
  state text check (state is null or state ~ '^[A-Z]{2}$'),
  document text check (document is null or char_length(document) <= 30),
  notes text check (notes is null or char_length(notes) <= 2000),
  status public.client_status not null default 'CLIENTE',
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence public.dynamic_links_internal_seq start 1;

create table public.dynamic_links (
  id uuid primary key default extensions.gen_random_uuid(),
  internal_code text not null unique,
  public_code text not null unique,
  client_id uuid not null references public.clients(id) on delete restrict,
  destination_type public.destination_type not null,
  destination_url text not null,
  active boolean not null default true,
  access_count bigint not null default 0 check (access_count >= 0),
  last_access_at timestamptz,
  notes text check (notes is null or char_length(notes) <= 2000),
  created_by uuid not null references auth.users(id) on delete restrict,
  updated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dynamic_links_internal_code_format check (internal_code ~ '^T3F-[0-9]{6}$'),
  constraint dynamic_links_public_code_format check (public_code ~ '^[A-HJ-NP-Z2-9]{12}$'),
  constraint dynamic_links_destination_http check (destination_url ~* '^https?://[^[:space:]]+$')
);

create table public.dynamic_link_history (
  id bigint generated always as identity primary key,
  link_id uuid not null references public.dynamic_links(id) on delete cascade,
  previous_type public.destination_type not null,
  new_type public.destination_type not null,
  previous_url text not null,
  new_url text not null,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) between 2 and 80),
  resource text not null check (char_length(resource) between 2 and 80),
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index clients_status_idx on public.clients(status);
create index clients_name_idx on public.clients(lower(name));
create index dynamic_links_client_id_idx on public.dynamic_links(client_id);
create index dynamic_links_active_idx on public.dynamic_links(active);
create index dynamic_links_created_at_idx on public.dynamic_links(created_at desc);
create index dynamic_link_history_link_id_idx on public.dynamic_link_history(link_id, changed_at desc);
create index audit_logs_created_at_idx on public.audit_logs(created_at desc);

create or replace function private.current_user_is_active()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active = true
  );
$$;

create or replace function private.has_role(allowed public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.is_active = true
      and p.role = any(allowed)
  );
$$;

grant execute on function private.current_user_is_active() to authenticated;
grant execute on function private.has_role(public.app_role[]) to authenticated;

create or replace function private.random_public_code(code_length integer default 12)
returns text
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  bytes bytea;
  result text := '';
  i integer;
begin
  if code_length < 10 or code_length > 24 then
    raise exception 'invalid code length';
  end if;
  bytes := extensions.gen_random_bytes(code_length);
  for i in 0..code_length-1 loop
    result := result || substr(alphabet, (get_byte(bytes, i) % length(alphabet)) + 1, 1);
  end loop;
  return result;
end;
$$;
revoke all on function private.random_public_code(integer) from public, anon, authenticated;

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role, is_active)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data->>'full_name','')), ''),
    'VISUALIZADOR',
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_auth_user();

-- Cria profiles de usuários que já existiam antes da migration, todos BLOQUEADOS por padrão.
insert into public.profiles (id, email, full_name, role, is_active)
select u.id, u.email, nullif(trim(coalesce(u.raw_user_meta_data->>'full_name','')), ''), 'VISUALIZADOR', false
from auth.users u
on conflict (id) do nothing;

create or replace function private.clients_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
    new.updated_by := auth.uid();
  else
    new.created_by := old.created_by;
    new.updated_by := auth.uid();
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  new.email := nullif(trim(coalesce(new.email,'')), '');
  new.company := nullif(trim(coalesce(new.company,'')), '');
  new.phone := nullif(trim(coalesce(new.phone,'')), '');
  new.whatsapp := nullif(trim(coalesce(new.whatsapp,'')), '');
  new.instagram := nullif(trim(coalesce(new.instagram,'')), '');
  new.city := nullif(trim(coalesce(new.city,'')), '');
  new.state := nullif(upper(trim(coalesce(new.state,''))), '');
  new.document := nullif(trim(coalesce(new.document,'')), '');
  new.notes := nullif(trim(coalesce(new.notes,'')), '');
  return new;
end;
$$;

create trigger clients_guard_before_write
  before insert or update on public.clients
  for each row execute function private.clients_guard();

create or replace function private.dynamic_links_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate text;
  attempts integer := 0;
begin
  if tg_op = 'INSERT' then
    if auth.uid() is null then raise exception 'authentication required'; end if;
    new.internal_code := 'T3F-' || lpad(nextval('public.dynamic_links_internal_seq')::text, 6, '0');
    loop
      attempts := attempts + 1;
      candidate := private.random_public_code(12);
      exit when not exists (select 1 from public.dynamic_links d where d.public_code = candidate);
      if attempts >= 10 then raise exception 'could not generate unique public code'; end if;
    end loop;
    new.public_code := candidate;
    new.created_by := auth.uid();
    new.updated_by := auth.uid();
    new.destination_url := trim(new.destination_url);
    new.notes := nullif(trim(coalesce(new.notes,'')), '');
    new.updated_at := now();
    return new;
  end if;

  -- Atualizações públicas de métricas são feitas somente pela função SECURITY DEFINER
  -- resolve_dynamic_link(). O papel anon não possui UPDATE direto na tabela.
  if auth.uid() is null then
    new.internal_code := old.internal_code;
    new.public_code := old.public_code;
    new.client_id := old.client_id;
    new.destination_type := old.destination_type;
    new.destination_url := old.destination_url;
    new.active := old.active;
    new.notes := old.notes;
    new.created_by := old.created_by;
    new.updated_by := old.updated_by;
    new.created_at := old.created_at;
    new.updated_at := old.updated_at;
    return new;
  end if;

  new.internal_code := old.internal_code;
  new.public_code := old.public_code;
  new.client_id := old.client_id;
  new.created_by := old.created_by;
  new.created_at := old.created_at;
  new.updated_by := auth.uid();
  new.destination_url := trim(new.destination_url);
  new.notes := nullif(trim(coalesce(new.notes,'')), '');
  new.updated_at := now();
  return new;
end;
$$;

create trigger dynamic_links_guard_before_write
  before insert or update on public.dynamic_links
  for each row execute function private.dynamic_links_guard();

create or replace function private.log_destination_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.destination_url is distinct from new.destination_url
     or old.destination_type is distinct from new.destination_type then
    insert into public.dynamic_link_history (
      link_id, previous_type, new_type, previous_url, new_url, changed_by
    ) values (
      new.id, old.destination_type, new.destination_type,
      old.destination_url, new.destination_url, auth.uid()
    );
  end if;
  return new;
end;
$$;

create trigger dynamic_links_history_after_update
  after update on public.dynamic_links
  for each row execute function private.log_destination_change();

create or replace function private.audit_core_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  action_name text;
  resource_name text := tg_table_name;
  rid text;
begin
  -- Acesso público ao QR altera apenas métricas e não deve poluir o log administrativo.
  if auth.uid() is null then
    if tg_op = 'DELETE' then return old; else return new; end if;
  end if;

  action_name := upper(tg_table_name || '_' || tg_op);
  if tg_op = 'DELETE' then rid := old.id::text; else rid := new.id::text; end if;
  insert into public.audit_logs(actor_id, action, resource, resource_id, metadata)
  values (auth.uid(), action_name, resource_name, rid, jsonb_build_object('operation', tg_op));
  if tg_op = 'DELETE' then return old; else return new; end if;
end;
$$;

create trigger audit_clients_after_write
  after insert or update or delete on public.clients
  for each row execute function private.audit_core_changes();
create trigger audit_dynamic_links_after_write
  after insert or update or delete on public.dynamic_links
  for each row execute function private.audit_core_changes();

create or replace function public.mark_my_login()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  update public.profiles
  set last_login_at = now(), updated_at = now()
  where id = auth.uid() and is_active = true;

  if found then
    insert into public.audit_logs(actor_id, action, resource, resource_id, metadata)
    values (auth.uid(), 'LOGIN', 'session', auth.uid()::text, '{}'::jsonb);
  end if;
end;
$$;
revoke all on function public.mark_my_login() from public, anon;
grant execute on function public.mark_my_login() to authenticated;

create or replace function public.log_my_logout()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then return; end if;
  if exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_active = true) then
    insert into public.audit_logs(actor_id, action, resource, resource_id, metadata)
    values (auth.uid(), 'LOGOUT', 'session', auth.uid()::text, '{}'::jsonb);
  end if;
end;
$$;
revoke all on function public.log_my_logout() from public, anon;
grant execute on function public.log_my_logout() to authenticated;

create or replace function public.resolve_dynamic_link(p_code text)
returns table(destination_url text, destination_type public.destination_type)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_code is null or p_code !~ '^[A-HJ-NP-Z2-9]{12}$' then
    return;
  end if;

  return query
  update public.dynamic_links d
     set access_count = d.access_count + 1,
         last_access_at = now()
   where d.public_code = p_code
     and d.active = true
  returning d.destination_url, d.destination_type;
end;
$$;

revoke all on function public.resolve_dynamic_link(text) from public;
grant execute on function public.resolve_dynamic_link(text) to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.dynamic_links enable row level security;
alter table public.dynamic_link_history enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select_self_or_admin
on public.profiles for select to authenticated
using (
  id = auth.uid()
  or private.has_role(array['SUPER_ADMIN','ADMIN']::public.app_role[])
);

create policy clients_select_active_staff
on public.clients for select to authenticated
using (private.current_user_is_active());

create policy clients_insert_editor
on public.clients for insert to authenticated
with check (private.has_role(array['SUPER_ADMIN','ADMIN','COMERCIAL','OPERADOR']::public.app_role[]));

create policy clients_update_editor
on public.clients for update to authenticated
using (private.has_role(array['SUPER_ADMIN','ADMIN','COMERCIAL','OPERADOR']::public.app_role[]))
with check (private.has_role(array['SUPER_ADMIN','ADMIN','COMERCIAL','OPERADOR']::public.app_role[]));

create policy links_select_active_staff
on public.dynamic_links for select to authenticated
using (private.current_user_is_active());

create policy links_insert_editor
on public.dynamic_links for insert to authenticated
with check (private.has_role(array['SUPER_ADMIN','ADMIN','COMERCIAL','OPERADOR']::public.app_role[]));

create policy links_update_editor
on public.dynamic_links for update to authenticated
using (private.has_role(array['SUPER_ADMIN','ADMIN','COMERCIAL','OPERADOR']::public.app_role[]))
with check (private.has_role(array['SUPER_ADMIN','ADMIN','COMERCIAL','OPERADOR']::public.app_role[]));

create policy link_history_select_active_staff
on public.dynamic_link_history for select to authenticated
using (private.current_user_is_active());

create policy audit_logs_select_admin
on public.audit_logs for select to authenticated
using (private.has_role(array['SUPER_ADMIN','ADMIN']::public.app_role[]));

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.clients from anon, authenticated;
revoke all on table public.dynamic_links from anon, authenticated;
revoke all on table public.dynamic_link_history from anon, authenticated;
revoke all on table public.audit_logs from anon, authenticated;
revoke all on sequence public.dynamic_links_internal_seq from anon, authenticated;

-- O frontend autenticado recebe somente operações que também passam pelas policies RLS.
grant select on table public.profiles to authenticated;
grant select on table public.clients to authenticated;
grant insert (name, company, phone, whatsapp, email, instagram, city, state, document, notes, status)
  on table public.clients to authenticated;
grant update (name, company, phone, whatsapp, email, instagram, city, state, document, notes, status)
  on table public.clients to authenticated;

grant select on table public.dynamic_links to authenticated;
grant insert (client_id, destination_type, destination_url, active, notes)
  on table public.dynamic_links to authenticated;
grant update (destination_type, destination_url, active, notes)
  on table public.dynamic_links to authenticated;

grant select on table public.dynamic_link_history to authenticated;
grant select on table public.audit_logs to authenticated;

-- ANON não recebe SELECT direto em nenhuma tabela. A única porta pública é a função abaixo.
revoke all on table public.profiles from anon;
revoke all on table public.clients from anon;
revoke all on table public.dynamic_links from anon;
revoke all on table public.dynamic_link_history from anon;
revoke all on table public.audit_logs from anon;

commit;
