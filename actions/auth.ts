 'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { serverEnv } from '@/lib/server-env'
import { loginSchema, resetPasswordSchema } from '@/lib/validators'

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) redirect('/login?error=credenciais')

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) redirect('/login?error=credenciais')

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?error=credenciais')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.is_active) {
    await supabase.auth.signOut()
    redirect('/access-denied')
  }

  await supabase.rpc('mark_my_login')
  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.rpc('log_my_logout')
  await supabase.auth.signOut()
  redirect('/login?success=sessao-encerrada')
}

export async function forgotPasswordAction(formData: FormData) {
  const email = z.string().trim().email().max(180).safeParse(formData.get('email'))
  if (email.success) {
    const supabase = await createClient()
    await supabase.auth.resetPasswordForEmail(email.data, {
      redirectTo: `${serverEnv.adminBaseUrl}/auth/callback?next=/reset-password`,
    })
  }

  // Mensagem neutra evita enumeração de usuários.
  redirect('/forgot-password?success=1')
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  })
  if (!parsed.success) redirect('/reset-password?error=senha-invalida')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=sessao-expirada')

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) redirect('/reset-password?error=nao-foi-possivel')
  redirect('/dashboard?success=senha-alterada')
}

export async function changePasswordAction(formData: FormData) {
  return resetPasswordAction(formData)
}
