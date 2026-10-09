import { NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/public'
import { isSafeHttpUrl } from '@/lib/utils'

const CODE_RE = /^[A-HJ-NP-Z2-9]{12}$/

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code: raw } = await params
  const code = raw.toUpperCase()

  if (!CODE_RE.test(code)) {
    return new Response('Link não encontrado.', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  }

  const supabase = createPublicClient()
  const { data, error } = await supabase.rpc('resolve_dynamic_link', { p_code: code })
  const row = Array.isArray(data) ? data[0] : data

  if (error || !row?.destination_url || !isSafeHttpUrl(row.destination_url)) {
    return new Response('Link não encontrado.', { status: 404, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } })
  }

  const response = NextResponse.redirect(row.destination_url, 302)
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}
