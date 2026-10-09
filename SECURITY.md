# TAJO Security Policy

## Regras de produção
- Repositório privado para projetos proprietários.
- 2FA/passkey obrigatório no GitHub, Vercel, Supabase e registrador do domínio.
- Nunca commitar `.env*`, senhas, tokens, Secret/Service Role keys ou connection strings.
- `NEXT_PUBLIC_*` aceita somente valores deliberadamente públicos. Nunca use Service Role/Secret Key.
- Toda tabela exposta pelo Supabase deve usar RLS e policies mínimas.
- Mudanças de produção passam por branch/PR e revisão antes de `main`.
- Segredo que entrou em commit deve ser revogado/rotacionado; apagar o arquivo não é suficiente.

## Relato de vulnerabilidade
Não abra issue pública contendo credenciais ou dados de clientes. Trate incidentes por canal privado do responsável pelo projeto.
