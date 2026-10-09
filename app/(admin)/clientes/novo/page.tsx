import { Flash } from '@/components/flash'
import { ClientForm } from '@/components/client-form'
import { requireRole } from '@/lib/auth'
import { EDITOR_ROLES } from '@/lib/permissions'

export default async function NewClientPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireRole(EDITOR_ROLES)
  const params = await searchParams
  return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">CLIENTES</span><h1>Novo cliente</h1><p>Cadastre somente informações necessárias ao atendimento.</p></div></div><Flash error={params.error} /><ClientForm /></div>
}
