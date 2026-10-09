import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loginAction } from '@/actions/auth'
import { Flash } from '@/components/flash'
import { SubmitButton } from '@/components/submit-button'
import { getAuthContext } from '@/lib/auth'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const { user, profile } = await getAuthContext()
  if (user && profile?.is_active) redirect('/dashboard')
  const params = await searchParams

  return <section className="auth-card">
    <div className="auth-brand"><img src="/tajo-logo.png" alt="TAJO Digital 3F" /><div><span>TAJO DIGITAL 3F</span><h1>Área Administrativa</h1><p>Acesso privado e protegido.</p></div></div>
    <Flash error={params.error} success={params.success} />
    <form action={loginAction} className="auth-form">
      <label className="field"><span>E-mail</span><input name="email" type="email" required autoComplete="email" maxLength={180} /></label>
      <label className="field"><span>Senha</span><input name="password" type="password" required autoComplete="current-password" minLength={8} maxLength={200} /></label>
      <SubmitButton className="button button-primary button-full">Entrar com segurança</SubmitButton>
    </form>
    <div className="auth-links"><Link href="/forgot-password">Esqueci minha senha</Link><span>Cadastro público desativado</span></div>
    <p className="auth-footnote">Sessões são validadas pelo Supabase Auth e o acesso aos dados também é verificado no banco por RLS.</p>
  </section>
}
