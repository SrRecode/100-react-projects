import { useMemo, useState } from 'react'
import './feature.css'

const palettes = [
  { name: 'Meadow', background: '#d9f2e5', skin: '#bd775c', hair: '#34241f', shirt: '#587f70' },
  { name: 'Apricot', background: '#ffead6', skin: '#e0a481', hair: '#593927', shirt: '#d2765d' },
  { name: 'Lilac', background: '#e8e1fa', skin: '#f0c5a6', hair: '#49394a', shirt: '#8170b1' },
  { name: 'Ocean', background: '#dcecf3', skin: '#81583f', hair: '#201f28', shirt: '#417b92' },
]

function download(content, name, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function FeatureApp() {
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [shape, setShape] = useState('Circle')
  const [expression, setExpression] = useState('Friendly')
  const [initial, setInitial] = useState('A')
  const [notice, setNotice] = useState('')
  const palette = palettes[paletteIndex]
  const avatar = useMemo(() => {
    const eyes = expression === 'Thoughtful'
      ? '<path d="M89 105h8m26 0h8"/>'
      : '<circle cx="93" cy="104" r="3.5"/><circle cx="127" cy="104" r="3.5"/>'
    const mouth = expression === 'Thoughtful' ? 'M103 126q7-3 14 0' : 'M101 123q9 11 18 0'
    return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 220 220"><rect width="220" height="220" rx="${shape === 'Rounded square' ? 34 : 110}" fill="${palette.background}"/><path d="M39 220c7-43 31-66 71-66s64 23 71 66" fill="${palette.shirt}"/><path d="M71 94c0-42 19-63 42-63s41 21 41 63v25H71z" fill="${palette.hair}"/><ellipse cx="110" cy="103" rx="39" ry="48" fill="${palette.skin}"/><path d="M70 88c3-44 22-62 46-62 23 0 36 14 42 42-17-3-31-13-40-24-9 15-26 24-48 27z" fill="${palette.hair}"/>${eyes}<path d="${mouth}" fill="none" stroke="#68473e" stroke-width="3" stroke-linecap="round"/><path d="M110 111v7" stroke="#ae755e" stroke-width="2" stroke-linecap="round"/><text x="196" y="202" font-family="sans-serif" font-size="18" font-weight="700" text-anchor="end" fill="${palette.shirt}">${initial.replace(/[<>&"']/g, '')}</text></svg>`
  }, [expression, initial, palette, shape])

  return (
    <main className="shell">
      <header><a href="#avatar"><b>A</b> PIXEL <em>PERSONA</em></a><span>DAY 02 / AVATAR MAKER</span></header>
      <section className="hero" id="avatar"><div><small>MAKE A LITTLE INTRODUCTION</small><h1>An avatar that feels like you.</h1><p>Compose a bright, lightweight profile illustration. Everything stays in your browser.</p></div><b className="number">02</b></section>
      <section className="layout">
        <article>
          <div className="between heading"><div><small>LIVE PREVIEW</small><h2>Your new profile picture</h2></div><span className="ready">SVG · 512 PX</span></div>
          <div className="avatar-stage"><div className="avatar-art" dangerouslySetInnerHTML={{ __html: avatar }} /></div>
          <div className="row avatar-actions">
            <button className="primary" onClick={() => { download(avatar, 'pixel-persona-avatar.svg', 'image/svg+xml'); setNotice('Avatar SVG downloaded.') }}>Download SVG</button>
            <button className="soft" onClick={() => { setPaletteIndex((paletteIndex + 1) % palettes.length); setNotice('A new palette is ready.') }}>Surprise me</button>
          </div>
          <p className="helper">SVG stays crisp at any size. Add it to a profile, README, or team directory.</p>
        </article>
        <aside className="avatar-controls">
          <small>YOUR DETAILS</small>
          <label>Initial<input maxLength="2" value={initial} onChange={(event) => setInitial(event.target.value.toUpperCase())} placeholder="A" /></label>
          <label>Backdrop shape<select value={shape} onChange={(event) => setShape(event.target.value)}><option>Circle</option><option>Rounded square</option></select></label>
          <label>Expression<select value={expression} onChange={(event) => setExpression(event.target.value)}><option>Friendly</option><option>Thoughtful</option></select></label>
          <small>COLOR STORY</small>
          <div className="palette-grid">{palettes.map((item, index) => <button aria-label={`${item.name} palette`} aria-pressed={index === paletteIndex} className="palette-choice" key={item.name} onClick={() => setPaletteIndex(index)} style={{ backgroundColor: item.background, borderColor: index === paletteIndex ? item.shirt : 'transparent' }}><span style={{ backgroundColor: item.shirt }} />{item.name}</button>)}</div>
          <p className="helper" role="status" aria-live="polite">{notice || 'Your design is ready to export.'}</p>
        </aside>
      </section>
    </main>
  )
}
