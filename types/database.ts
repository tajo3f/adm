export type ClientStatus = 'LEAD' | 'NEGOCIACAO' | 'CLIENTE' | 'INATIVO'
export type DestinationType = 'google' | 'whatsapp' | 'instagram' | 'site' | 'cardapio' | 'catalogo' | 'localizacao' | 'formulario' | 'outro'

export type ClientRecord = {
  id: string
  name: string
  company: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  instagram: string | null
  city: string | null
  state: string | null
  document: string | null
  notes: string | null
  status: ClientStatus
  created_at: string
  updated_at: string
}

export type DynamicLinkRecord = {
  id: string
  internal_code: string
  public_code: string
  client_id: string
  destination_type: DestinationType
  destination_url: string
  active: boolean
  access_count: number
  last_access_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  clients?: { name: string; company: string | null } | null
}
