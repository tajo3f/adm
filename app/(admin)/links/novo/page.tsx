import { Flash } from '@/components/flash'
import { LinkForm } from '@/components/link-form'
import { requireRole } from '@/lib/auth'
import { EDITOR_ROLES } from '@/lib/permissions'

export default async function NewLinkPage({ searchParams }: { searchParams: Promise<{ error?: string; client?: string }> }) {
  const params = await searchParams
  const { supabase } = await requireRole(EDITOR_ROLES)
  const { data: clients } = await supabase.from('clients').select('id,name,company').neq('status', 'INATIVO').order('company', { ascending: true }).order('name', { ascending: true }).limit(500)
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">LINKS & QR</span><h1>Novo link dinâmico</h1><p>O código público e o código interno serão gerados pelo banco, não pelo navegador.</p></div></div><Flash error={params.error} />{!clients?.length ? <div className="panel empty-state"><strong>Cadastre um cliente primeiro</strong><p>Todo link dinâmico precisa estar vinculado a um cliente.</p><a className="button button-primary" href="/clientes/novo">Cadastrar cliente</a></div> : <LinkForm clients={clients} selectedClientId={params.client} />}</div>
}
