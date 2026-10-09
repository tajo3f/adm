import { serverEnv } from '@/lib/server-env'
export function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

export function safeInternalPath(value: string | null | undefined, fallback = '/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}

export function getPublicLink(code: string) {
  return `${serverEnv.publicRedirectBaseUrl}/p/${encodeURIComponent(code)}`
}

export function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export const destinationLabels: Record<string, string> = {
  google: 'Google Avaliações',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  site: 'Site',
  cardapio: 'Cardápio',
  catalogo: 'Catálogo',
  localizacao: 'Localização',
  formulario: 'Formulário',
  outro: 'Outro',
}

export const clientStatusLabels: Record<string, string> = {
  LEAD: 'Lead',
  NEGOCIACAO: 'Negociação',
  CLIENTE: 'Cliente',
  INATIVO: 'Inativo',
}
