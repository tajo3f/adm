# TAJO Production Security Gate

## Contas e repositório
- [ ] GitHub privado e 2FA/passkey ativo
- [ ] Vercel, Supabase e registrador com 2FA
- [ ] `main` protegida contra force-push/deleção e alterações via PR
- [ ] Secret scanning / push protection habilitados quando disponíveis
- [ ] Dependabot habilitado

## Segredos
- [ ] `.env.local` não está no Git/histórico
- [ ] Nenhuma Service Role/Secret Key no frontend
- [ ] Variáveis da Vercel configuradas para Production
- [ ] Qualquer segredo anteriormente exposto foi rotacionado

## Supabase
- [ ] Migration aplicada
- [ ] RLS e policies verificadas
- [ ] Security Advisor sem alerta crítico/alto não tratado
- [ ] Usuário anônimo não possui SELECT/UPDATE direto nas tabelas internas
- [ ] Auth: Site URL e Redirect URLs limitados aos domínios oficiais
- [ ] MFA habilitado para administradores quando disponível

## Vercel / domínio
- [ ] HTTPS funcionando
- [ ] `ADMIN_BASE_URL` e `PUBLIC_REDIRECT_BASE_URL` usam HTTPS
- [ ] Domínios oficiais vinculados ao projeto correto
- [ ] Domain Lock e renovação automática ativos

## Testes
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] login/logout/reset testados
- [ ] usuário inativo bloqueado
- [ ] usuário sem permissão não altera dados
- [ ] rota pública `/p/[code]` testada
- [ ] QR exige autenticação
