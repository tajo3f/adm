import Link from 'next/link'
import { Flash } from '@/components/flash'
import { ArrowIcon, LinkIcon, PlusIcon, UsersIcon } from '@/components/icons'
import { StatusBadge } from '@/components/status-badge'
import { requireUser } from '@/lib/auth'
import { destinationLabels, formatDate } from '@/lib/utils'

type RecentLink = { id: string; internal_code: string; destination_type: string; active: boolean; access_count: number; created_at: string; clients: { name: string; company: string | null } | null }

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const { supabase, profile } = await requireUser()
  const params = await searchParams

  const [clientsCount, linksCount, activeCount, linksRecent] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).neq('status', 'INATIVO'),
    supabase.from('dynamic_links').select('*', { count: 'exact', head: true }),
    supabase.from('dynamic_links').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('dynamic_links').select('id,internal_code,destination_type,active,access_count,created_at,clients(name,company)').order('created_at', { ascending: false }).limit(5),
  ])

  const recentLinks = (linksRecent.data || []) as RecentLink[]
  const totalAccess = recentLinks.reduce((sum: number, item: RecentLink) => sum + Number(item.access_count || 0), 0)
  return <div className="page-stack">
    <div className="page-heading"><div><span className="eyebrow">VISÃO GERAL</span><h1>Olá, {profile.full_name?.split(' ')[0] || 'Administrador'}.</h1><p>O essencial da operação, sem ruído.</p></div><div className="heading-actions"><Link className="button button-secondary" href="/clientes/novo"><UsersIcon width={17} />Novo cliente</Link><Link className="button button-primary" href="/links/novo"><PlusIcon width={17} />Novo link</Link></div></div>
    <Flash error={params.error} success={params.success} />
    <section className="metrics-grid" aria-label="Indicadores"><article className="metric-card"><span>Clientes ativos</span><strong>{clientsCount.count ?? 0}</strong><small>cadastros em uso</small></article><article className="metric-card"><span>Links cadastrados</span><strong>{linksCount.count ?? 0}</strong><small>QR dinâmicos</small></article><article className="metric-card"><span>Links ativos</span><strong>{activeCount.count ?? 0}</strong><small>aptos a redirecionar</small></article><article className="metric-card"><span>Acessos recentes*</span><strong>{totalAccess}</strong><small>*soma dos 5 últimos links</small></article></section>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">ATIVIDADE</span><h2>Links recentes</h2></div><Link className="text-link" href="/links">Ver todos <ArrowIcon width={15} /></Link></div>{!recentLinks.length ? <div className="empty-state"><LinkIcon width={30} /><strong>Nenhum link criado ainda</strong><p>Crie o primeiro redirecionamento permanente para gerar o QR.</p><Link className="button button-primary" href="/links/novo">Criar primeiro link</Link></div> : <div className="table-wrap"><table><thead><tr><th>Código</th><th>Cliente</th><th>Destino</th><th>Status</th><th>Acessos</th><th>Criado</th></tr></thead><tbody>{recentLinks.map((row: RecentLink) => <tr key={row.id}><td><Link className="mono-link" href={`/links/${row.id}`}>{row.internal_code}</Link></td><td>{row.clients?.company || row.clients?.name || '—'}</td><td>{destinationLabels[row.destination_type] || row.destination_type}</td><td><StatusBadge active={row.active} /></td><td>{row.access_count}</td><td>{formatDate(row.created_at)}</td></tr>)}</tbody></table></div>}</section>
  </div>
}
