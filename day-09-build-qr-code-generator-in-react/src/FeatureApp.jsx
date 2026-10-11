import { useMemo, useState } from 'react'
import './feature.css'

const DATA_CODEWORDS = [0, 19, 34, 55, 80, 108]
const ECC_CODEWORDS = [0, 7, 10, 15, 20, 26]
const CAPACITY = [0, 17, 32, 53, 78, 106]

function multiply(a, b) {
  let result = 0
  for (let i = 7; i >= 0; i -= 1) {
    result = (result << 1) ^ ((result >>> 7) * 0x11d)
    result ^= ((b >>> i) & 1) * a
  }
  return result
}

function errorCorrection(data, degree) {
  let generator = [1]
  let root = 1
  for (let i = 0; i < degree; i += 1) {
    const next = Array(generator.length + 1).fill(0)
    generator.forEach((coefficient, index) => {
      next[index] ^= coefficient
      next[index + 1] ^= multiply(coefficient, root)
    })
    generator = next
    root = multiply(root, 2)
  }
  const remainder = Array(degree).fill(0)
  for (const codeword of data) {
    const factor = codeword ^ remainder.shift()
    remainder.push(0)
    for (let index = 0; index < degree; index += 1) remainder[index] ^= multiply(generator[index + 1], factor)
  }
  return remainder
}

function createQr(value) {
  const bytes = Array.from(new TextEncoder().encode(value))
  const version = [1, 2, 3, 4, 5].find((candidate) => bytes.length <= CAPACITY[candidate])
  if (!version) throw new Error('This local QR generator supports up to 106 UTF-8 bytes. Shorten the text or URL.')
  const bits = []
  const append = (number, length) => { for (let shift = length - 1; shift >= 0; shift -= 1) bits.push((number >>> shift) & 1) }
  append(4, 4)
  append(bytes.length, 8)
  bytes.forEach((byte) => append(byte, 8))
  const dataLength = DATA_CODEWORDS[version] * 8
  for (let index = 0; index < Math.min(4, dataLength - bits.length); index += 1) bits.push(0)
  while (bits.length % 8) bits.push(0)
  const data = []
  for (let index = 0; index < bits.length; index += 8) data.push(bits.slice(index, index + 8).reduce((result, bit) => (result << 1) | bit, 0))
  for (let pad = 0; data.length < DATA_CODEWORDS[version]; pad += 1) data.push(pad % 2 ? 0x11 : 0xec)
  const codewords = [...data, ...errorCorrection(data, ECC_CODEWORDS[version])]
  const size = version * 4 + 17
  const matrix = Array.from({ length: size }, () => Array(size).fill(null))
  const setFunction = (x, y, dark) => { if (x >= 0 && y >= 0 && x < size && y < size) matrix[y][x] = dark }
  function finder(left, top) {
    for (let dy = -1; dy <= 7; dy += 1) for (let dx = -1; dx <= 7; dx += 1) {
      const x = left + dx; const y = top + dy
      const dark = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6
        && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4))
      setFunction(x, y, dark)
    }
  }
  finder(0, 0); finder(size - 7, 0); finder(0, size - 7)
  for (let index = 8; index < size - 8; index += 1) {
    setFunction(6, index, index % 2 === 0)
    setFunction(index, 6, index % 2 === 0)
  }
  if (version > 1) {
    const centers = [6, size - 7]
    for (const centerX of centers) for (const centerY of centers) {
      if ((centerX === 6 && centerY === 6) || (centerX === size - 7 && centerY === 6) || (centerX === 6 && centerY === size - 7)) continue
      for (let dy = -2; dy <= 2; dy += 1) for (let dx = -2; dx <= 2; dx += 1) {
        setFunction(centerX + dx, centerY + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1)
      }
    }
  }
  const format = (mask) => {
    const valueBits = (1 << 3) | mask
    let remainder = valueBits << 10
    for (let bit = 14; bit >= 10; bit -= 1) if ((remainder >>> bit) & 1) remainder ^= 0x537 << (bit - 10)
    return ((valueBits << 10) | remainder) ^ 0x5412
  }
  const formatBits = format(0)
  const formatBit = (index) => ((formatBits >>> index) & 1) !== 0
  for (let index = 0; index <= 5; index += 1) setFunction(8, index, formatBit(index))
  setFunction(8, 7, formatBit(6)); setFunction(8, 8, formatBit(7)); setFunction(7, 8, formatBit(8))
  for (let index = 9; index < 15; index += 1) setFunction(14 - index, 8, formatBit(index))
  for (let index = 0; index < 8; index += 1) setFunction(size - 1 - index, 8, formatBit(index))
  for (let index = 8; index < 15; index += 1) setFunction(8, size - 15 + index, formatBit(index))
  setFunction(8, size - 8, true)
  let bitIndex = 0
  let upward = true
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5
    for (let step = 0; step < size; step += 1) {
      const y = upward ? size - 1 - step : step
      for (let offset = 0; offset < 2; offset += 1) {
        const x = right - offset
        if (matrix[y][x] !== null) continue
        const dark = bitIndex < codewords.length * 8 && ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) !== 0
        matrix[y][x] = dark !== ((x + y) % 2 === 0)
        bitIndex += 1
      }
    }
    upward = !upward
  }
  return matrix
}

