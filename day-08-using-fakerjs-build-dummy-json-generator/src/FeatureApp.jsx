import { useMemo, useState } from 'react'
import './feature.css'

const defaults = [
  { name: 'id', type: 'id' },
  { name: 'fullName', type: 'name' },
  { name: 'email', type: 'email' },
  { name: 'company', type: 'company' },
  { name: 'active', type: 'boolean' },
]
const names = ['Alex Morgan', 'Samira Khan', 'Jordan Lee', 'Robin Patel', 'Casey Rivera', 'Taylor Okafor', 'Mina Chen', 'Emery Brooks']
const companies = ['Northstar Works', 'Fieldnote Studio', 'Brightline Labs', 'Goodday Supply', 'Common Ground']
const domains = ['example.com', 'sample.test', 'mail.example']

function makeValue(type, index) {
  switch (type) {
    case 'id': return crypto.randomUUID()
    case 'name': return names[Math.floor(Math.random() * names.length)]
    case 'email': return `${names[index % names.length].toLowerCase().replace(' ', '.')}${index + 1}@${domains[index % domains.length]}`
    case 'company': return companies[Math.floor(Math.random() * companies.length)]
    case 'boolean': return Math.random() >= 0.5
    case 'number': return Math.floor(Math.random() * 9000) + 100
    case 'date': return new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10)
    case 'status': return ['active', 'pending', 'archived'][Math.floor(Math.random() * 3)]
    default: return `Sample ${index + 1}`
  }
}

export default function FeatureApp() {
  const [schema, setSchema] = useState(defaults)
  const [count, setCount] = useState(8)
  const [records, setRecords] = useState([])
  const [notice, setNotice] = useState('')
  const json = useMemo(() => JSON.stringify(records, null, 2), [records])

  function updateField(index, changes) { setSchema((current) => current.map((field, i) => i === index ? { ...field, ...changes } : field)) }
  function addField() { setSchema((current) => [...current, { name: `field${current.length + 1}`, type: 'text' }]) }
  function generate() {
    const fields = schema.filter((field) => /^[A-Za-z_$][\w$]*$/.test(field.name.trim()))
    if (!fields.length) { setNotice('Add at least one field with a valid JavaScript property name.'); return }
    setRecords(Array.from({ length: Number(count) }, (_, index) => Object.fromEntries(fields.map((field) => [field.name.trim(), makeValue(field.type, index)]))))
    setNotice(`${count} sample records generated locally.`)
  }

  async function copyJson() {
    try { await navigator.clipboard.writeText(json); setNotice('JSON copied to the clipboard.') }
    catch { setNotice('Clipboard access is unavailable. Select the output and copy it manually.') }
  }

  function downloadJson() {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'sample-records.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="shell">
      <header><a href="#json-maker"><b>J</b> SAMPLE <em>FOUNDRY</em></a><span>DAY 08 / STRUCTURED MOCK DATA</span></header>
      <section className="hero" id="json-maker"><div><small>REALISTIC ENOUGH TO BUILD WITH</small><h1>Good test data starts here.</h1><p>Choose a small schema, set the record count, and create useful sample JSON in your browser.</p></div><b className="number">08</b></section>
      <section className="json-grid">
        <article className="json-schema"><div className="between"><h2>Shape your records</h2><span className="ready">{schema.length} FIELDS</span></div>
          <div className="schema-list">{schema.map((field, index) => <div className="schema-row" key={index}><label className="sr" htmlFor={`field-name-${index}`}>Field {index + 1} name</label><input id={`field-name-${index}`} onChange={(event) => updateField(index, { name: event.target.value })} value={field.name} /><label className="sr" htmlFor={`field-type-${index}`}>Field {index + 1} type</label><select id={`field-type-${index}`} onChange={(event) => updateField(index, { type: event.target.value })} value={field.type}>{['id', 'name', 'email', 'company', 'boolean', 'number', 'date', 'status', 'text'].map((type) => <option key={type}>{type}</option>)}</select><button aria-label={`Remove field ${field.name}`} className="task-delete" disabled={schema.length <= 1} onClick={() => setSchema((current) => current.filter((_, i) => i !== index))} type="button">×</button></div>)}</div>
          <button className="soft" onClick={addField} type="button">Add field +</button>
          <label className="record-count">Number of records<select onChange={(event) => setCount(event.target.value)} value={count}>{[1, 5, 8, 10, 20, 50].map((value) => <option key={value}>{value}</option>)}</select></label>
          <button className="primary" onClick={generate} type="button">Generate sample data</button>
          <p className="helper">Contains synthetic examples only. Do not use real personal data for test fixtures.</p>
        </article>
        <article className="json-output"><div className="between"><h2>Generated JSON</h2><div className="row"><button className="soft" disabled={!records.length} onClick={copyJson} type="button">Copy</button><button className="soft" disabled={!records.length} onClick={downloadJson} type="button">Download</button></div></div><pre aria-label="Generated JSON" className="json-code">{records.length ? json : '// Your sample records will appear here.'}</pre><p aria-live="polite" className="helper">{notice || `${records.length} records · ${schema.length} fields`}</p></article>
      </section>
    </main>
  )
}
