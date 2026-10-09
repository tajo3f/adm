function requirePublicUrl(name: 'NEXT_PUBLIC_SUPABASE_URL') {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`TAJO ADMIN: configure ${name}.`)
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') throw new Error('https required')
    return url.toString().replace(/\/$/, '')
  } catch {
    throw new Error(`TAJO ADMIN: ${name} precisa ser uma URL HTTPS válida.`)
  }
}

function requirePublicKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
  if (!value) throw new Error('TAJO ADMIN: configure NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
  if (/service[_-]?role|secret/i.test(value)) {
    throw new Error('TAJO ADMIN: chave privilegiada detectada em variável NEXT_PUBLIC_. Use somente a Publishable Key.')
  }
  return value
}

export const env = {
  supabaseUrl: requirePublicUrl('NEXT_PUBLIC_SUPABASE_URL'),
  supabasePublishableKey: requirePublicKey(),
}
