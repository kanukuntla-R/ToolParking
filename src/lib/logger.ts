const isDev = process.env.NODE_ENV !== 'production'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const COLORS: Record<LogLevel, string> = {
  info:  '#22c55e',
  warn:  '#f59e0b',
  error: '#ef4444',
  debug: '#64748b',
}

function log(level: LogLevel, tag: string, msg: string, data?: unknown) {
  if (!isDev) return
  const ts = new Date().toLocaleTimeString('en-US', { hour12: false })
  const style = `color:${COLORS[level]};font-weight:bold`
  if (data !== undefined) {
    console.log(`%c[${ts}]%c [${tag}] ${msg}`, style, 'color:inherit', data)
  } else {
    console.log(`%c[${ts}]%c [${tag}] ${msg}`, style, 'color:inherit')
  }
}

export const logger = {
  info:  (tag: string, msg: string, data?: unknown) => log('info',  tag, msg, data),
  warn:  (tag: string, msg: string, data?: unknown) => log('warn',  tag, msg, data),
  error: (tag: string, msg: string, data?: unknown) => log('error', tag, msg, data),
  debug: (tag: string, msg: string, data?: unknown) => log('debug', tag, msg, data),
}
