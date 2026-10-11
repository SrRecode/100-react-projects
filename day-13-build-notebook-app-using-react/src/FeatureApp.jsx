import { useEffect, useMemo, useState } from 'react'
import './feature.css'

const KEY = 'day13-pocket-notebook:v1'
function readNotes() {
  try {
    const notes = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (Array.isArray(notes)) return notes
      .filter((note) => note && typeof note.id === 'string' && typeof note.title === 'string' && typeof note.body === 'string')
      .map((note) => ({ ...note, pinned: note.pinned === true, updated: typeof note.updated === 'string' ? note.updated : new Date(0).toISOString() }))
  } catch { /* Start with a clean notebook when stored content is unreadable. */ }
  return []
}

export default function FeatureApp() {
  const [notes, setNotes] = useState(readNotes)
  const [activeId, setActiveId] = useState(() => readNotes()[0]?.id || '')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('Ready to write.')
  const active = notes.find((note) => note.id === activeId)
  const visibleNotes = useMemo(() => notes.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updated.localeCompare(a.updated)), [notes, query])

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(notes))
      setStatus('Saved on this device · just now')
    } catch { setStatus('Could not save to browser storage. Export a backup to keep your writing.') }
  }, [notes])

  function createNote() {
    const note = { id: crypto.randomUUID(), title: 'Untitled note', body: '', pinned: false, updated: new Date().toISOString() }
    setNotes((current) => [note, ...current])
    setActiveId(note.id)
  }
  function edit(changes) {
    if (!active) return
    setNotes((current) => current.map((note) => note.id === active.id ? { ...note, ...changes, updated: new Date().toISOString() } : note))
  }
  function exportNote() {
    if (!active) return
    const url = URL.createObjectURL(new Blob([`${active.title}\n${'='.repeat(Math.max(1, active.title.length))}\n\n${active.body}`], { type: 'text/markdown' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${active.title.trim().replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '') || 'note'}.md`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <main className="shell">
      <header><a href="#notebook"><b>N</b> POCKET <em>NOTEBOOK</em></a><span>DAY 13 / PRIVATE BY DEFAULT</span></header>
      <section className="hero" id="notebook"><div><small>COLLECT THE THOUGHTS YOU WANT TO KEEP</small><h1>A notebook with room to think.</h1><p>Write, find, pin, and export notes—saved to browser storage on this device.</p></div><b className="number">13</b></section>
      <section className="notebook">
        <aside className="note-sidebar"><div className="between"><small>YOUR NOTES · {notes.length}</small><button aria-label="Create a new note" className="note-add" onClick={createNote} type="button">+</button></div><label className="sr" htmlFor="note-search">Search notes</label><input id="note-search" onChange={(event) => setQuery(event.target.value)} placeholder="Search notes…" value={query} />
          <ul>{visibleNotes.map((note) => <li key={note.id}><button className={`note-link ${note.id === activeId ? 'selected' : ''}`} onClick={() => setActiveId(note.id)} type="button"><span>{note.pinned ? '📌 ' : ''}{note.title || 'Untitled note'}</span><small>{note.body.slice(0, 54) || 'A new page'}</small></button><button aria-label={`${note.pinned ? 'Unpin' : 'Pin'} ${note.title}`} className="pin-note" onClick={() => setNotes((current) => current.map((item) => item.id === note.id ? { ...item, pinned: !item.pinned } : item))} type="button">{note.pinned ? '●' : '○'}</button></li>)}</ul>
          {!notes.length && <p className="helper">Your pages will be collected here.</p>}
        </aside>
        <article className="note-editor">{active ? <><div className="between note-toolbar"><span aria-live="polite">{status}</span><div className="row"><button className="soft" onClick={exportNote} type="button">Export .md</button><button aria-label="Delete this note" className="soft" onClick={() => { setNotes((current) => current.filter((note) => note.id !== active.id)); setActiveId(notes.find((note) => note.id !== active.id)?.id || '') }} type="button">Delete</button></div></div><label className="sr" htmlFor="note-title">Note title</label><input className="note-title" id="note-title" maxLength="100" onChange={(event) => edit({ title: event.target.value })} placeholder="Untitled note" value={active.title} /><label className="sr" htmlFor="note-body">Note content</label><textarea className="note-body" id="note-body" onChange={(event) => edit({ body: event.target.value })} placeholder="Let this page hold the rough draft…" value={active.body} /><div className="between note-meta"><span>{active.body.trim().split(/\s+/).filter(Boolean).length} words</span><span>{active.body.length} characters</span></div></> : <div className="finder-empty"><h2>A blank page is a beginning.</h2><p>Create a note to start your notebook.</p><button className="primary" onClick={createNote} type="button">New note +</button></div>}</article>
      </section>
    </main>
  )
}
