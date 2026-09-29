import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CONSOLE_ITEMS, GITHUB } from '../data/content'

export default function CommandConsole({ open, onOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const escRef = useRef(null)
  const triggerRef = useRef(null)

  const items = useMemo(
    () =>
      CONSOLE_ITEMS.filter((i) =>
        // keywords carry the names the placeholder promises ("trustrag",
        // "docuchat") so the suggested searches actually return something.
        `${i.title} ${i.sub} ${i.tag} ${i.keywords || ''}`.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [query]
  )

  const openPalette = useCallback(() => {
    triggerRef.current = document.activeElement
    onOpen()
  }, [onOpen])

  const closePalette = useCallback(() => {
    onClose()
    setQuery('')
    // Return focus to whatever opened the dialog — keyboard users land back
    // where they were instead of at the top of the document.
    triggerRef.current?.focus?.()
    triggerRef.current = null
  }, [onClose])

  // ⌘K / Ctrl-K toggles from anywhere, Escape closes.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) closePalette()
        else openPalette()
      } else if (open && e.key === 'Escape') {
        e.preventDefault()
        closePalette()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, openPalette, closePalette])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  // Filtering resets the highlight to the first visible row.
  useEffect(() => { setSelected(0) }, [query])

  // Park background landmarks outside the accessibility tree while the dialog
  // owns interaction. The Tab cycle below covers keyboards; `inert` covers
  // screen-reader browsing of the page behind the dialog.
  useEffect(() => {
    const landmarks = document.querySelectorAll('header, main, footer')
    landmarks.forEach((el) => { el.inert = open })
    return () => landmarks.forEach((el) => { el.inert = false })
  }, [open])

  const run = (item) => {
    if (!item) return
    if (item.target) {
      closePalette()
      document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth' })
    } else if (item.action === 'github') {
      window.open(GITHUB, '_blank', 'noopener')
      closePalette()
    }
  }

  const onDialogKey = (e) => {
    if (e.key === 'Tab') {
      // Two focusables live in this dialog: the input and ESC. Cycle explicitly
      // rather than letting focus escape behind the overlay.
      e.preventDefault()
      ;(document.activeElement === inputRef.current ? escRef : inputRef).current?.focus()
      return
    }
    if (!items.length) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const dir = e.key === 'ArrowDown' ? 1 : -1
      setSelected((i) => (i + dir + items.length) % items.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(items[selected])
    }
  }

  return (
    <div
      id="cmd-console-modal"
      className={`cmd-console-overlay${open ? ' active' : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Command Console"
      onClick={(e) => { if (e.target === e.currentTarget) closePalette() }}
    >
      <div className="cmd-console-modal" onKeyDown={onDialogKey}>
        <div className="cmd-console-header">
          <span className="cmd-prompt">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="cmd-console-input"
            placeholder="Type a command or jump to section (e.g., 'trustrag', 'docuchat', 'workbench')..."
            autoComplete="off"
            spellCheck="false"
            aria-label="Command console input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button ref={escRef} type="button" className="tbtn" onClick={closePalette} aria-label="Close Console">ESC</button>
        </div>
        <ul className="cmd-console-list">
          {!items.length && <li className="cmd-console-empty">no command matches &ldquo;{query}&rdquo;</li>}
          {items.map((item, i) => (
            <li
              key={item.tag}
              className={`cmd-console-item${i === selected ? ' selected' : ''}`}
              onClick={() => run(item)}
            >
              <span className="cmd-item-main">
                <span className={`cmd-glyph${item.glyphTone ? ` cmd-glyph--${item.glyphTone}` : ''}`}>{item.glyph}</span>
                <span className="cmd-item-body">
                  <span className="cmd-item-title">{item.title}</span>
                  <span className="cmd-item-sub">{item.sub}</span>
                </span>
              </span>
              <span className={`cmd-tag${item.tagTone ? ` cmd-tag--${item.tagTone}` : ''}`}>{item.tag}</span>
            </li>
          ))}
        </ul>
        <div className="cmd-console-footer">
          <span><kbd className="cmd-kbd">ESC</kbd> to close</span>
          <span><kbd className="cmd-kbd">↑↓</kbd> navigate <kbd className="cmd-kbd">↵</kbd> to select</span>
        </div>
      </div>
    </div>
  )
}
