import { useMemo, useState } from 'react'

const SAVED_STUDIES_KEY = 'chromatic-atlas:studies'

const presets = [
  {
    id: 'lilac',
    name: 'Lilac dusk',
    angle: 132,
    speed: 8,
    stops: [
      { color: '#f4a7c8', position: 0 },
      { color: '#a58bf2', position: 52 },
      { color: '#5b78d6', position: 100 },
    ],
  },
  {
    id: 'apricot',
    name: 'Apricot hour',
    angle: 118,
    speed: 7,
    stops: [
      { color: '#f5bd84', position: 0 },
      { color: '#f28e83', position: 52 },
      { color: '#bd6da8', position: 100 },
    ],
  },
  {
    id: 'tidal',
    name: 'Tidal glass',
    angle: 145,
    speed: 10,
    stops: [
      { color: '#80d8cb', position: 0 },
      { color: '#4e9ec5', position: 52 },
      { color: '#6472c7', position: 100 },
    ],
  },
  {
    id: 'citrus',
    name: 'Citrus bloom',
    angle: 110,
    speed: 6,
    stops: [
      { color: '#f3df78', position: 0 },
      { color: '#f6a05c', position: 52 },
      { color: '#dd6d8b', position: 100 },
    ],
  },
]

function Icon({ name, size = 16 }) {
  const paths = {
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    play: <path d="m8 5 11 7-11 7z" />,
    shuffle: <><path d="m16 3 4 4-4 4M4 17h2.5a5 5 0 0 0 4-2l3-4a5 5 0 0 1 4-2H20M16 15l4 4-4 4M4 7h2.5a5 5 0 0 1 3.4 1.3M13.5 15.7a5 5 0 0 0 4 1.3H20" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  )
}

function toHex(hue, saturation = 0.72, lightness = 0.68) {
  const channel = (offset) => {
    const k = (offset + hue / 30) % 12
    const a = saturation * Math.min(lightness, 1 - lightness)
    const value = lightness - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(255 * value).toString(16).padStart(2, '0')
  }

  return `#${channel(0)}${channel(8)}${channel(4)}`
}

function createGradient(type, angle, stops) {
  const colorStops = stops.map(({ color, position }) => `${color} ${position}%`).join(', ')
  if (type === 'radial') return `radial-gradient(circle at center, ${colorStops})`
  if (type === 'conic') return `conic-gradient(from ${angle}deg at center, ${colorStops})`
  return `linear-gradient(${angle}deg, ${colorStops})`
}

function readSavedStudies() {
  try {
    const serialized = window.localStorage.getItem(SAVED_STUDIES_KEY)
    if (!serialized) return { items: [], warning: '' }

    const parsed = JSON.parse(serialized)
    if (!Array.isArray(parsed)) throw new Error('Saved studies are not a list.')

    const items = parsed.filter((study) => (
      typeof study?.id === 'string'
      && typeof study?.name === 'string'
      && study.name.trim().length > 0
      && ['linear', 'radial', 'conic'].includes(study.type)
      && Number.isFinite(study.angle)
      && study.angle >= 0
      && study.angle <= 360
      && Number.isFinite(study.speed)
      && study.speed >= 3
      && study.speed <= 16
      && Array.isArray(study.stops)
      && study.stops.length >= 2
      && study.stops.length <= 5
      && study.stops.every((stop) => (
        /^#[0-9a-f]{6}$/i.test(stop.color)
        && Number.isFinite(stop.position)
        && stop.position >= 0
        && stop.position <= 100
      ))
    ))

    return { items, warning: '' }
  } catch {
    return {
      items: [],
      warning: 'Saved studies could not be read. You can still create and copy gradients.',
    }
  }
}

