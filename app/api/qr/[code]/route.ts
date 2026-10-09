import QRCode from 'qrcode'
import { createClient } from '@/lib/supabase/server'
import { getPublicLink } from '@/lib/utils'

const CODE_RE = /^[A-HJ-NP-Z2-9]{12}$/

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params
  const code = raw.toUpperCase()
  if (!CODE_RE.test(code)) return new Response('Código inválido', { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Não autorizado', { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('is_active').eq('id', user.id).maybeSingle()
  if (!profile?.is_active) return new Response('Não autorizado', { status: 403 })

  const { data: link } = await supabase.from('dynamic_links').select('public_code').eq('public_code', code).maybeSingle()
  if (!link) return new Response('QR não encontrado', { status: 404 })

  const url = new URL(request.url)
  const format = url.searchParams.get('format') === 'png' ? 'png' : 'svg'
  const download = url.searchParams.get('download') === '1'
  const publicUrl = getPublicLink(link.public_code)

  const common = {
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
  }

  if (format === 'png') {
    const image = await QRCode.toBuffer(publicUrl, { type: 'png', errorCorrectionLevel: 'M', margin: 3, width: 1400 })
    return new Response(new Uint8Array(image), { headers: { ...common, 'Content-Type': 'image/png', ...(download ? { 'Content-Disposition': `attachment; filename="${code}.png"` } : {}) } })
  }

  const svg = await QRCode.toString(publicUrl, { type: 'svg', errorCorrectionLevel: 'M', margin: 3, width: 1400 })
  return new Response(svg, { headers: { ...common, 'Content-Type': 'image/svg+xml; charset=utf-8', ...(download ? { 'Content-Disposition': `attachment; filename="${code}.svg"` } : {}) } })
}
