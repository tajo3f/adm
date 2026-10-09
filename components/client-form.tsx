import { createClientAction, updateClientAction } from '@/actions/clients'
import { SubmitButton } from '@/components/submit-button'
import type { ClientRecord } from '@/types/database'

export function ClientForm({ client }: { client?: ClientRecord }) {
  const edit = Boolean(client)
  return (
    <form className="form-card" action={edit ? updateClientAction : createClientAction}>
      {edit && <input type="hidden" name="id" value={client?.id} />}
      {edit && <input type="hidden" name="return_to" value={`/clientes/${client?.id}/editar`} />}
      <div className="form-section-heading"><div><span className="eyebrow">Cadastro</span><h2>{edit ? 'Editar cliente' : 'Novo cliente'}</h2></div><p>Guarde apenas dados necessários para a operação.</p></div>
      <div className="form-grid">
        <label className="field field-span-2"><span>Nome *</span><input name="name" required minLength={2} maxLength={120} defaultValue={client?.name || ''} autoComplete="name" /></label>
        <label className="field"><span>Empresa</span><input name="company" maxLength={160} defaultValue={client?.company || ''} autoComplete="organization" /></label>
        <label className="field"><span>Status</span><select name="status" defaultValue={client?.status || 'CLIENTE'}><option value="LEAD">Lead</option><option value="NEGOCIACAO">Negociação</option><option value="CLIENTE">Cliente</option><option value="INATIVO">Inativo</option></select></label>
        <label className="field"><span>WhatsApp</span><input name="whatsapp" maxLength={30} defaultValue={client?.whatsapp || ''} inputMode="tel" /></label>
        <label className="field"><span>Telefone</span><input name="phone" maxLength={30} defaultValue={client?.phone || ''} inputMode="tel" autoComplete="tel" /></label>
        <label className="field field-span-2"><span>E-mail</span><input name="email" type="email" maxLength={180} defaultValue={client?.email || ''} autoComplete="email" /></label>
        <label className="field"><span>Instagram</span><input name="instagram" maxLength={120} defaultValue={client?.instagram || ''} placeholder="@empresa" /></label>
        <label className="field"><span>Documento (opcional)</span><input name="document" maxLength={30} defaultValue={client?.document || ''} autoComplete="off" /></label>
        <label className="field"><span>Cidade</span><input name="city" maxLength={120} defaultValue={client?.city || ''} autoComplete="address-level2" /></label>
        <label className="field"><span>UF</span><input name="state" maxLength={2} defaultValue={client?.state || ''} autoComplete="address-level1" placeholder="ES" /></label>
        <label className="field field-span-2"><span>Observações</span><textarea name="notes" maxLength={2000} rows={5} defaultValue={client?.notes || ''} /></label>
      </div>
      <div className="form-actions"><a className="button button-ghost" href={client ? `/clientes/${client.id}` : '/clientes'}>Cancelar</a><SubmitButton>{edit ? 'Salvar alterações' : 'Criar cliente'}</SubmitButton></div>
    </form>
  )
}
