import Link from 'next/link'

export default function AccessDeniedPage() {
  return <section className="auth-card auth-card-narrow"><div className="auth-brand compact"><img src="/tajo-logo.png" alt="TAJO Digital 3F" /><div><span>TAJO ADMIN</span><h1>Acesso não liberado</h1></div></div><div className="security-note"><strong>Conta sem acesso administrativo</strong><span>Seu usuário precisa estar ativo no perfil interno da TAJO. Isso impede que uma conta criada no Auth obtenha acesso automaticamente.</span></div><div className="form-actions"><Link className="button button-primary" href="/login">Voltar ao login</Link></div></section>
}
