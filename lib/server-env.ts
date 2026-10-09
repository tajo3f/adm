import 'server-only'

function httpsUrl(name: 'PUBLIC_REDIRECT_BASE_URL' | 'ADMIN_BASE_URL', fallback: string) {
  const value = (process.env[name] || fallback).trim().replace(/\/+$/, '')
  try {
    const url = new URL(value)
    const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    if (url.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && local)) {
      throw new Error('https required')
    }
    return value
  } catch {
    throw new Error(`TAJO ADMIN: ${name} precisa ser uma URL HTTPS válida em produção.`)
  }
}

export const serverEnv = {
  publicRedirectBaseUrl: httpsUrl('PUBLIC_REDIRECT_BASE_URL', 'https://go.tajodigital.com.br'),
  adminBaseUrl: httpsUrl('ADMIN_BASE_URL', 'https://admin.tajodigital.com.br'),
}
