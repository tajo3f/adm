export function StatusBadge({ active, children }: { active?: boolean; children?: React.ReactNode }) {
  const text = children ?? (active ? 'Ativo' : 'Pausado')
  return <span className={`badge ${active ? 'badge-success' : 'badge-muted'}`}>{text}</span>
}
