# Configurar Supabase — TAJO ADMIN V1

## 1. Projeto
Use o projeto:

`https://mgbugxlxqqjutxpnjolu.supabase.co`

A aplicação usa **Publishable Key**. Não use Secret Key / service role no navegador.

## 2. Aplicar a migration
No painel do Supabase:

1. Abra **SQL Editor**.
2. Cole todo o conteúdo de `supabase/migrations/20261009_0001_tajo_admin_core.sql`.
3. Clique em **Run**.
4. Rode `supabase/verification.sql` e confira que todas as tabelas aparecem com `rls_enabled = true`.

A migration não apaga tabelas antigas do seu projeto.

## 3. Desativar cadastro público
Em **Authentication > Providers > Email** mantenha o fluxo de criação pública desativado para o admin. O painel não possui rota de cadastro.

## 4. Criar o primeiro usuário
Em **Authentication > Users**, crie manualmente o usuário administrador com e-mail e senha fortes.

Depois abra `supabase/bootstrap_super_admin.sql`, troque `SEU_EMAIL_ADMIN_AQUI` pelo e-mail criado e execute no SQL Editor. O SELECT final deve retornar `SUPER_ADMIN` e `is_active = true`.

## 5. Recuperação de senha
Em **Authentication > URL Configuration** adicione:

- Site URL: `https://admin.tajodigital.com.br`
- Redirect URL: `https://admin.tajodigital.com.br/auth/callback`

Enquanto estiver testando pela URL da Vercel, adicione também o callback da URL de preview/produção da Vercel.

## Segurança aplicada
- RLS em todas as tabelas privadas.
- `anon` sem SELECT/INSERT/UPDATE direto nas tabelas.
- A única operação pública do QR é `resolve_dynamic_link(code)` e ela devolve somente o destino de links ativos.
- Funções auxiliares ficam no schema `private`.
- Códigos públicos aleatórios de 12 caracteres, não sequenciais.
- Código interno gerado no banco.
- Histórico de troca de destino gerado por trigger.
- Audit log gerado no banco, sem depender do navegador.
- Novas contas do Auth nascem `is_active=false`.
