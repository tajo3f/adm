import { resetPasswordAction } from '@/actions/auth'
import { Flash } from '@/components/flash'
import { SubmitButton } from '@/components/submit-button'
import { getAuthContext } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { user } = await getAuthContext()
  if (!user) redirect('/login?error=sessao-expirada')
  const params = await searchParams
  return <section className="auth-card auth-card-narrow"><div className="auth-brand compact"><img src="/tajo-logo.png" alt="TAJO Digital 3F" /><div><span>TAJO ADMIN</span><h1>Nova senha</h1></div></div><Flash error={params.error} /><form action={resetPasswordAction} className="auth-form"><label className="field"><span>Nova senha</span><input name="password" type="password" required minLength={10} maxLength={200} autoComplete="new-password" /></label><label className="field"><span>Confirmar senha</span><input name="confirm_password" type="password" required minLength={10} maxLength={200} autoComplete="new-password" /></label><SubmitButton className="button button-primary button-full">Alterar senha</SubmitButton></form></section>
}
