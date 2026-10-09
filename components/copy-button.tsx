 'use client'

import { useState } from 'react'
import { CopyIcon } from '@/components/icons'

export function CopyButton({ value, label = 'Copiar link' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button className="button button-secondary" type="button" onClick={copy}>
      <CopyIcon width={17} height={17} />
      {copied ? 'Copiado' : label}
    </button>
  )
}
