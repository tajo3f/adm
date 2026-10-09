import Link from 'next/link'
import { forgotPasswordAction } from '@/actions/auth'
import { SubmitButton } from '@/components/submit-button'

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const { success } = await searchParams
  return <section className="auth-card auth-card-narrow">
    <div className="auth-brand compact"><img src="/tajo-logo.png" alt="TAJO Digital 3F" /><div><span>TAJO ADMIN</span><h1>Recuperar acesso</h1></div></div>
    {success && <div className="flash flash-success">Se o e-mail estiver autorizado, você receberá as instruções de recuperação.</div>}
    <form action={forgotPasswordAction} className="auth-form"><label className="field"><span>E-mail</span><input name="email" type="email" required autoComplete="email" maxLength={180} /></label><SubmitButton className="button button-primary button-full">Enviar instruções</SubmitButton></form>
    <div className="auth-links"><Link href="/login">Voltar ao login</Link></div>
  </section>
}
