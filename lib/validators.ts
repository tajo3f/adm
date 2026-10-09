import { z } from 'zod'

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''))

export const loginSchema = z.object({
  email: z.string().trim().email().max(180),
  password: z.string().min(8).max(200),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(12, 'Use pelo menos 12 caracteres').max(200),
    confirm_password: z.string().max(200),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  })

export const clientSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: optionalText(160),
  phone: optionalText(30),
  whatsapp: optionalText(30),
  email: z.string().trim().email().max(180).optional().or(z.literal('')),
  instagram: optionalText(120),
  city: optionalText(120),
  state: z.string().trim().regex(/^$|^[A-Za-z]{2}$/).optional().or(z.literal('')),
  document: optionalText(30),
  notes: optionalText(2000),
  status: z.enum(['LEAD', 'NEGOCIACAO', 'CLIENTE', 'INATIVO']),
})

export const destinationTypeSchema = z.enum([
  'google',
  'whatsapp',
  'instagram',
  'site',
  'cardapio',
  'catalogo',
  'localizacao',
  'formulario',
  'outro',
])

export const dynamicLinkSchema = z.object({
  client_id: z.string().uuid(),
  destination_type: destinationTypeSchema,
  destination_url: z
    .string()
    .trim()
    .url()
    .max(2000)
    .refine((v) => /^https?:\/\//i.test(v), 'Use somente URLs http/https'),
  notes: optionalText(2000),
  active: z.boolean().default(true),
})
