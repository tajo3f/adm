# TAJO SECURITY REPORT — Pré-produção

## Resultado
**🟡 APROVADO COM RESSALVAS**

A revisão estática não encontrou Secret/Service Role key, senha de banco ou private key no pacote final. O projeto já possuía bons controles: Supabase Auth, RLS, grants mínimos, validação Zod, auditoria, autorização por função, rota QR autenticada, função pública isolada para redirecionamento e headers de segurança.

## Correções aplicadas nesta revisão
- `.env.local` removido do pacote destinado ao GitHub.
- Validação explícita da Project URL e Publishable Key.
- Bloqueio defensivo para evitar chave privilegiada em `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Variáveis server-only (`ADMIN_BASE_URL` e `PUBLIC_REDIRECT_BASE_URL`) separadas em `lib/server-env.ts`.
- URLs internas de produção exigem HTTPS.
- Removido fallback com Project Ref real do `next.config.ts`.
- CSP reforçada com `upgrade-insecure-requests` e Permissions-Policy ampliada.
- Senha nova/reset elevada para mínimo de 12 caracteres.
- Dependabot configurado.
- `SECURITY.md` e `PRODUCTION_CHECKLIST.md` adicionados.

## Controles já presentes e mantidos
- RLS em `profiles`, `clients`, `dynamic_links`, histórico e logs.
- `anon` sem SELECT/UPDATE direto nas tabelas internas.
- Resolver público via RPC específica.
- Policies por usuário ativo/função.
- Service Role não utilizada pelo frontend.
- Proteção contra open redirect no callback de autenticação via caminho interno.
- Validação de URL de destino HTTP/HTTPS.
- QR administrativo exige sessão e perfil ativo.
- CSP, HSTS, nosniff, frame denial, referrer policy e noindex.
- Auditoria de alterações e sessões no banco.

## Ressalvas antes de produção
1. Configurar na Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `PUBLIC_REDIRECT_BASE_URL`, `ADMIN_BASE_URL`.
2. Confirmar no Supabase que a migration foi aplicada e executar `supabase/verification.sql`.
3. Revisar o Supabase Security Advisor e resolver alertas críticos/altos.
4. Configurar Site URL/Redirect URLs do Supabase somente para os domínios oficiais necessários.
5. Ativar 2FA/passkey em GitHub, Vercel, Supabase e registrador do domínio.
6. Proteger `main` com ruleset/PR, bloquear force-push e deleção.
7. Ativar Secret Scanning/Push Protection quando disponível.
8. Confirmar que `.env.local` nunca entrou no histórico Git. Se algum segredo real entrou, revogar/rotacionar.
9. Gerar e versionar um lockfile (`package-lock.json`) em ambiente com acesso ao npm; o projeto ainda usa algumas dependências marcadas como `latest`, o que reduz reprodutibilidade de builds.
10. Rodar `npm run lint`, `npm run typecheck` e `npm run build` com as variáveis de ambiente reais antes do deploy. A instalação de dependências não pôde ser concluída neste ambiente dentro do tempo disponível, portanto o build final não foi certificado aqui.
11. Para proteção forte contra brute force/abuso em produção, configurar rate limits/CAPTCHA no Supabase Auth e, se o volume justificar, proteção adicional na borda. Não foi implementado um rate limiter em memória porque isso não é confiável em serverless.

## Security Gate
Não foram encontrados riscos críticos/altos conhecidos na revisão estática do código entregue, mas o projeto só deve ser considerado pronto após os itens manuais e os testes de build acima.
