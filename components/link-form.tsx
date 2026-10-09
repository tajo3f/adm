import { createDynamicLinkAction, updateDynamicLinkAction } from '@/actions/links'
import { SubmitButton } from '@/components/submit-button'
import type { DynamicLinkRecord } from '@/types/database'

export type ClientOption = { id: string; name: string; company: string | null }

export function LinkForm({ clients, link, selectedClientId }: { clients: ClientOption[]; link?: DynamicLinkRecord; selectedClientId?: string }) {
  const edit = Boolean(link)
  return (
    <form className="form-card" action={edit ? updateDynamicLinkAction : createDynamicLinkAction}>
      {edit && <input type="hidden" name="id" value={link?.id} />}
      {edit && <input type="hidden" name="return_to" value={`/links/${link?.id}/editar`} />}
      <div className="form-section-heading"><div><span className="eyebrow">Redirecionamento</span><h2>{edit ? 'Editar destino' : 'Novo link dinâmico'}</h2></div><p>O QR usa a URL permanente da TAJO; você altera apenas o destino.</p></div>
      <div className="form-grid">
        <label className="field field-span-2"><span>Cliente *</span><select name="client_id" required disabled={edit} defaultValue={link?.client_id || selectedClientId || ''}><option value="" disabled>Selecione um cliente</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.company ? `${c.company} — ${c.name}` : c.name}</option>)}</select>{edit && <input type="hidden" name="client_id" value={link?.client_id} />}</label>
        <label className="field"><span>Tipo de destino</span><select name="destination_type" defaultValue={link?.destination_type || 'google'}><option value="google">Google Avaliações</option><option value="whatsapp">WhatsApp</option><option value="instagram">Instagram</option><option value="site">Site</option><option value="cardapio">Cardápio</option><option value="catalogo">Catálogo</option><option value="localizacao">Localização</option><option value="formulario">Formulário</option><option value="outro">Outro</option></select></label>
        <label className="field field-checkbox"><span>Status</span><span className="checkbox-row"><input name="active" type="checkbox" defaultChecked={link?.active ?? true} /> Link ativo</span></label>
        <label className="field field-span-2"><span>URL de destino *</span><input name="destination_url" type="url" required maxLength={2000} defaultValue={link?.destination_url || ''} placeholder="https://..." inputMode="url" /></label>
        <label className="field field-span-2"><span>Observações internas</span><textarea name="notes" maxLength={2000} rows={5} defaultValue={link?.notes || ''} /></label>
      </div>
      <div className="security-note"><strong>Proteção contra redirecionamento malicioso</strong><span>Somente endereços HTTP/HTTPS válidos são aceitos. Protocolos como javascript:, data: e file: são bloqueados.</span></div>
      <div className="form-actions"><a className="button button-ghost" href={link ? `/links/${link.id}` : '/links'}>Cancelar</a><SubmitButton>{edit ? 'Salvar novo destino' : 'Criar link e QR'}</SubmitButton></div>
    </form>
  )
}
