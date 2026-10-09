const messages: Record<string, string> = {
  'cliente-criado': 'Cliente criado com sucesso.',
  'cliente-atualizado': 'Cliente atualizado.',
  'link-criado': 'Link dinâmico criado com sucesso.',
  'link-atualizado': 'Link atualizado. O mesmo QR continuará usando o novo destino.',
  'link-ativado': 'Link ativado.',
  'link-pausado': 'Link pausado.',
  'senha-alterada': 'Senha alterada com sucesso.',
  'sessao-encerrada': 'Sessão encerrada com segurança.',
}

const errors: Record<string, string> = {
  'credenciais': 'Não foi possível entrar. Confira as credenciais e tente novamente.',
  'sessao-expirada': 'Sua sessão expirou. Entre novamente.',
  'dados-invalidos': 'Revise os campos informados.',
  'nao-foi-possivel-salvar': 'Não foi possível salvar. Tente novamente.',
  'nao-foi-possivel-alterar': 'Não foi possível concluir a alteração.',
  'senha-invalida': 'Use uma senha forte e confirme corretamente.',
  'nao-foi-possivel': 'Não foi possível concluir a solicitação.',
  'sem-permissao': 'Seu perfil não possui permissão para essa ação.',
}

export function Flash({ success, error }: { success?: string; error?: string }) {
  if (!success && !error) return null
  const text = error ? errors[error] || 'Ocorreu um erro. Tente novamente.' : messages[success || ''] || 'Operação concluída.'
  return <div className={`flash ${error ? 'flash-error' : 'flash-success'}`} role="status">{text}</div>
}
