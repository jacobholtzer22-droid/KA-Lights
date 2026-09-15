/** Renders `text` with one phrase wrapped for decorative emphasis. The words stay real text. */
export default function Highlight({ text, highlight, className = 'text-spectrum' }: { text: string; highlight: string | null; className?: string }) {
  const at = highlight ? text.indexOf(highlight) : -1
  if (!highlight || at === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <span className={className}>{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  )
}
