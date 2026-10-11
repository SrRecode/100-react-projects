import { useEffect, useRef, useState } from 'react'
import './feature.css'

const DB_NAME = 'day06-image-vault'
const STORE_NAME = 'images'

function openVault() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Could not open image storage.'))
  })
}

async function withStore(mode, operation) {
  const database = await openVault()
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode)
      const request = operation(transaction.objectStore(STORE_NAME))
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error || new Error('Image storage request failed.'))
      transaction.onabort = () => reject(transaction.error || new Error('Image storage transaction aborted.'))
    })
  } finally { database.close() }
}

export default function FeatureApp() {
  const [images, setImages] = useState([])
  const [filter, setFilter] = useState('')
  const [status, setStatus] = useState('Opening your private image vault…')
  const [busy, setBusy] = useState(false)
  const fileInput = useRef(null)
  const urls = useRef(new Set())

  function makeUrl(blob) {
    const url = URL.createObjectURL(blob)
    urls.current.add(url)
    return url
  }

  useEffect(() => {
    let cancelled = false
    withStore('readonly', (store) => store.getAll()).then((records) => {
      if (cancelled) return
      setImages(records.map((record) => ({ ...record, url: makeUrl(record.blob) })))
      setStatus(records.length ? '' : 'Your vault is ready. Add your first image.')
    }).catch((error) => setStatus(`Image vault unavailable: ${error.message}`))
    return () => {
      cancelled = true
      urls.current.forEach((url) => URL.revokeObjectURL(url))
      urls.current.clear()
    }
  }, [])

  async function addFiles(fileList) {
    const files = Array.from(fileList || [])
    if (!files.length) return
    const valid = files.filter((file) => file.type.startsWith('image/'))
    if (valid.length !== files.length) setStatus('Only image files are accepted; other files were skipped.')
    setBusy(true)
    try {
      const additions = []
      for (const file of valid) {
        const record = { id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, added: new Date().toISOString(), blob: file }
        await withStore('readwrite', (store) => store.put(record))
        additions.push({ ...record, url: makeUrl(file) })
      }
      setImages((current) => [...additions, ...current])
      if (additions.length) setStatus(`${additions.length} image${additions.length === 1 ? '' : 's'} saved on this device.`)
    } catch (error) { setStatus(`Could not save image: ${error.message}. Check available browser storage.`) }
    finally { setBusy(false); if (fileInput.current) fileInput.current.value = '' }
  }

  async function removeImage(image) {
    try {
      await withStore('readwrite', (store) => store.delete(image.id))
      URL.revokeObjectURL(image.url)
      urls.current.delete(image.url)
      setImages((current) => current.filter((item) => item.id !== image.id))
      setStatus(`${image.name} removed from this device.`)
    } catch (error) { setStatus(`Could not remove image: ${error.message}`) }
  }

  const visible = images.filter((image) => image.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <main className="shell">
      <header><a href="#vault"><b>V</b> LOCAL <em>IMAGE VAULT</em></a><span>DAY 06 / STORED ON THIS DEVICE</span></header>
      <section className="hero" id="vault"><div><small>A LITTLE SPACE FOR YOUR FAVORITES</small><h1>Keep the images worth keeping.</h1><p>Your originals are saved as image files in this browser’s IndexedDB—no upload, account, or server involved.</p></div><b className="number">06</b></section>
      <section className="vault-toolbar">
        <div aria-label="Add images to the local vault" className="vault-drop" onClick={() => fileInput.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.current?.click() } }} role="button" tabIndex="0">
          <input accept="image/*" hidden multiple onChange={(event) => addFiles(event.target.files)} onClick={(event) => event.stopPropagation()} ref={fileInput} type="file" />
          <span aria-hidden="true">＋</span><b>{busy ? 'Saving images…' : 'Drop images here or browse'}</b><small>JPEG, PNG, WebP, GIF · kept in this browser</small>
        </div>
        <div className="between vault-filter"><input aria-label="Filter saved images by filename" onChange={(event) => setFilter(event.target.value)} placeholder="Search your vault…" value={filter} /><span>{images.length} SAVED</span></div>
      </section>
      {visible.length ? <section aria-label="Saved images" className="vault-grid">{visible.map((image) => <article className="vault-card" key={image.id}><img alt={image.name} loading="lazy" src={image.url} /><div className="between"><span title={image.name}>{image.name}</span><button aria-label={`Delete ${image.name}`} onClick={() => removeImage(image)} type="button">×</button></div><small>{(image.size / 1048576).toFixed(2)} MB · {new Date(image.added).toLocaleDateString()}</small></article>)}</section> : <div className="finder-empty"><h2>{filter ? 'No images match.' : 'Your gallery is waiting.'}</h2><p>{filter ? 'Try another filename.' : 'Add photos to keep a private, searchable collection.'}</p></div>}
      <p aria-live="polite" className="helper">{status}</p>
    </main>
  )
}
