import { useEffect, useRef, useState } from 'react'
import './feature.css'

const MAX_FILE_SIZE = 30 * 1024 * 1024

export default function FeatureApp() {
  const [file, setFile] = useState(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [original, setOriginal] = useState({ width: 0, height: 0 })
  const [lockRatio, setLockRatio] = useState(true)
  const [format, setFormat] = useState('image/jpeg')
  const [quality, setQuality] = useState(85)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const input = useRef(null)
  const ratio = original.width && original.height ? original.width / original.height : 1

  useEffect(() => {
    if (!file) { setSourceUrl(''); return undefined }
    const url = URL.createObjectURL(file); setSourceUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function chooseFile(nextFile) {
    if (!nextFile) return
    if (!nextFile.type.startsWith('image/')) { setNotice('Choose a supported image file.'); return }
    if (nextFile.size > MAX_FILE_SIZE) { setNotice('Choose an image smaller than 30 MB.'); return }
    const url = URL.createObjectURL(nextFile)
    const image = new Image()
    image.onload = () => { setOriginal({ width: image.naturalWidth, height: image.naturalHeight }); setWidth(String(image.naturalWidth)); setHeight(String(image.naturalHeight)); setFile(nextFile); setNotice('Image loaded locally. Nothing was uploaded.'); URL.revokeObjectURL(url) }
    image.onerror = () => { URL.revokeObjectURL(url); setNotice('This image could not be opened. Try another file.') }
    image.src = url
  }

  function resize(event) {
    event.preventDefault()
    const targetWidth = Math.round(Number(width))
    const targetHeight = Math.round(Number(height))
    if (!sourceUrl || !targetWidth || !targetHeight || targetWidth > 8192 || targetHeight > 8192) { setNotice('Enter image dimensions from 1 to 8,192 pixels.'); return }
    setBusy(true)
    const image = new Image()
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = targetWidth; canvas.height = targetHeight
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas is unavailable in this browser.')
        if (format === 'image/jpeg') { context.fillStyle = '#fff'; context.fillRect(0, 0, targetWidth, targetHeight) }
        context.drawImage(image, 0, 0, targetWidth, targetHeight)
        canvas.toBlob((blob) => {
          setBusy(false)
          if (!blob) { setNotice('The browser could not encode this image.'); return }
          const url = URL.createObjectURL(blob)
          const anchor = document.createElement('a')
          anchor.href = url; anchor.download = `resized-${targetWidth}x${targetHeight}.${format === 'image/jpeg' ? 'jpg' : 'png'}`
          anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
          setNotice(`Resized image downloaded · ${(blob.size / 1024).toFixed(0)} KB.`)
        }, format, quality / 100)
      } catch (error) { setBusy(false); setNotice(error.message) }
    }
    image.onerror = () => { setBusy(false); setNotice('The selected image could not be decoded.') }
    image.src = sourceUrl
  }

  return (
    <main className="shell">
      <header><a href="#resizer"><b>R</b> PIXEL <em>PRESS</em></a><span>DAY 11 / CANVAS IMAGE RESIZER</span></header>
      <section className="hero" id="resizer"><div><small>YOUR PIXELS NEVER LEAVE THIS TAB</small><h1>A better fit for every frame.</h1><p>Set export dimensions, keep the original proportions, and resize on-device with the browser canvas.</p></div><b className="number">11</b></section>
      {!file ? <button className="resize-drop" onClick={() => input.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]) }} type="button"><input accept="image/*" hidden onChange={(event) => chooseFile(event.target.files[0])} ref={input} type="file" /><span>＋</span><b>Drop an image or choose a file</b><small>JPG, PNG, WebP · up to 30 MB · processed locally</small></button> : <section className="resize-grid"><article className="resize-preview"><div className="between"><div><small>ORIGINAL</small><h2>{file.name}</h2></div><span className="ready">{original.width} × {original.height}</span></div><img alt={`Original ${file.name}`} src={sourceUrl} /><button className="soft" onClick={() => { setFile(null); setNotice('Choose an image to get started.') }} type="button">Choose another image</button></article><article className="resize-settings"><small>EXPORT SETTINGS</small><form onSubmit={resize}><div className="planner-form-row"><label>Width<input max="8192" min="1" onChange={(event) => { setWidth(event.target.value); if (lockRatio) setHeight(String(Math.max(1, Math.round(Number(event.target.value) / ratio)))) }} type="number" value={width} /></label><label>Height<input max="8192" min="1" onChange={(event) => { setHeight(event.target.value); if (lockRatio) setWidth(String(Math.max(1, Math.round(Number(event.target.value) * ratio)))) }} type="number" value={height} /></label></div><label className="ratio-toggle"><input checked={lockRatio} onChange={(event) => setLockRatio(event.target.checked)} type="checkbox" /> Keep original aspect ratio</label><label>File format<select onChange={(event) => setFormat(event.target.value)} value={format}><option value="image/jpeg">JPEG · smaller file</option><option value="image/png">PNG · lossless</option></select></label>{format === 'image/jpeg' && <label>JPEG quality · {quality}%<input max="100" min="20" onChange={(event) => setQuality(Number(event.target.value))} type="range" value={quality} /></label>}<button className="primary" disabled={busy} type="submit">{busy ? 'Resizing…' : 'Resize & download'}</button></form></article></section>}
      <p aria-live="polite" className="helper resize-notice">{notice}</p>
    </main>
  )
}
