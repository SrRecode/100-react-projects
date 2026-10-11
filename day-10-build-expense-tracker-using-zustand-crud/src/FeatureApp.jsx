import { useEffect, useMemo, useState } from 'react'
import './feature.css'

const KEY = 'day10-ledger:v1'
const categories = ['Food', 'Home', 'Travel', 'Health', 'Shopping', 'Other']
function localDate() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function readEntries() {
  try {
    const items = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(items) ? items.filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.date === 'string' && typeof item.category === 'string' && Number.isFinite(item.amount)) : []
  } catch { return [] }
}

export default function FeatureApp() {
  const [entries, setEntries] = useState(readEntries)
  const [draft, setDraft] = useState(() => ({ title: '', amount: '', category: 'Food', date: localDate() }))
  const [month, setMonth] = useState(() => localDate().slice(0, 7))
  const [filter, setFilter] = useState('All')
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => entries.filter((entry) => entry.date.startsWith(month) && (filter === 'All' || entry.category === filter)).sort((a, b) => b.date.localeCompare(a.date)), [entries, filter, month])
  const total = filtered.reduce((sum, entry) => sum + entry.amount, 0)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(entries)) } catch { setNotice('Storage is full or unavailable; export a backup before leaving.') } }, [entries])

  function add(event) {
    event.preventDefault()
    const amount = Number(draft.amount)
    if (!draft.title.trim() || !draft.date || !Number.isFinite(amount) || amount <= 0) { setNotice('Add a description, date, and amount greater than zero.'); return }
    setEntries((current) => [{ ...draft, id: crypto.randomUUID(), title: draft.title.trim(), amount }, ...current])
    setDraft({ ...draft, title: '', amount: '' })
    setNotice('Expense added to your ledger.')
  }

  function exportCsv() {
    const rows = [['Date', 'Description', 'Category', 'Amount'], ...filtered.map((entry) => [entry.date, entry.title, entry.category, entry.amount.toFixed(2)])]
    const csv = rows.map((row) => row.map((cell) => {
      let value = String(cell)
      if (/^[\s]*[=+\-@\t\r]/.test(value)) value = `'${value}`
      return `"${value.replaceAll('"', '""')}"`
    }).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `expenses-${month}.csv`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <main className="shell">
      <header><a href="#ledger"><b>L</b> FIELD <em>LEDGER</em></a><span>DAY 10 / PERSONAL EXPENSES</span></header>
      <section className="hero" id="ledger"><div><small>A CLEARER VIEW OF EVERYDAY SPENDING</small><h1>Know where the month went.</h1><p>Log an expense, scan your monthly totals, and keep a copy of your records on your device.</p></div><b className="number">10</b></section>
      <section className="ledger-summary"><div><small>THIS MONTH</small><label className="sr" htmlFor="ledger-month">Choose month</label><input id="ledger-month" onChange={(event) => setMonth(event.target.value)} type="month" value={month} /></div><div><small>SPENDING SHOWN</small><strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(total)}</strong><span>{filtered.length} expense{filtered.length === 1 ? '' : 's'}</span></div><button className="soft" disabled={!filtered.length} onClick={exportCsv} type="button">Export this month ↓</button></section>
      <section className="ledger-grid">
        <article className="ledger-add"><small>ADD AN EXPENSE</small><form onSubmit={add}><label>Description<input maxLength="80" onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Coffee with a friend" required value={draft.title} /></label><label>Amount (USD)<input min="0.01" onChange={(event) => setDraft({ ...draft, amount: event.target.value })} placeholder="0.00" required step="0.01" type="number" value={draft.amount} /></label><div className="planner-form-row"><label>Category<select onChange={(event) => setDraft({ ...draft, category: event.target.value })} value={draft.category}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Date<input onChange={(event) => setDraft({ ...draft, date: event.target.value })} required type="date" value={draft.date} /></label></div><button className="primary">Add expense +</button></form><p className="helper">Saved to local browser storage only. Export regular backups for your records.</p></article>
        <article className="ledger-list"><div className="between"><div><small>TRANSACTIONS</small><h2>Recent expenses</h2></div><label className="sr" htmlFor="expense-filter">Filter category</label><select id="expense-filter" onChange={(event) => setFilter(event.target.value)} value={filter}><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
          {filtered.length ? <ul>{filtered.map((entry) => <li key={entry.id}><span aria-hidden="true" className="expense-mark">{entry.category.slice(0, 1)}</span><div><b>{entry.title}</b><small>{entry.date} · {entry.category}</small></div><strong>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(entry.amount)}</strong><button aria-label={`Delete ${entry.title}`} className="task-delete" onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))} type="button">×</button></li>)}</ul> : <div className="finder-empty"><h2>No expenses for this view.</h2><p>Change the month or add your first expense.</p></div>}
        </article>
      </section>
      <p aria-live="polite" className="helper planner-notice">{notice || 'Tip: choose a month to review its records.'}</p>
    </main>
  )
}
