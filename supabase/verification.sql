-- TAJO ADMIN V1 - verificações rápidas após migration

-- RLS deve estar habilitado nas 5 tabelas.
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('profiles','clients','dynamic_links','dynamic_link_history','audit_logs')
order by c.relname;

-- Policies existentes.
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles','clients','dynamic_links','dynamic_link_history','audit_logs')
order by tablename, policyname;

-- Grants: anon NÃO deve possuir acesso direto às tabelas do TAJO ADMIN.
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('profiles','clients','dynamic_links','dynamic_link_history','audit_logs')
order by table_name, grantee, privilege_type;

-- Função pública de redirecionamento deve existir.
select routine_schema, routine_name, security_type
from information_schema.routines
where routine_schema = 'public'
  and routine_name in ('resolve_dynamic_link','mark_my_login','log_my_logout');
