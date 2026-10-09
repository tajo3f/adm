import Link from 'next/link'
import { DashboardIcon, LinkIcon, ShieldIcon, UsersIcon } from '@/components/icons'
import type { Profile } from '@/lib/auth'

const nav = [
  { href: '/dashboard', label: 'Visão Geral', icon: DashboardIcon },
  { href: '/clientes', label: 'Clientes', icon: UsersIcon },
  { href: '/links', label: 'Links & QR', icon: LinkIcon },
  { href: '/seguranca', label: 'Segurança', icon: ShieldIcon },
]

export function AppShell({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  const initials = (profile.full_name || profile.email || 'TAJO').split(/\s+/).filter(Boolean).slice(0, 2).map((v) => v[0]?.toUpperCase()).join('')
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/dashboard" aria-label="TAJO ADMIN - início">
          <img src="/tajo-logo.png" alt="TAJO Digital 3F" />
          <div><strong>TAJO ADMIN</strong><span>Área Administrativa</span></div>
        </Link>
        <nav className="side-nav" aria-label="Navegação principal">
          {nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href}><Icon />{label}</Link>)}
        </nav>
        <div className="sidebar-footer">
          <span className="avatar">{initials || 'TA'}</span>
          <div className="user-meta"><strong>{profile.full_name || 'Administrador'}</strong><span>{profile.role.replace('_', ' ')}</span></div>
        </div>
      </aside>
      <div className="content-shell">
        <header className="topbar">
          <div><span className="eyebrow">TAJO DIGITAL 3F</span><strong>Controle interno seguro</strong></div>
          <Link className="profile-chip" href="/seguranca"><span className="avatar avatar-small">{initials || 'TA'}</span><span>{profile.full_name || profile.email}</span></Link>
        </header>
        <main className="main-content">{children}</main>
      </div>
      <nav className="mobile-nav" aria-label="Navegação móvel">
        {nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href}><Icon /><span>{label === 'Visão Geral' ? 'Início' : label === 'Segurança' ? 'Conta' : label}</span></Link>)}
      </nav>
    </div>
  )
}
