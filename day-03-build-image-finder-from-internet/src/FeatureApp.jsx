import { useState } from 'react'
import './feature.css'

const endpoint = 'https://commons.wikimedia.org/w/api.php'

export default function FeatureApp() {
  const [query, setQuery] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function search(event) {
    event.preventDefault()
    const term = query.trim()
    if (!term) { setError('Enter a subject to search.'); return }
    setLoading(true)
    setError('')
    setImages([])
    try {
      const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: term,
        gsrnamespace: '6',
        gsrlimit: '18',
        prop: 'imageinfo',
        iiprop: 'url|extmetadata',
        iiurlwidth: '640',
        format: 'json',
        origin: '*',
      })
      const response = await fetch(`${endpoint}?${params}`)
      if (!response.ok) throw new Error(`Wikimedia returned ${response.status}.`)
      const payload = await response.json()
      const results = Object.values(payload.query?.pages || {}).map((page) => ({
        id: page.pageid,
        title: page.title.replace(/^File:/, '').replaceAll('_', ' '),
        url: page.imageinfo?.[0]?.thumburl || page.imageinfo?.[0]?.url,
        source: page.imageinfo?.[0]?.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
        credit: page.imageinfo?.[0]?.extmetadata?.Artist?.value?.replace(/<[^>]*>/g, '') || 'Wikimedia Commons contributor',
      })).filter((image) => image.url)
      setImages(results)
      setError(results.length ? '' : 'No images found. Try a broader search term.')
      setNotice(results.length ? `${results.length} images found. Check each image's license before reuse.` : '')
    } catch (searchError) {
      setError(`${searchError.message} Check your connection and try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="shell">
      <header><a href="#finder"><b>F</b> FIELD <em>FINDER</em></a><span>DAY 03 / WIKIMEDIA COMMONS</span></header>
      <section className="hero" id="finder"><div><small>A FIELD GUIDE TO GOOD REFERENCES</small><h1>Find the image in your mind.</h1><p>Search free-to-browse images on Wikimedia Commons. Review attribution and license details on the source page before reuse.</p></div><b className="number">03</b></section>
      <article className="finder-panel">
        <form className="finder-search" onSubmit={search}>
          <label className="sr" htmlFor="image-query">Search for images</label>
          <input id="image-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: alpine lake, mid-century chair, wildflower" />
          <button className="primary" disabled={loading}>{loading ? 'Looking…' : 'Find images'}</button>
        </form>
        {loading && <p aria-live="polite" className="finder-message">Searching the Commons library…</p>}
        {error && <p aria-live="polite" className="finder-error">{error}</p>}
        {notice && <p className="helper">{notice}</p>}
        <div className="image-results">
          {images.map((image) => (
            <article className="image-result" key={image.id}>
              <a href={image.source} rel="noreferrer" target="_blank" title={`View source and license for ${image.title}`}><img alt={image.title} loading="lazy" src={image.url} /></a>
              <div><h2>{image.title}</h2><p>{image.credit}</p><a href={image.source} rel="noreferrer" target="_blank">Source &amp; license ↗</a></div>
            </article>
          ))}
        </div>
        {!images.length && !loading && !error && <div className="finder-empty"><span aria-hidden="true">⌕</span><h2>Start with a subject.</h2><p>Search public-domain and freely licensed media. Results need a connection.</p></div>}
      </article>
    </main>
  )
}
