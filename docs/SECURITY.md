# Segurança — TAJO ADMIN V1

Nenhuma aplicação conectada à internet é “impossível de hackear”. Esta V1 reduz superfície de ataque usando defesa em profundidade.

## Camadas
1. **Supabase Auth**: sem cadastro público no app.
2. **Perfil interno bloqueado por padrão**: toda nova conta nasce `is_active=false`.
3. **Autorização server-side**: layouts e Server Actions verificam sessão e função.
4. **RLS**: o banco repete a autorização; esconder botão não concede segurança.
5. **Grants mínimos**: `anon` não possui acesso direto às tabelas administrativas.
6. **Sem secret key no frontend**: somente Project URL + Publishable Key.
7. **Mutações administrativas via Server Actions** e RLS, sem endpoints CRUD públicos próprios.
8. **Proteção contra open redirect**: somente HTTP/HTTPS passa na validação de aplicação e constraint SQL.
9. **Códigos públicos aleatórios**: QR não usa ID incremental.
10. **Headers**: CSP, HSTS, nosniff, deny iframe, no-referrer e Permissions-Policy.
11. **Noindex**: painel e redirecionador não devem ser indexados.
12. **Auditoria e histórico**: alterações importantes são registradas pelo banco.

## O que NÃO está nesta fase
- MFA/TOTP completo: preparado para fase seguinte, mas não simulamos uma interface incompleta.
- WAF customizado/rate limit próprio: use proteção da Vercel/Supabase e, se o volume exigir, evolua com mecanismo dedicado.
- Criptografia de campos de aplicação: o banco fica restrito por RLS; dados de alta sensibilidade devem ser evitados se não forem necessários.

## Regras operacionais
- Ative 2FA na conta do GitHub, Supabase e Vercel.
- Use senha exclusiva para o primeiro SUPER_ADMIN.
- Nunca cole `sb_secret_...`, senha do Postgres ou connection string completa em código, issue ou commit.
- Rotacione uma chave secreta imediatamente se ela for exposta. A Publishable Key não é uma credencial secreta, mas ainda deve ser mantida como configuração de ambiente.
- Faça backup do banco e revise logs periodicamente.
