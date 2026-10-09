import Link from 'next/link'

export default function NotFound() {
  return <main className="center-page"><div className="error-card"><span className="eyebrow">404</span><h1>Página não encontrada</h1><p>O endereço solicitado não existe ou não está disponível.</p><Link className="button button-primary" href="/dashboard">Voltar ao painel</Link></div></main>
}
