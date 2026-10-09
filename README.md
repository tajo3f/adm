# TAJO ADMIN V1

Plataforma administrativa privada da **TAJO Digital 3F**, reconstruída do zero para uso real.

## Entregue nesta V1
- Login por Supabase Auth, sem cadastro público no app.
- Sessão SSR com cookies via `@supabase/ssr`.
- Perfil interno bloqueado por padrão e bootstrap de `SUPER_ADMIN`.
- Dashboard operacional.
- Clientes: criar, listar, filtrar, visualizar e editar.
- Links & QR: criar, editar destino, pausar/reativar, histórico, contador de acessos, PNG/SVG.
- URL permanente: `https://go.tajodigital.com.br/p/CODIGO`.
- Redirecionamento público via RPC restrita.
- RLS + grants mínimos + triggers de integridade + auditoria (inclui login/logout e alterações de dados).
- Recuperação e alteração de senha.
- Layout responsivo desktop/mobile.
- Headers de segurança e `noindex`.

**Não existe qualquer função NFC no sistema.** Se a URL permanente for usada em uma tag, a gravação é feita fora do TAJO ADMIN.

## Stack
- Next.js 16 / App Router
- React 19.2
- TypeScript
- Supabase Auth + Postgres + RLS
- Vercel
- `qrcode` para PNG/SVG
- Zod para validação

## Rodar local
1. Node.js 20.9+.
2. `npm install`
3. Confira `.env.local`.
4. Aplique a migration no Supabase conforme `docs/SETUP_SUPABASE.md`.
5. `npm run dev`
6. Abra `http://localhost:3000`.

## Validação antes do deploy
```bash
npm run lint
npm run typecheck
npm run build
```

## Arquivos importantes
- `supabase/migrations/20261009_0001_tajo_admin_core.sql`
- `supabase/bootstrap_super_admin.sql`
- `supabase/verification.sql`
- `docs/SETUP_SUPABASE.md`
- `docs/SETUP_VERCEL.md`
- `docs/SECURITY.md`
- `docs/DEPLOY_HOJE.md`

## Variáveis
Veja `.env.example`. A `.env.local` fornecida está ignorada pelo Git e contém somente a Project URL e a Publishable Key que você forneceu, além dos domínios configuráveis. Não coloque senha PostgreSQL ou Secret Key no repositório.
