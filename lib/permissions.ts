import type { AppRole } from '@/lib/auth'

export const EDITOR_ROLES: AppRole[] = ['SUPER_ADMIN', 'ADMIN', 'COMERCIAL', 'OPERADOR']
export const ADMIN_ROLES: AppRole[] = ['SUPER_ADMIN', 'ADMIN']

export function canEditCore(role: AppRole) {
  return EDITOR_ROLES.includes(role)
}