export default function FeatureApp() {
  const [text, setText] = useState('https://example.com')
  const [notice, setNotice] = useState('')
  const result = useMemo(() => {
    if (!text.trim()) return { matrix: null, error: 'Enter text or a URL to make a QR code.' }
    try { return { matrix: createQr(text.trim()), error: '' } }
    catch (error) { return { matrix: null, error: error.message } }
  }, [text])

  function downloadSvg() {
    if (!result.matrix) return
    const size = result.matrix.length
    const quiet = 4
    const modules = result.matrix.flatMap((row, y) => row.map((dark, x) => dark ? `M${x + quiet} ${y + quiet}h1v1h-1z` : '')).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size + quiet * 2} ${size + quiet * 2}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${modules}" fill="#15170f"/></svg>`
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'day-09-qr-code.svg'; anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('SVG QR code downloaded.')
  }

  return (
    <main className="shell">
      <header><a href="#qr"><b>Q</b> QUIET <em>QR STUDIO</em></a><span>DAY 09 / GENERATED IN YOUR BROWSER</span></header>
      <section className="hero" id="qr"><div><small>A SCANNABLE LITTLE SHORTCUT</small><h1>Turn a link into a code.</h1><p>Your content is encoded locally—no QR API or external service receives it.</p></div><b className="number">09</b></section>
      <section className="qr-layout">
        <article className="qr-settings"><label htmlFor="qr-content">Text or URL<textarea id="qr-content" maxLength="500" onChange={(event) => setText(event.target.value)} placeholder="https://…" value={text} /></label><p className="helper">{new TextEncoder().encode(text).length} / 106 bytes supported · shorter URLs scan more easily.</p>{result.error && <p className="finder-error" role="alert">{result.error}</p>}<button className="primary" disabled={!result.matrix} onClick={downloadSvg} type="button">Download SVG</button><p aria-live="polite" className="helper">{notice || 'The code updates as you type. Includes a four-module quiet zone.'}</p></article>
        <article className="qr-preview"><small>LIVE QR CODE · ERROR CORRECTION L</small>{result.matrix ? <svg aria-label={`QR code for ${text}`} className="qr-svg" role="img" shapeRendering="crispEdges" viewBox={`-4 -4 ${result.matrix.length + 8} ${result.matrix.length + 8}`} xmlns="http://www.w3.org/2000/svg"><rect fill="white" height="100%" width="100%" x="-4" y="-4" />{result.matrix.map((row, y) => row.map((dark, x) => dark ? <rect fill="#15170f" height="1" key={`${x}-${y}`} width="1" x={x} y={y} /> : null))}</svg> : <div className="qr-empty">Your QR code appears here.</div>}<p className="helper">Scan with a camera app to verify the destination before sharing.</p></article>
      </section>
    </main>
  )
}
