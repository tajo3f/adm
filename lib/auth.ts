import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AppRole = 'SUPER_ADMIN' | 'ADMIN' | 'COMERCIAL' | 'FINANCEIRO' | 'OPERADOR' | 'VISUALIZADOR'

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: AppRole
  is_active: boolean
  last_login_at: string | null
}

export async function getAuthContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { supabase, user: null, profile: null as Profile | null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id,email,full_name,role,is_active,last_login_at')
    .eq('id', user.id)
    .maybeSingle()

  return { supabase, user, profile: (profile as Profile | null) ?? null }
}

export async function requireUser() {
  const ctx = await getAuthContext()
  if (!ctx.user) redirect('/login')
  if (!ctx.profile || !ctx.profile.is_active) redirect('/access-denied')
  return ctx as typeof ctx & { user: NonNullable<typeof ctx.user>; profile: Profile }
}

export async function requireRole(allowed: AppRole[]) {
  const ctx = await requireUser()
  if (!allowed.includes(ctx.profile.role)) redirect('/dashboard?error=sem-permissao')
  return ctx
}
