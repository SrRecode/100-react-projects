import { useEffect, useState } from 'react'
import './feature.css'

const KEY = 'day16-business-card:v1'
const themes = [
  { name: 'Forest', background: '#173d35', accent: '#d4e7bb', text: '#f5f4e9' },
  { name: 'Ink', background: '#222536', accent: '#e7b893', text: '#f7f2eb' },
  { name: 'Clay', background: '#a84f3b', accent: '#f5d7a1', text: '#fff6e9' },
]
const fallback = { name: 'Avery Morgan', title: 'Independent designer', email: 'hello@example.com', phone: '+1 (555) 014-0198', website: 'averymorgan.design', company: 'Goodground Studio' }

function readCard() {
  try { return { ...fallback, ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return fallback }
}

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character])
}

export default function FeatureApp() {
  const [card, setCard] = useState(readCard)
  const [theme, setTheme] = useState(0)
  const [notice, setNotice] = useState('')
  const colors = themes[theme]
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(card)); setNotice('Details saved on this device.') }
    catch { setNotice('Could not save details in this browser.') }
  }, [card])

  function update(key, value) { setCard((current) => ({ ...current, [key]: value })) }
  function downloadSvg() {
    const initials = card.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1050" height="600" viewBox="0 0 1050 600"><rect width="1050" height="600" rx="32" fill="${colors.background}"/><circle cx="100" cy="110" r="5" fill="${colors.accent}"/><text x="70" y="332" font-family="Georgia,serif" font-size="70" fill="${colors.text}">${escapeXml(card.name || 'Your name')}</text><text x="72" y="395" font-family="Arial,sans-serif" font-size="28" fill="${colors.accent}">${escapeXml(card.title)}</text><text x="72" y="468" font-family="Arial,sans-serif" font-size="22" fill="${colors.text}">${escapeXml(card.company)}</text><text x="978" y="120" text-anchor="end" font-family="Arial,sans-serif" font-size="20" fill="${colors.accent}">${escapeXml(card.email)}</text><text x="978" y="158" text-anchor="end" font-family="Arial,sans-serif" font-size="20" fill="${colors.text}">${escapeXml(card.phone)}</text><text x="978" y="196" text-anchor="end" font-family="Arial,sans-serif" font-size="20" fill="${colors.text}">${escapeXml(card.website)}</text><text x="978" y="530" text-anchor="end" font-family="Georgia,serif" font-size="56" fill="${colors.accent}">${escapeXml(initials)}</text></svg>`
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'business-card.svg'; anchor.click(); URL.revokeObjectURL(url)
    setNotice('Scalable card artwork downloaded as SVG.')
  }

  return (
    <main className="shell">
      <header><a href="#card-studio"><b>B</b> GOODGROUND <em>CARD STUDIO</em></a><span>DAY 16 / VISITING CARD DESIGNER</span></header>
      <section className="hero" id="card-studio"><div><small>THE FIRST IMPRESSION, IN YOUR HANDS</small><h1>A card that introduces you well.</h1><p>Shape a simple, print-ready visiting card. Your personal details stay in this browser.</p></div><b className="number">16</b></section>
      <section className="card-studio">
        <article className="card-controls"><small>YOUR DETAILS</small>{[['name', 'Name'], ['title', 'Role or specialty'], ['company', 'Studio or company'], ['email', 'Email'], ['phone', 'Phone'], ['website', 'Website']].map(([key, label]) => <label key={key}>{label}<input autoComplete={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'off'} maxLength="70" onChange={(event) => update(key, event.target.value)} placeholder={label} value={card[key]} /></label>)}<small>COLOR STORY</small><div className="card-themes">{themes.map((item, index) => <button aria-label={`${item.name} card theme`} aria-pressed={theme === index} key={item.name} onClick={() => setTheme(index)} style={{ backgroundColor: item.background, borderColor: theme === index ? item.accent : 'transparent' }}><span style={{ backgroundColor: item.accent }} />{item.name}</button>)}</div><button className="primary" onClick={downloadSvg} type="button">Download print-ready SVG ↓</button><button className="soft" onClick={() => window.print()} type="button">Print card</button></article>
        <article className="card-preview-area"><div className="between"><div><small>LIVE PROOF</small><h2>Front of card</h2></div><span className="ready">3.5 × 2 IN RATIO</span></div><svg aria-label={`Visiting card for ${card.name}`} className="business-card" role="img" viewBox="0 0 1050 600" xmlns="http://www.w3.org/2000/svg"><rect fill={colors.background} height="600" rx="32" width="1050" /><circle cx="100" cy="110" fill={colors.accent} r="5" /><text fill={colors.text} fontFamily="Georgia,serif" fontSize="70" x="70" y="332">{card.name || 'Your name'}</text><text fill={colors.accent} fontFamily="Arial,sans-serif" fontSize="28" x="72" y="395">{card.title}</text><text fill={colors.text} fontFamily="Arial,sans-serif" fontSize="22" x="72" y="468">{card.company}</text><text fill={colors.accent} fontFamily="Arial,sans-serif" fontSize="20" textAnchor="end" x="978" y="120">{card.email}</text><text fill={colors.text} fontFamily="Arial,sans-serif" fontSize="20" textAnchor="end" x="978" y="158">{card.phone}</text><text fill={colors.text} fontFamily="Arial,sans-serif" fontSize="20" textAnchor="end" x="978" y="196">{card.website}</text><text fill={colors.accent} fontFamily="Georgia,serif" fontSize="56" textAnchor="end" x="978" y="530">{card.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</text></svg><p className="helper">Vector SVG scales cleanly to print. Check the printer’s bleed and color requirements before production.</p><p aria-live="polite" className="helper">{notice}</p></article>
      </section>
    </main>
  )
}
