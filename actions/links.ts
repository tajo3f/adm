 'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { EDITOR_ROLES } from '@/lib/permissions'
import { dynamicLinkSchema } from '@/lib/validators'
import { safeInternalPath } from '@/lib/utils'

function value(v: FormDataEntryValue | null) {
  return typeof v === 'string' ? v : ''
}

export async function createDynamicLinkAction(formData: FormData) {
  const { supabase } = await requireRole(EDITOR_ROLES)
  const parsed = dynamicLinkSchema.safeParse({
    client_id: value(formData.get('client_id')),
    destination_type: value(formData.get('destination_type')),
    destination_url: value(formData.get('destination_url')),
    notes: value(formData.get('notes')),
    active: formData.get('active') === 'on',
  })

  if (!parsed.success) redirect('/links/novo?error=dados-invalidos')

  const { data, error } = await supabase
    .from('dynamic_links')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error || !data) redirect('/links/novo?error=nao-foi-possivel-salvar')
  revalidatePath('/links')
  redirect(`/links/${data.id}?success=link-criado`)
}

export async function updateDynamicLinkAction(formData: FormData) {
  const { supabase } = await requireRole(EDITOR_ROLES)
  const id = value(formData.get('id'))
  const returnTo = safeInternalPath(value(formData.get('return_to')), `/links/${id}`)

  const parsed = dynamicLinkSchema.safeParse({
    client_id: value(formData.get('client_id')),
    destination_type: value(formData.get('destination_type')),
    destination_url: value(formData.get('destination_url')),
    notes: value(formData.get('notes')),
    active: formData.get('active') === 'on',
  })

  if (!id || !parsed.success) redirect(`${returnTo}?error=dados-invalidos`)

  const { error } = await supabase
    .from('dynamic_links')
    .update({
      destination_type: parsed.data.destination_type,
      destination_url: parsed.data.destination_url,
      notes: parsed.data.notes,
      active: parsed.data.active,
    })
    .eq('id', id)

  if (error) redirect(`${returnTo}?error=nao-foi-possivel-salvar`)
  revalidatePath('/links')
  revalidatePath(`/links/${id}`)
  redirect(`/links/${id}?success=link-atualizado`)
}

export async function toggleDynamicLinkAction(formData: FormData) {
  const { supabase } = await requireRole(EDITOR_ROLES)
  const id = value(formData.get('id'))
  const nextActive = value(formData.get('next_active')) === 'true'
  if (!id) redirect('/links?error=dados-invalidos')

  const { error } = await supabase.from('dynamic_links').update({ active: nextActive }).eq('id', id)
  if (error) redirect(`/links/${id}?error=nao-foi-possivel-alterar`)

  revalidatePath('/links')
  revalidatePath(`/links/${id}`)
  redirect(`/links/${id}?success=${nextActive ? 'link-ativado' : 'link-pausado'}`)
}
