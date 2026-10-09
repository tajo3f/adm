-- TAJO ADMIN V1 - BOOTSTRAP DO PRIMEIRO ADMIN
-- 1) Crie o usuário em Supabase > Authentication > Users.
-- 2) Substitua o e-mail abaixo pelo e-mail EXATO desse usuário.
-- 3) Rode este arquivo UMA VEZ no SQL Editor.

update public.profiles
set role = 'SUPER_ADMIN',
    is_active = true,
    updated_at = now()
where lower(email) = lower('SEU_EMAIL_ADMIN_AQUI');

-- Deve retornar exatamente 1 linha.
select id, email, role, is_active, created_at
from public.profiles
where lower(email) = lower('SEU_EMAIL_ADMIN_AQUI');
