'use client'
import { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Code, Link, Quote, CheckSquare, Download, Eye, Edit3, Minimize2, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (value: string) => void
  projectName: string
  tools: Array<{ name: string; category: string; lane?: string }>
}

type ViewMode = 'split' | 'edit' | 'preview'

export default function MarkdownEditor({ value, onChange, projectName, tools }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function insertText(before: string, after: string = '') {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end)
    onChange(newValue)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length)
    }, 0)
  }

  function insertLine(prefix: string) {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart)
    onChange(newValue)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length)
    }, 0)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault()
      insertText('  ')
    }
  }

  function handleDownload() {
    const toolsList = tools.map((t) => `- **${t.name}** (${t.category || 'other'}${t.lane ? ` — ${t.lane}` : ''})`).join('\n')
    const content = `# ${projectName}\n\n## Tech Stack\n\n${toolsList || '_No tools added yet_'}\n\n## Notes\n\n${value || '_No notes yet_'}\n`
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Simple markdown to HTML for preview
  function renderMarkdown(md: string): string {
    let html = md
      // Code blocks
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="md-code-block"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
      // Bold & Italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Strikethrough
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>')
      // Blockquotes
      .replace(/^&gt; (.+)$/gm, '<blockquote class="md-quote">$1</blockquote>')
      // Checklists
      .replace(/^- \[x\] (.+)$/gm, '<div class="md-checklist checked">☑ $1</div>')
      .replace(/^- \[ \] (.+)$/gm, '<div class="md-checklist">☐ $1</div>')
      // Unordered lists
      .replace(/^- (.+)$/gm, '<li class="md-li">$1</li>')
      .replace(/^\* (.+)$/gm, '<li class="md-li">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li class="md-li-ordered">$1</li>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="md-hr" />')
      // Line breaks
      .replace(/\n/g, '<br />')

    return html
  }

  const toolbarButtons = [
    { icon: Heading1, action: () => insertLine('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertLine('## '), title: 'Heading 2' },
    { icon: Heading3, action: () => insertLine('### '), title: 'Heading 3' },
    { icon: Bold, action: () => insertText('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), title: 'Italic' },
    { icon: Code, action: () => insertText('`', '`'), title: 'Inline Code' },
    { icon: Link, action: () => insertText('[', '](url)'), title: 'Link' },
    { icon: List, action: () => insertLine('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertLine('1. '), title: 'Numbered List' },
    { icon: CheckSquare, action: () => insertLine('- [ ] '), title: 'Task List' },
    { icon: Quote, action: () => insertLine('> '), title: 'Quote' },
  ]

  return (
    <div className="flex flex-col h-full bg-surface-100/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04] bg-surface-100/80 shrink-0">
        <div className="flex items-center gap-0.5">
          {toolbarButtons.map(({ icon: Icon, action, title }, i) => (
            <button
              key={i}
              onClick={action}
              title={title}
              className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-200 hover:bg-surface-300 transition-all"
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {/* View mode toggles */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-surface-200 border border-white/[0.04] mr-2">
            <button
              onClick={() => setViewMode('edit')}
              className={cn('p-1.5 rounded-md transition-all', viewMode === 'edit' ? 'bg-surface-300 text-white' : 'text-neutral-500 hover:text-neutral-300')}
              title="Edit only"
            >
              <Edit3 size={12} />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={cn('p-1.5 rounded-md transition-all', viewMode === 'split' ? 'bg-surface-300 text-white' : 'text-neutral-500 hover:text-neutral-300')}
              title="Split view"
            >
              <Minimize2 size={12} />
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={cn('p-1.5 rounded-md transition-all', viewMode === 'preview' ? 'bg-surface-300 text-white' : 'text-neutral-500 hover:text-neutral-300')}
              title="Preview only"
            >
              <Eye size={12} />
            </button>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent hover:bg-accent/10 transition-all"
          >
            <Download size={12} />
            Export
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={cn('flex flex-col', viewMode === 'split' ? 'w-1/2 border-r border-white/[0.04]' : 'w-full')}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Start writing... Use markdown syntax."
              spellCheck
              className="flex-1 w-full p-4 bg-transparent text-sm text-neutral-200 font-mono resize-none focus:outline-none placeholder:text-neutral-600 leading-relaxed"
              style={{ tabSize: 2 }}
            />
          </div>
        )}

        {/* Preview pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={cn('flex-1 overflow-y-auto scrollbar-thin', viewMode === 'split' ? 'w-1/2' : 'w-full')}>
            <div
              className="p-4 md-preview prose-sm"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-neutral-600 italic text-sm">Nothing to preview...</p>' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
