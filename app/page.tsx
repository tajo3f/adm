import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth'

export default async function Home() {
  const { user, profile } = await getAuthContext()
  if (user && profile?.is_active) redirect('/dashboard')
  redirect('/login')
}
