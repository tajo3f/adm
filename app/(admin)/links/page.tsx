import Link from 'next/link'
import { Flash } from '@/components/flash'
import { LinkIcon, PlusIcon } from '@/components/icons'
import { StatusBadge } from '@/components/status-badge'
import { requireUser } from '@/lib/auth'
import { destinationLabels, formatDate } from '@/lib/utils'
import type { DestinationType } from '@/types/supabase'

type LinkListRow = { id: string; internal_code: string; public_code: string; destination_type: DestinationType; active: boolean; access_count: number; last_access_at: string | null; created_at: string; clients: { name: string; company: string | null } | null }

export default async function LinksPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; error?: string; success?: string }> }) {
  const { supabase } = await requireUser()
  const params = await searchParams
  const q = (params.q || '').trim().toUpperCase().slice(0, 40)
  const status = params.status || ''
  let query = supabase.from('dynamic_links').select('id,internal_code,public_code,destination_type,active,access_count,last_access_at,created_at,clients(name,company)').order('created_at', { ascending: false }).limit(100)
  if (q) query = query.ilike('internal_code', `%${q}%`)
  if (status === 'active') query = query.eq('active', true)
  if (status === 'paused') query = query.eq('active', false)
  const { data, error } = await query

  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">LINKS & QR</span><h1>Links dinâmicos</h1><p>Um endereço permanente, destinos editáveis e QR que não precisa ser reimpresso.</p></div><Link className="button button-primary" href="/links/novo"><PlusIcon width={17} />Novo link</Link></div><Flash error={params.error || (error ? 'nao-foi-possivel' : undefined)} success={params.success} /><section className="panel"><form className="filters" method="get"><label><span className="sr-only">Buscar código</span><input name="q" defaultValue={q} placeholder="Buscar T3F-000001…" maxLength={40} /></label><label><span className="sr-only">Status</span><select name="status" defaultValue={status}><option value="">Todos</option><option value="active">Ativos</option><option value="paused">Pausados</option></select></label><button className="button button-secondary" type="submit">Filtrar</button></form>{!data?.length ? <div className="empty-state"><LinkIcon width={30} /><strong>Nenhum link encontrado</strong><p>Crie um link dinâmico para gerar o primeiro QR permanente.</p><Link className="button button-primary" href="/links/novo">Criar link</Link></div> : <div className="table-wrap"><table><thead><tr><th>Código</th><th>Cliente</th><th>Destino</th><th>Status</th><th>Acessos</th><th>Último acesso</th></tr></thead><tbody>{(data as LinkListRow[]).map((l: LinkListRow) => <tr key={l.id}><td><Link className="primary-cell" href={`/links/${l.id}`}><strong>{l.internal_code}</strong><span>{l.public_code}</span></Link></td><td>{l.clients?.company || l.clients?.name || '—'}</td><td>{destinationLabels[l.destination_type] || l.destination_type}</td><td><StatusBadge active={l.active} /></td><td>{l.access_count}</td><td>{formatDate(l.last_access_at)}</td></tr>)}</tbody></table></div>}</section></div>
}