function App() {
  const [stops, setStops] = useState(() => presets[0].stops.map((stop) => ({ ...stop })))
  const [angle, setAngle] = useState(presets[0].angle)
  const [speed, setSpeed] = useState(presets[0].speed)
  const [gradientType, setGradientType] = useState('linear')
  const [isPlaying, setIsPlaying] = useState(true)
  const [activePreset, setActivePreset] = useState(presets[0].id)
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)
  const [savedStudyData, setSavedStudyData] = useState(readSavedStudies)
  const [studyName, setStudyName] = useState('')
  const { items: savedStudies, warning: storageWarning } = savedStudyData

  const gradient = useMemo(() => createGradient(gradientType, angle, stops), [angle, gradientType, stops])

  const cssOutput = useMemo(
    () => `.animated-gradient {
  background: ${gradient};
  background-size: 220% 220%;
  animation: gradient-drift ${speed}s ease-in-out infinite alternate;
}

@keyframes gradient-drift {
  from { background-position: 0% 0%; }
  to   { background-position: 100% 100%; }
}`,
    [gradient, speed],
  )

  function applyPreset(preset) {
    setStops(preset.stops.map((stop) => ({ ...stop })))
    setAngle(preset.angle)
    setSpeed(preset.speed)
    setGradientType('linear')
    setActivePreset(preset.id)
    setStatus(`${preset.name} loaded.`)
  }

  function persistSavedStudies(items, successMessage) {
    try {
      window.localStorage.setItem(SAVED_STUDIES_KEY, JSON.stringify(items))
      setSavedStudyData({ items, warning: '' })
      setStatus(successMessage)
      return true
    } catch {
      setStatus('This browser could not save the study. Try removing older studies or use Copy CSS.')
      return false
    }
  }

  function saveStudy(event) {
    event.preventDefault()
    const name = studyName.trim()
    if (!name) {
      setStatus('Enter a name before saving this study.')
      return
    }

    const study = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      type: gradientType,
      angle,
      speed,
      stops: stops.map((stop) => ({ ...stop })),
    }
    if (persistSavedStudies([study, ...savedStudies], `${name} saved on this device.`)) {
      setStudyName('')
    }
  }

  function loadStudy(study) {
    setStops(study.stops.map((stop) => ({ ...stop })))
    setAngle(study.angle)
    setSpeed(study.speed)
    setGradientType(study.type)
    setActivePreset(null)
    setStatus(`${study.name} loaded.`)
  }

  function removeStudy(id) {
    const nextStudies = savedStudies.filter((study) => study.id !== id)
    persistSavedStudies(nextStudies, 'Saved study removed.')
  }

  function updateStop(index, key, value) {
    setStops((current) => current.map((stop, stopIndex) => (
      stopIndex === index ? { ...stop, [key]: value } : stop
    )))
    setActivePreset(null)
    setStatus('Gradient updated.')
  }

  function addStop() {
    if (stops.length >= 5) return

    const sortedStops = [...stops].sort((first, second) => first.position - second.position)
    const widestGap = sortedStops.slice(1).reduce((largest, stop, index) => {
      const previous = sortedStops[index]
      const gap = stop.position - previous.position
      return gap > largest.gap ? { gap, position: (stop.position + previous.position) / 2 } : largest
    }, { gap: 0, position: 50 })

    setStops((current) => [
      ...current,
      { color: '#d9a5ef', position: Math.round(widestGap.position) },
    ].sort((first, second) => first.position - second.position))
    setActivePreset(null)
    setStatus('Color stop added.')
  }

  function removeStop(index) {
    if (stops.length <= 2) return
    setStops((current) => current.filter((_, stopIndex) => stopIndex !== index))
    setActivePreset(null)
    setStatus('Color stop removed.')
  }

  function shuffleGradient() {
    const hue = Math.floor(Math.random() * 360)
    const colors = [hue, hue + 68, hue + 156].map((value) => toHex(value % 360))
    setStops((current) => current.map((stop, index) => ({ ...stop, color: colors[index % colors.length] })))
    setAngle(Math.floor(Math.random() * 181) + 90)
    setActivePreset(null)
    setStatus('A new color study is ready.')
  }

  async function copyCss() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard access is unavailable in this browser.')
      }
      await navigator.clipboard.writeText(cssOutput)
      setCopied(true)
      setStatus('CSS copied to your clipboard.')
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
      setStatus('Could not copy CSS. Select the code below and copy it manually.')
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a aria-label="Chromatic Atlas home" className="brand" href="#studio">
          <svg aria-hidden="true" className="brand-mark" viewBox="0 0 40 40">
            <defs>
              <linearGradient id="atlas-mark" x1="5" x2="35" y1="34" y2="6" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e79075" />
                <stop offset=".52" stopColor="#c16bc0" />
                <stop offset="1" stopColor="#697dd0" />
              </linearGradient>
            </defs>
            <path d="M7 27.5c5.5-1 8-10 13-10s7.5 9 13 8" stroke="url(#atlas-mark)" strokeLinecap="round" strokeWidth="5" />
            <path d="M7 16c4 0 6 5 9.5 5 4 0 6-9 10.5-9 2.5 0 4 2 6 3.5" stroke="url(#atlas-mark)" strokeLinecap="round" strokeWidth="5" />
          </svg>
          <span>Chromatic <span className="brand-light">Atlas</span></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> Day 01 / GRADIENT STUDIO</div>
      </header>

      <section aria-labelledby="page-title" className="intro" id="studio">
        <div>
          <h1 id="page-title">Make color move.</h1>
          <p>Shape a gradient, find its rhythm, take the CSS with you.</p>
        </div>
        <div className="intro-actions">
          <button className="button button-quiet" onClick={shuffleGradient} type="button">
            <Icon name="shuffle" />
            <span>Surprise me</span>
          </button>
          <button className="button button-primary" onClick={copyCss} type="button">
            <Icon name="copy" />
            <span>{copied ? 'Copied' : 'Copy CSS'}</span>
          </button>
        </div>
      </section>

      <section aria-label="Gradient editor" className="studio-layout">
        <div className="canvas-column">
          <div className="section-heading">
            <h2>Live canvas</h2>
            <span className="micro-label">01 / PREVIEW</span>
          </div>
          <div
            aria-label={`Animated ${gradientType} gradient${gradientType === 'radial' ? '' : `, ${angle} degrees`}`}
            className={`preview-canvas${isPlaying ? ' is-playing' : ''}`}
            role="img"
            style={{ backgroundImage: gradient, animationDuration: `${speed}s` }}
          >
            <div className="canvas-caption">
              <span className="canvas-live"><span className="status-dot" />{isPlaying ? 'IN MOTION' : 'PAUSED'}</span>
              <span>{gradientType === 'radial' ? 'Radial' : `${angle}°`} <span aria-hidden="true">/</span> {speed}s</span>
            </div>
          </div>

          <div className="preview-actions">
            <p>Same frame, every study. Compare the color, not the crop.</p>
            <button
              aria-pressed={!isPlaying}
              className="button button-play"
              onClick={() => setIsPlaying((playing) => !playing)}
              type="button"
            >
              <Icon name={isPlaying ? 'pause' : 'play'} />
              <span>{isPlaying ? 'Pause motion' : 'Play motion'}</span>
            </button>
          </div>

          <div aria-labelledby="presets-title" className="presets">
            <div className="section-heading">
              <h2 id="presets-title">Color index</h2>
              <span className="micro-label">START WITH A STUDY</span>
            </div>
            <div className="preset-list">
              {presets.map((preset, index) => (
                <button
                  aria-pressed={activePreset === preset.id}
                  className={`preset${activePreset === preset.id ? ' is-selected' : ''}`}
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  type="button"
                >
                  <span aria-hidden="true" className="preset-swatch" style={{
                    backgroundImage: `linear-gradient(${preset.angle}deg, ${preset.stops.map(({ color, position }) => `${color} ${position}%`).join(', ')})`,
                  }} />
                  <span className="preset-index">0{index + 1}</span>
                  <span className="preset-name">{preset.name}</span>
                </button>
              ))}
            </div>
            <div className="saved-studies">
              <div className="saved-studies-heading">
                <div>
                  <h3>Saved studies</h3>
                  <p>Kept in this browser, on this device.</p>
                </div>
                <span className="study-count">{savedStudies.length}</span>
              </div>
              <form className="save-study-form" onSubmit={saveStudy}>
                <label className="visually-hidden" htmlFor="study-name">Name this gradient study</label>
                <input
                  id="study-name"
                  maxLength="40"
                  onChange={(event) => setStudyName(event.target.value)}
                  placeholder="e.g. Summer landing page"
                  value={studyName}
                />
                <button className="button button-play" type="submit">Save study</button>
              </form>
              {savedStudies.length > 0 ? (
                <ul className="saved-study-list">
                  {savedStudies.map((study) => (
                    <li className="saved-study" key={study.id}>
                      <button className="saved-study-load" onClick={() => loadStudy(study)} type="button">
                        <span aria-hidden="true" className="saved-study-swatch" style={{
                          backgroundImage: createGradient(study.type, study.angle, study.stops),
                        }} />
                        <span>{study.name}</span>
                      </button>
                      <button
                        aria-label={`Remove saved study ${study.name}`}
                        className="saved-study-remove"
                        onClick={() => removeStudy(study.id)}
                        type="button"
                      >
                        <Icon name="close" size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-studies">Your saved gradients will appear here.</p>
              )}
              {storageWarning && <p className="storage-warning" role="alert">{storageWarning}</p>}
            </div>
          </div>
        </div>

        <aside aria-labelledby="controls-title" className="inspector">
          <div className="section-heading inspector-heading">
            <h2 id="controls-title">Tune your gradient</h2>
            <span className="micro-label">02 / CONTROLS</span>
          </div>

          <div className="control-section">
            <div className="control-title-row">
              <h3>Color stops</h3>
              <button
                className="text-button"
                disabled={stops.length >= 5}
                onClick={addStop}
                type="button"
              >
                <Icon name="plus" size={14} />
                <span>Add stop</span>
              </button>
            </div>

            <div className="stop-list">
              {stops.map((stop, index) => (
                <div className="stop-row" key={`${index}-${stop.color}`}>
                  <label className="color-picker" style={{ backgroundColor: stop.color }}>
                    <span className="visually-hidden">Color for stop {index + 1}</span>
                    <input
                      aria-label={`Color for stop ${index + 1}`}
                      onChange={(event) => updateStop(index, 'color', event.target.value)}
                      type="color"
                      value={stop.color}
                    />
                  </label>
                  <code className="hex-value">{stop.color.toUpperCase()}</code>
                  <label className="position-field">
                    <span className="visually-hidden">Position for stop {index + 1} in percent</span>
                    <input
                      max="100"
                      min="0"
                      onChange={(event) => updateStop(index, 'position', Number(event.target.value))}
                      type="number"
                      value={stop.position}
                    />
                    <span>%</span>
                  </label>
                  <button
                    aria-label={`Remove color stop ${index + 1}`}
                    className="remove-stop"
                    disabled={stops.length <= 2}
                    onClick={() => removeStop(index)}
                    type="button"
                  >
                    <Icon name="close" size={14} />
                  </button>
                </div>
              ))}
            </div>
            <p className="field-hint">Choose a color and set where it lands in the blend.</p>
          </div>

          <div className="control-section">
            <div className="control-title-row">
              <label htmlFor="gradient-type">Gradient type</label>
            </div>
            <select
              className="gradient-type-select"
              id="gradient-type"
              onChange={(event) => {
                setGradientType(event.target.value)
                setActivePreset(null)
                setStatus(`${event.target.value[0].toUpperCase()}${event.target.value.slice(1)} gradient selected.`)
              }}
              value={gradientType}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
              <option value="conic">Conic</option>
            </select>
            <p className="field-hint">Switch between three CSS gradient shapes without losing your colors.</p>
          </div>

          <div className="control-section motion-section">
            <div className="control-title-row">
              <label htmlFor="angle">{gradientType === 'conic' ? 'Starting angle' : 'Direction'}</label>
              <output htmlFor="angle" className="range-value">{angle}°</output>
            </div>
            <input
              aria-label="Gradient direction angle"
              className="range-input"
              disabled={gradientType === 'radial'}
              id="angle"
              max="360"
              min="0"
              onChange={(event) => {
                setAngle(Number(event.target.value))
                setActivePreset(null)
                setStatus('Gradient direction updated.')
              }}
              type="range"
              value={angle}
            />
            <div aria-hidden="true" className="range-ends"><span>0°</span><span>180°</span><span>360°</span></div>
          </div>

          <div className="control-section speed-section">
            <div className="control-title-row">
              <label htmlFor="speed">Motion speed</label>
              <output className="range-value" htmlFor="speed">{speed}s</output>
            </div>
            <input
              className="range-input"
              id="speed"
              max="16"
              min="3"
              onChange={(event) => {
                setSpeed(Number(event.target.value))
                setActivePreset(null)
                setStatus('Motion speed updated.')
              }}
              type="range"
              value={speed}
            />
            <div aria-hidden="true" className="range-ends"><span>Faster</span><span>Slower</span></div>
          </div>
        </aside>
      </section>

      <section aria-labelledby="css-title" className="css-section">
        <div className="css-heading">
          <div>
            <span className="micro-label">03 / READY TO USE</span>
            <h2 id="css-title">Your CSS, ready to go.</h2>
          </div>
          <button className="button button-code" onClick={copyCss} type="button">
            <Icon name="copy" />
            <span>{copied ? 'Copied' : 'Copy CSS'}</span>
          </button>
        </div>
        <pre aria-label="Generated CSS" className="code-window"><code>{cssOutput}</code></pre>
      </section>

      <p aria-live="polite" className="visually-hidden" role="status">{status || storageWarning}</p>
      <footer className="footer">
        <span>Chromatic Atlas</span>
        <span>Color in a state of motion.</span>
      </footer>
    </main>
  )
}

export default App
