type ToolIdentity = { name: string; url?: string }

export function normalizeToolName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function normalizeToolUrl(value = ''): string {
  if (!value.trim()) return ''

  try {
    const url = new URL(value)
    const path = url.pathname.replace(/\/+$/, '')
    return `${url.hostname.toLowerCase().replace(/^www\./, '')}${path}`
  } catch {
    return value.trim().toLowerCase().replace(/\/+$/, '')
  }
}

export function isSameTool(a: ToolIdentity, b: ToolIdentity): boolean {
  const aUrl = normalizeToolUrl(a.url)
  const bUrl = normalizeToolUrl(b.url)

  return normalizeToolName(a.name) === normalizeToolName(b.name) || (!!aUrl && aUrl === bUrl)
}
