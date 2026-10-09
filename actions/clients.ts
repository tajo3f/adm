 'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { EDITOR_ROLES } from '@/lib/permissions'
import { clientSchema } from '@/lib/validators'
import { safeInternalPath } from '@/lib/utils'

function value(v: FormDataEntryValue | null) {
  return typeof v === 'string' ? v : ''
}

export async function createClientAction(formData: FormData) {
  const { supabase } = await requireRole(EDITOR_ROLES)
  const parsed = clientSchema.safeParse({
    name: value(formData.get('name')),
    company: value(formData.get('company')),
    phone: value(formData.get('phone')),
    whatsapp: value(formData.get('whatsapp')),
    email: value(formData.get('email')),
    instagram: value(formData.get('instagram')),
    city: value(formData.get('city')),
    state: value(formData.get('state')).toUpperCase(),
    document: value(formData.get('document')),
    notes: value(formData.get('notes')),
    status: value(formData.get('status')),
  })

  if (!parsed.success) redirect('/clientes/novo?error=dados-invalidos')

  const { data, error } = await supabase
    .from('clients')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error || !data) redirect('/clientes/novo?error=nao-foi-possivel-salvar')
  revalidatePath('/clientes')
  redirect(`/clientes/${data.id}?success=cliente-criado`)
}

export async function updateClientAction(formData: FormData) {
  const { supabase } = await requireRole(EDITOR_ROLES)
  const id = value(formData.get('id'))
  const returnTo = safeInternalPath(value(formData.get('return_to')), `/clientes/${id}`)

  const parsed = clientSchema.safeParse({
    name: value(formData.get('name')),
    company: value(formData.get('company')),
    phone: value(formData.get('phone')),
    whatsapp: value(formData.get('whatsapp')),
    email: value(formData.get('email')),
    instagram: value(formData.get('instagram')),
    city: value(formData.get('city')),
    state: value(formData.get('state')).toUpperCase(),
    document: value(formData.get('document')),
    notes: value(formData.get('notes')),
    status: value(formData.get('status')),
  })

  if (!id || !parsed.success) redirect(`${returnTo}?error=dados-invalidos`)

  const { error } = await supabase.from('clients').update(parsed.data).eq('id', id)
  if (error) redirect(`${returnTo}?error=nao-foi-possivel-salvar`)

  revalidatePath('/clientes')
  revalidatePath(`/clientes/${id}`)
  redirect(`/clientes/${id}?success=cliente-atualizado`)
}
