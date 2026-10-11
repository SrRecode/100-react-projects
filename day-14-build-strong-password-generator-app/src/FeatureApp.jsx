import { useState } from 'react'
import './feature.css'

const groups = [
  { id: 'lower', label: 'Lowercase letters', chars: 'abcdefghijklmnopqrstuvwxyz' },
  { id: 'upper', label: 'Uppercase letters', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { id: 'numbers', label: 'Numbers', chars: '0123456789' },
  { id: 'symbols', label: 'Symbols', chars: '!@#$%^&*()-_=+[]{}:,.?' },
]
const ambiguous = new Set('Il1O0')

function secureIndex(max) {
  const limit = Math.floor(256 / max) * max
  const buffer = new Uint8Array(1)
  do { crypto.getRandomValues(buffer) } while (buffer[0] >= limit)
  return buffer[0] % max
}

function secureShuffle(values) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const target = secureIndex(index + 1)
    ;[values[index], values[target]] = [values[target], values[index]]
  }
  return values
}

export default function FeatureApp() {
  const [length, setLength] = useState(20)
  const [selected, setSelected] = useState(['lower', 'upper', 'numbers', 'symbols'])
  const [exclude, setExclude] = useState(true)
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const activeGroups = groups.filter((group) => selected.includes(group.id))

  function generate() {
    if (!activeGroups.length) { setNotice('Choose at least one character group.'); return }
    const charSets = activeGroups.map(({ chars }) => exclude ? [...chars].filter((character) => !ambiguous.has(character)).join('') : chars)
    if (charSets.some((set) => !set.length)) { setNotice('This selection has no available characters.'); return }
    try {
      const pool = charSets.join('')
      const chars = charSets.map((set) => set[secureIndex(set.length)])
      while (chars.length < Number(length)) chars.push(pool[secureIndex(pool.length)])
      setPassword(secureShuffle(chars).join(''))
      setNotice('Generated locally with the browser cryptography API. The password is not stored.')
    } catch {
      setPassword('')
      setNotice('Secure randomness is unavailable. Open this app in a secure browser context to generate a password.')
    }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(password); setNotice('Password copied. Clear your clipboard when you no longer need it.') }
    catch { setNotice('Clipboard access is unavailable. Select the password to copy it manually.') }
  }

  const poolSize = activeGroups.reduce((total, group) => total + (exclude ? [...group.chars].filter((character) => !ambiguous.has(character)).length : group.chars.length), 0)
  const entropy = password ? Math.floor(Number(length) * Math.log2(poolSize || 1)) : 0
  const strength = entropy < 50 ? 'Good for low-risk accounts' : entropy < 80 ? 'Strong' : 'Very strong'

  return (
    <main className="shell">
      <header><a href="#password"><b>K</b> KEY <em>CRAFT</em></a><span>DAY 14 / NO PASSWORDS ARE SAVED</span></header>
      <section className="hero" id="password"><div><small>LONG, RANDOM, AND MADE RIGHT HERE</small><h1>A stronger secret, in a second.</h1><p>Build a unique password with the browser’s cryptographically secure random number generator.</p></div><b className="number">14</b></section>
      <section className="password-panel">
        <article className="password-settings"><small>CHARACTER MIX</small><div className="character-options">{groups.map((group) => <label key={group.id}><input checked={selected.includes(group.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, group.id] : current.filter((id) => id !== group.id))} type="checkbox" /><span>{group.label}</span><code>{group.chars.slice(0, 12)}{group.chars.length > 12 ? '…' : ''}</code></label>)}</div><label className="length-control">Password length <strong>{length}</strong><input max="64" min="8" onChange={(event) => setLength(Number(event.target.value))} type="range" value={length} /><span><small>8 characters</small><small>64 characters</small></span></label><label className="ratio-toggle"><input checked={exclude} onChange={(event) => setExclude(event.target.checked)} type="checkbox" /><span>Skip look-alike characters (I, l, 1, O, 0)</span></label><button className="primary" onClick={generate} type="button">Generate a password ↻</button></article>
        <article className="password-output"><small>YOUR PASSWORD</small><div className="password-display" aria-live="polite">{password || '••••••••••••••••'}</div><div className="between password-feedback"><span><i className={entropy >= 80 ? 'strength-strong' : ''} />{password ? strength : 'Ready when you are'}</span><span>{password ? `${entropy} estimated bits` : `${poolSize} possible characters`}</span></div><div className="row"><button className="soft" disabled={!password} onClick={copy} type="button">Copy password</button><button className="soft" onClick={generate} type="button">Make another</button></div><p aria-live="polite" className="helper">{notice || 'Use a password manager and avoid reusing passwords between accounts.'}</p></article>
      </section>
    </main>
  )
}
