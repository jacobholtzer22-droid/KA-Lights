export interface GateItem {
  rule: string
  where: string
  detail: string
}
export const MARKER: string
export function placeholderRows(markdown: string): { line: number; label: string }[]
export function inspectLaunchState(root?: string): { blockers: GateItem[]; errors: GateItem[] }
export function enforceLaunchGate(options?: {
  root?: string
  env?: Record<string, string | undefined>
  log?: Pick<Console, 'warn'>
}): { blockers: GateItem[]; errors: GateItem[]; preview: boolean }
