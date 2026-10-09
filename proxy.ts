import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  const hostname = (request.headers.get('host') || '').split(':')[0].toLowerCase()
  const path = request.nextUrl.pathname

  // Quando o domínio público estiver ativo, ele expõe SOMENTE o redirecionador.
  if (hostname === 'go.tajodigital.com.br') {
    if (!path.startsWith('/p/') && path !== '/robots.txt') {
      return new NextResponse('Not found', {
        status: 404,
        headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
      })
    }
    return NextResponse.next()
  }

  // A rota pública não precisa consultar/renovar sessão de administrador.
  if (path.startsWith('/p/')) return NextResponse.next()

  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.png|icon-192.png|icon-512.png|apple-touch-icon.png|manifest.webmanifest|tajo-logo.png).*)',
  ],
}
