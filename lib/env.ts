const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'TAJO ADMIN: configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
  )
}

export const env = {
  supabaseUrl,
  supabasePublishableKey,
  publicRedirectBaseUrl: (process.env.PUBLIC_REDIRECT_BASE_URL || 'https://go.tajodigital.com.br').replace(/\/+$/, ''),
  adminBaseUrl: (process.env.ADMIN_BASE_URL || 'https://admin.tajodigital.com.br').replace(/\/+$/, ''),
}
