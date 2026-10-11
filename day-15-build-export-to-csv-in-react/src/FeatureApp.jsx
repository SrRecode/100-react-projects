import { useMemo, useRef, useState } from 'react'
import './feature.css'

const initialColumns = ['Name', 'Email', 'Team']
const initialRows = [
  ['Avery Stone', 'avery@example.test', 'Design'],
  ['Morgan Bell', 'morgan@example.test', 'Research'],
  ['Riley James', 'riley@example.test', 'Engineering'],
]

function parseCsv(source) {
  const rows = []
  let row = []; let cell = ''; let quoted = false
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') { cell += '"'; index += 1 }
      else if (character === '"') quoted = false
      else cell += character
    } else if (character === '"' && !cell) quoted = true
    else if (character === ',') { row.push(cell); cell = '' }
    else if (character === '\n' || character === '\r') {
      if (character === '\r' && source[index + 1] === '\n') index += 1
      row.push(cell); rows.push(row); row = []; cell = ''
    } else cell += character
  }
  if (quoted) throw new Error('A quoted field is missing its closing quote.')
  row.push(cell)
  if (row.some((value) => value.length) || rows.length === 0) rows.push(row)
  return rows
}

function encodeCell(value) {
  let text = String(value ?? '')
  if (/^[\s]*[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

export default function FeatureApp() {
  const [columns, setColumns] = useState(initialColumns)
  const [rows, setRows] = useState(initialRows)
  const [notice, setNotice] = useState('')
  const fileInput = useRef(null)
  const csv = useMemo(() => [columns, ...rows].map((row) => columns.map((_, index) => encodeCell(row[index])).join(',')).join('\r\n'), [columns, rows])

  function updateCell(rowIndex, columnIndex, value) {
    setRows((current) => current.map((row, index) => index === rowIndex ? row.map((cell, cellIndex) => cellIndex === columnIndex ? value : cell) : row))
  }
  function importFile(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = parseCsv(String(reader.result).replace(/^\uFEFF/, ''))
        const [header, ...data] = parsed
        if (!header.length || header.some((name) => !name.trim())) throw new Error('Every column needs a heading.')
        setColumns(header.map((name) => name.trim()))
        setRows(data.filter((row) => row.some((cell) => cell.length)).map((row) => header.map((_, index) => row[index] || '')))
        setNotice(`${data.length} rows imported. Check the table before exporting.`)
      } catch (error) { setNotice(`Could not read CSV: ${error.message}`) }
    }
    reader.onerror = () => setNotice('The file could not be read.')
    reader.readAsText(file)
  }
  async function copyCsv() {
    try { await navigator.clipboard.writeText(csv); setNotice('CSV copied to the clipboard.') }
    catch { setNotice('Clipboard access is unavailable. Use Download CSV instead.') }
  }
  function downloadCsv() {
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'table-export.csv'; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('CSV downloaded. Spreadsheet formula-like values are escaped for safety.')
  }

  return (
    <main className="shell">
      <header><a href="#csv"><b>C</b> TABLE <em>TO CSV</em></a><span>DAY 15 / EXPORT STUDIO</span></header>
      <section className="hero" id="csv"><div><small>FROM A SIMPLE TABLE TO A PORTABLE FILE</small><h1>Your rows, ready to travel.</h1><p>Edit a small data table, import an existing CSV, and export a spreadsheet-friendly file.</p></div><b className="number">15</b></section>
      <section className="csv-toolbar"><div><small>TABLE PREVIEW</small><b>{rows.length} rows · {columns.length} columns</b></div><label className="soft import-label" onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.current?.click() } }} tabIndex="0">Import CSV<input accept=".csv,text/csv" hidden onChange={(event) => importFile(event.target.files[0])} onClick={(event) => event.stopPropagation()} ref={fileInput} type="file" /></label><div className="row"><button className="soft" onClick={copyCsv} type="button">Copy CSV</button><button className="primary" onClick={downloadCsv} type="button">Download .csv ↓</button></div></section>
      <div className="csv-table-wrap"><table className="csv-table"><thead><tr>{columns.map((column, index) => <th key={index}><label className="sr" htmlFor={`column-${index}`}>Column {index + 1} name</label><input id={`column-${index}`} onChange={(event) => setColumns((current) => current.map((name, i) => i === index ? event.target.value : name))} value={column} /></th>)}<th>Row</th></tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{columns.map((_, columnIndex) => <td key={columnIndex}><label className="sr" htmlFor={`cell-${rowIndex}-${columnIndex}`}>Row {rowIndex + 1}, column {columnIndex + 1}</label><input id={`cell-${rowIndex}-${columnIndex}`} onChange={(event) => updateCell(rowIndex, columnIndex, event.target.value)} value={row[columnIndex] || ''} /></td>)}<td><button aria-label={`Delete row ${rowIndex + 1}`} className="task-delete" onClick={() => setRows((current) => current.filter((_, index) => index !== rowIndex))} type="button">×</button></td></tr>)}</tbody></table></div>
      <div className="between csv-actions"><div className="row"><button className="soft" onClick={() => setColumns((current) => [...current, `Field ${current.length + 1}`])} type="button">Add column +</button><button className="soft" onClick={() => setRows((current) => [...current, Array(columns.length).fill('')])} type="button">Add row +</button></div><span aria-live="polite">{notice || 'Fields are quoted; embedded quotes are escaped.'}</span></div>
      <details className="csv-source"><summary>Preview the CSV text</summary><pre>{csv}</pre></details>
      <p className="helper">For spreadsheet safety, values beginning with =, +, -, or @ are prefixed before export.</p>
    </main>
  )
}
