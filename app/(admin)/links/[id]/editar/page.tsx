import { notFound } from 'next/navigation'
import { Flash } from '@/components/flash'
import { LinkForm } from '@/components/link-form'
import { requireRole } from '@/lib/auth'
import { EDITOR_ROLES } from '@/lib/permissions'
import type { DynamicLinkRecord } from '@/types/database'

export default async function EditLinkPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params
  const q = await searchParams
  const { supabase } = await requireRole(EDITOR_ROLES)
  const [{ data: link }, { data: clients }] = await Promise.all([
    supabase.from('dynamic_links').select('*').eq('id', id).maybeSingle(),
    supabase.from('clients').select('id,name,company').order('company', { ascending: true }).order('name', { ascending: true }).limit(500),
  ])
  if (!link) notFound()
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">{link.internal_code}</span><h1>Editar destino</h1><p>O QR e a URL permanente não mudam.</p></div></div><Flash error={q.error} /><LinkForm clients={clients || []} link={link as DynamicLinkRecord} /></div>
}
