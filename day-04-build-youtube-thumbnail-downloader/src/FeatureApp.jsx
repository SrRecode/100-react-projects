import { useMemo, useState } from 'react'
import './feature.css'

function getVideoId(input) {
  const value = input.trim()
  if (/^[\w-]{11}$/.test(value)) return value
  try {
    const url = new URL(value)
    if (url.hostname === 'youtu.be' || url.hostname.endsWith('.youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || ''
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'].includes(url.hostname)) {
      return url.searchParams.get('v') || url.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]{11})/)?.[1] || ''
    }
  } catch { return '' }
  return ''
}

const qualities = [
  { name: 'Max resolution', suffix: 'maxresdefault', detail: '1280 × 720 · when available' },
  { name: 'Standard', suffix: 'sddefault', detail: '640 × 480 · when available' },
  { name: 'High quality', suffix: 'hqdefault', detail: '480 × 360' },
  { name: 'Medium quality', suffix: 'mqdefault', detail: '320 × 180' },
]

export default function FeatureApp() {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState('')
  const [qualityIndex, setQualityIndex] = useState(0)
  const [previewError, setPreviewError] = useState(false)
  const [error, setError] = useState('')
  const quality = qualities[qualityIndex]
  const videoId = useMemo(() => getVideoId(submitted), [submitted])
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/${quality.suffix}.jpg` : ''

  function submit(event) {
    event.preventDefault()
    const id = getVideoId(input)
    if (!id) { setError('Paste a valid YouTube video, Shorts, embed, or youtu.be link.'); setSubmitted(''); return }
    setError('')
    setPreviewError(false)
    setQualityIndex(0)
    setSubmitted(input)
  }

  return (
    <main className="shell">
      <header><a href="#thumbnail"><b>T</b> FRAME <em>FETCH</em></a><span>DAY 04 / YOUTUBE THUMBNAILS</span></header>
      <section className="hero" id="thumbnail"><div><small>ONE LINK, FOUR FRAME SIZES</small><h1>Bring the cover frame along.</h1><p>Preview an available YouTube thumbnail and open the image to save it. Use thumbnails only where you have permission.</p></div><b className="number">04</b></section>
      <article className="thumbnail-panel">
        <form className="finder-search" onSubmit={submit}>
          <label className="sr" htmlFor="video-link">YouTube video URL</label>
          <input autoComplete="url" id="video-link" onChange={(event) => setInput(event.target.value)} placeholder="https://www.youtube.com/watch?v=…" value={input} />
          <button className="primary" type="submit">Preview thumbnails</button>
        </form>
        {error && <p className="finder-error" role="alert">{error}</p>}
        {videoId ? (
          <section className="thumbnail-workspace">
            <div className="thumbnail-preview">
              <div className="between"><div><small>VIDEO ID</small><b>{videoId}</b></div><span className="ready">{quality.name}</span></div>
              {!previewError ? <a aria-label="Open thumbnail image in a new tab to save it" href={thumbnail} rel="noreferrer" target="_blank"><img alt={`YouTube thumbnail preview, ${quality.name}`} onError={() => {
                if (qualityIndex < qualities.length - 1) setQualityIndex((index) => index + 1)
                else setPreviewError(true)
              }} src={thumbnail} /></a> : <p className="finder-error" role="status">No thumbnail preview is available for this video.</p>}
              <p className="helper">If this size is unavailable, try another quality. Right-click the image or open it to save.</p>
              {!previewError && <a className="primary thumbnail-download" href={thumbnail} rel="noreferrer" target="_blank">Open image to save ↗</a>}
            </div>
            <div className="quality-list"><h2>Choose a frame size</h2>{qualities.map((item, index) => <button aria-pressed={quality.suffix === item.suffix} className={`quality-choice${quality.suffix === item.suffix ? ' selected' : ''}`} key={item.suffix} onClick={() => { setQualityIndex(index); setPreviewError(false) }} type="button"><span><b>{item.name}</b><small>{item.detail}</small></span><span aria-hidden="true">{quality.suffix === item.suffix ? '●' : '○'}</span></button>)}</div>
          </section>
        ) : <div className="finder-empty"><span aria-hidden="true">▧</span><h2>Your preview goes here.</h2><p>We read the video ID from your link; no account or API key is required.</p></div>}
      </article>
    </main>
  )
}
