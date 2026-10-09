# Configurar Vercel — TAJO ADMIN V1

Depois de enviar este projeto para o GitHub, importe o repositório na Vercel.

Em **Project > Settings > Environment Variables**, crie nas três scopes desejadas (Production / Preview / Development):

```env
NEXT_PUBLIC_SUPABASE_URL=https://mgbugxlxqqjutxpnjolu.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<SUA PUBLISHABLE KEY>
PUBLIC_REDIRECT_BASE_URL=https://go.tajodigital.com.br
ADMIN_BASE_URL=https://admin.tajodigital.com.br
```

A Publishable Key pode estar no cliente; ela não substitui RLS. **Não adicione Secret Key / service role ao frontend.**

Faça um novo deploy após alterar variáveis.

## Domínios
Quando o teste estiver concluído:

- `admin.tajodigital.com.br` → projeto TAJO ADMIN na Vercel.
- `go.tajodigital.com.br` → o mesmo projeto nesta V1, porque a rota `/p/[code]` está nele.

O site `tajodigital.com.br` não precisa ser alterado.

> Futuramente o redirecionador `go.` pode ser isolado em outro projeto, mas não é necessário para colocar a V1 no ar hoje.
