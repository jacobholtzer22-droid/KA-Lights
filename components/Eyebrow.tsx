export const eyebrowClass = 'font-body text-step--1 font-semibold uppercase tracking-[0.18em] text-muted'

export default function Eyebrow({ children, className = '' }: { children: string; className?: string }) {
  return <p className={`${eyebrowClass} ${className}`}>{children}</p>
}
