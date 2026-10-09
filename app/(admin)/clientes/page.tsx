import Link from 'next/link'
import { Flash } from '@/components/flash'
import { PlusIcon, UsersIcon } from '@/components/icons'
import { requireUser } from '@/lib/auth'
import { clientStatusLabels, formatDate } from '@/lib/utils'
import type { ClientStatus } from '@/types/supabase'

type ClientListRow = { id: string; name: string; company: string | null; whatsapp: string | null; email: string | null; city: string | null; state: string | null; status: ClientStatus; created_at: string }

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; error?: string; success?: string }> }) {
  const { supabase } = await requireUser()
  const params = await searchParams
  const q = (params.q || '').trim().slice(0, 120)
  const status = params.status || ''

  let query = supabase.from('clients').select('id,name,company,whatsapp,email,city,state,status,created_at').order('created_at', { ascending: false }).limit(100)
  if (q) query = query.ilike('name', `%${q}%`)
  if (['LEAD','NEGOCIACAO','CLIENTE','INATIVO'].includes(status)) query = query.eq('status', status as ClientStatus)
  const { data, error } = await query

  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">CRM BÁSICO</span><h1>Clientes</h1><p>Dados comerciais protegidos por autenticação, RLS e permissões.</p></div><Link className="button button-primary" href="/clientes/novo"><PlusIcon width={17} />Novo cliente</Link></div><Flash error={params.error || (error ? 'nao-foi-possivel' : undefined)} success={params.success} /><section className="panel"><form className="filters" method="get"><label><span className="sr-only">Buscar cliente</span><input name="q" defaultValue={q} placeholder="Buscar por nome…" maxLength={120} /></label><label><span className="sr-only">Status</span><select name="status" defaultValue={status}><option value="">Todos os status</option><option value="LEAD">Lead</option><option value="NEGOCIACAO">Negociação</option><option value="CLIENTE">Cliente</option><option value="INATIVO">Inativo</option></select></label><button className="button button-secondary" type="submit">Filtrar</button></form>{!data?.length ? <div className="empty-state"><UsersIcon width={30} /><strong>Nenhum cliente encontrado</strong><p>Cadastre um cliente para começar a criar links dinâmicos.</p><Link className="button button-primary" href="/clientes/novo">Cadastrar cliente</Link></div> : <div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Contato</th><th>Cidade</th><th>Status</th><th>Cadastro</th></tr></thead><tbody>{(data as ClientListRow[]).map((c: ClientListRow) => <tr key={c.id}><td><Link className="primary-cell" href={`/clientes/${c.id}`}><strong>{c.company || c.name}</strong>{c.company && <span>{c.name}</span>}</Link></td><td>{c.whatsapp || c.email || '—'}</td><td>{[c.city,c.state].filter(Boolean).join(' / ') || '—'}</td><td><span className="badge badge-outline">{clientStatusLabels[c.status] || c.status}</span></td><td>{formatDate(c.created_at)}</td></tr>)}</tbody></table></div>}</section></div>
}
