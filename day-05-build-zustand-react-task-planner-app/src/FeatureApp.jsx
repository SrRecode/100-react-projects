import { useEffect, useMemo, useState } from 'react'
import './feature.css'

const STORAGE_KEY = 'daybook:task-planner:v1'
const blankTask = { title: '', priority: 'Normal', due: '' }

function readTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.filter((task) => typeof task.id === 'string' && typeof task.title === 'string') : []
  } catch { return [] }
}

export default function FeatureApp() {
  const [tasks, setTasks] = useState(readTasks)
  const [draft, setDraft] = useState(blankTask)
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [storageWarning, setStorageWarning] = useState('')
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); setStorageWarning('') }
    catch { setStorageWarning('Browser storage is full or unavailable. Export a backup before leaving this page.') }
  }, [tasks])
  const visibleTasks = useMemo(() => tasks.filter((task) => (
    (filter === 'All' || (filter === 'Done' ? task.done : !task.done))
    && task.title.toLowerCase().includes(query.toLowerCase())
  )), [filter, query, tasks])
  const completed = tasks.filter((task) => task.done).length

  function addTask(event) {
    event.preventDefault()
    if (!draft.title.trim()) { setNotice('Give your task a name first.'); return }
    setTasks((current) => [{ ...draft, id: crypto.randomUUID(), title: draft.title.trim(), done: false }, ...current])
    setDraft(blankTask)
    setNotice('Task added to your plan.')
  }

  function updateTask(id, changes) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...changes } : task))
  }

  function exportPlan() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'task-plan.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setNotice('Your task plan was exported.')
  }

  return (
    <main className="shell">
      <header><a href="#planner"><b>P</b> DAY <em>PLANNER</em></a><span>DAY 05 / PLAN WITH INTENTION</span></header>
      <section className="hero" id="planner"><div><small>YOUR NEXT CLEAR STEP</small><h1>Make room for the important.</h1><p>A focused task planner with priorities, due dates, a progress pulse, and local-first persistence.</p></div><b className="number">05</b></section>
      <div className="planner-stats"><div><small>IN YOUR PLAN</small><strong>{tasks.length}</strong><span>tasks</span></div><div><small>ALREADY DONE</small><strong>{completed}</strong><span>of {tasks.length}</span></div><div className="planner-progress"><div className="planner-progress-track"><i style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }} /></div><span>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}% progress</span></div></div>
      <section className="planner-grid">
        <article className="planner-compose"><small>CAPTURE A TASK</small><form onSubmit={addTask}><label>What needs doing?<input autoComplete="off" maxLength="120" onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Write the next small step…" value={draft.title} /></label><div className="planner-form-row"><label>Priority<select onChange={(event) => setDraft({ ...draft, priority: event.target.value })} value={draft.priority}><option>Low</option><option>Normal</option><option>High</option></select></label><label>Due date<input onChange={(event) => setDraft({ ...draft, due: event.target.value })} type="date" value={draft.due} /></label></div><button className="primary" type="submit">Add to plan +</button></form><button className="export-button" onClick={exportPlan} type="button">Export a JSON backup ↗</button></article>
        <article className="planner-list"><div className="between"><h2>Your plan</h2><span>{visibleTasks.length} SHOWN</span></div><div className="planner-controls"><input aria-label="Search tasks" onChange={(event) => setQuery(event.target.value)} placeholder="Find a task…" value={query} /><div className="planner-filters" role="group" aria-label="Filter tasks">{['All', 'Open', 'Done'].map((item) => <button aria-pressed={filter === item} className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)} type="button">{item}</button>)}</div></div>
          {visibleTasks.length ? <ul className="task-list">{visibleTasks.map((task) => <li className={task.done ? 'task-done' : ''} key={task.id}><button aria-label={task.done ? 'Reopen task' : 'Complete task'} aria-pressed={task.done} className="task-check" onClick={() => updateTask(task.id, { done: !task.done })} type="button">{task.done ? '✓' : ''}</button><div className="task-copy"><span>{task.title}</span><small>{task.due ? `Due ${task.due}` : 'No due date'} · {task.priority} priority</small></div><button aria-label={`Delete ${task.title}`} className="task-delete" onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))} type="button">×</button></li>)}</ul> : <div className="finder-empty"><h2>{tasks.length ? 'No matching tasks.' : 'A clean slate.'}</h2><p>{tasks.length ? 'Try another filter or search.' : 'Add a task when you are ready.'}</p></div>}
        </article>
      </section>
      <p aria-live="polite" className="helper planner-notice">{storageWarning || notice || 'Your plan is stored only in this browser.'}</p>
    </main>
  )
}
