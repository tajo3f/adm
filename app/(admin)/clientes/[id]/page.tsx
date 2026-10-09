import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Flash } from '@/components/flash'
import { LinkIcon, PlusIcon } from '@/components/icons'
import { StatusBadge } from '@/components/status-badge'
import { requireUser } from '@/lib/auth'
import { clientStatusLabels, destinationLabels, formatDate } from '@/lib/utils'
import type { ClientRecord } from '@/types/database'
import type { DestinationType } from '@/types/supabase'

type ClientLinkSummary = { id: string; internal_code: string; destination_type: DestinationType; active: boolean; access_count: number; last_access_at: string | null }

export default async function ClientDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; success?: string }> }) {
  const { id } = await params
  const q = await searchParams
  const { supabase } = await requireUser()
  const [{ data: client }, { data: links }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', id).maybeSingle(),
    supabase.from('dynamic_links').select('id,internal_code,destination_type,active,access_count,last_access_at').eq('client_id', id).order('created_at', { ascending: false }),
  ])
  if (!client) notFound()
  const c = client as ClientRecord
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">CLIENTE</span><h1>{c.company || c.name}</h1><p>{c.company ? c.name : clientStatusLabels[c.status]}</p></div><div className="heading-actions"><Link className="button button-secondary" href={`/clientes/${id}/editar`}>Editar</Link><Link className="button button-primary" href={`/links/novo?client=${id}`}><PlusIcon width={17} />Novo link</Link></div></div><Flash error={q.error} success={q.success} /><div className="two-column"><section className="panel detail-list"><div className="panel-heading"><div><span className="eyebrow">DADOS</span><h2>Informações</h2></div><span className="badge badge-outline">{clientStatusLabels[c.status]}</span></div><dl><div><dt>WhatsApp</dt><dd>{c.whatsapp || '—'}</dd></div><div><dt>Telefone</dt><dd>{c.phone || '—'}</dd></div><div><dt>E-mail</dt><dd>{c.email || '—'}</dd></div><div><dt>Instagram</dt><dd>{c.instagram || '—'}</dd></div><div><dt>Localidade</dt><dd>{[c.city,c.state].filter(Boolean).join(' / ') || '—'}</dd></div><div><dt>Cadastrado</dt><dd>{formatDate(c.created_at)}</dd></div></dl>{c.notes && <div className="notes-box"><strong>Observações</strong><p>{c.notes}</p></div>}</section><section className="panel"><div className="panel-heading"><div><span className="eyebrow">LINKS & QR</span><h2>Redirecionamentos</h2></div></div>{!links?.length ? <div className="empty-state compact"><LinkIcon width={28} /><strong>Nenhum link</strong><p>Este cliente ainda não possui QR dinâmico.</p></div> : <div className="stack-list">{(links as ClientLinkSummary[]).map((l: ClientLinkSummary) => <Link className="stack-row" key={l.id} href={`/links/${l.id}`}><div><strong>{l.internal_code}</strong><span>{destinationLabels[l.destination_type]}</span></div><div className="row-end"><span>{l.access_count} acessos</span><StatusBadge active={l.active} /></div></Link>)}</div>}</section></div></div>
}
