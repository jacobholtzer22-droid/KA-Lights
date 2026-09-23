import type { ReactNode } from 'react'

export default function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 md:pb-24 lg:px-8">
      <div className={`rounded-panel border border-line bg-surface p-8 shadow-site md:p-12 ${className}`}>{children}</div>
    </div>
  )
}
