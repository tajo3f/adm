# Checklist para colocar o TAJO ADMIN V1 no ar hoje

## A. Banco — 10 a 15 min
- [ ] Supabase > SQL Editor.
- [ ] Rodar `supabase/migrations/20261009_0001_tajo_admin_core.sql`.
- [ ] Rodar `supabase/verification.sql`.
- [ ] Authentication > Users: criar seu usuário admin.
- [ ] Rodar `supabase/bootstrap_super_admin.sql` com o seu e-mail.

## B. GitHub + Vercel — 10 a 20 min
- [ ] Criar repositório privado.
- [ ] Enviar todos os arquivos, **exceto `.env.local`**.
- [ ] Importar o repositório na Vercel.
- [ ] Adicionar as 4 Environment Variables descritas em `SETUP_VERCEL.md`.
- [ ] Deploy.

## C. Supabase Auth — 5 min
- [ ] Configurar Site URL e Redirect URLs com a URL real do deploy.
- [ ] Testar login.
- [ ] Testar logout.
- [ ] Testar recuperação de senha.

## D. Fluxo real — 10 min
- [ ] Criar cliente.
- [ ] Criar link para uma URL de teste.
- [ ] Abrir o link permanente `/p/CODIGO`.
- [ ] Confirmar redirecionamento.
- [ ] Baixar o QR PNG.
- [ ] Alterar o destino no painel.
- [ ] Abrir exatamente o mesmo link/QR e confirmar o novo destino.

## E. Domínio
Não imprima QR definitivo antes de configurar `go.tajodigital.com.br`, pois o domínio faz parte da URL física permanente.
