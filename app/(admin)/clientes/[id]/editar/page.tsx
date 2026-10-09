import { notFound } from 'next/navigation'
import { ClientForm } from '@/components/client-form'
import { Flash } from '@/components/flash'
import { requireRole } from '@/lib/auth'
import { EDITOR_ROLES } from '@/lib/permissions'
import type { ClientRecord } from '@/types/database'

export default async function EditClientPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params
  const q = await searchParams
  const { supabase } = await requireRole(EDITOR_ROLES)
  const { data } = await supabase.from('clients').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">CLIENTES</span><h1>Editar cliente</h1><p>Atualize apenas o necessário.</p></div></div><Flash error={q.error} /><ClientForm client={data as ClientRecord} /></div>
}
