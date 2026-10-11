import { useEffect, useRef, useState } from 'react'

const emojis = ['😀','😎','🥳','😂','🤔','😊','😍','😴','🔥','✨','🎉','❤️','👍','🚀','🌱','🌈','☕','💡','📚','🎨','🎧','🌙','⭐','🍋','🌸','🧠','🛠️','🧑‍💻','✅','🧭']
const quiz = [
  { question: 'Which API observes elements as they enter the viewport?', choices: ['IntersectionObserver', 'MutationParser', 'WindowTracker'], answer: 0 },
  { question: 'Which browser API can record a user-approved microphone stream?', choices: ['MediaRecorder', 'AudioEncoder only', 'SpeechMarkup'], answer: 0 },
  { question: 'Which storage option is designed for larger structured offline data?', choices: ['IndexedDB', 'URL hash', 'sessionStorage only'], answer: 0 },
]
const code39 = {
  '0':'nnnwwnwnn','1':'wnnwnnnnw','2':'nnwwnnnnw','3':'wnwwnnnnn','4':'nnnwwnnnw','5':'wnnwwnnnn','6':'nnwwwnnnn','7':'nnnwnnwnw','8':'wnnwnnwnn','9':'nnwwnnwnn',
  A:'wnnnnwnnw',B:'nnwnnwnnw',C:'wnwnnwnnn',D:'nnnnwwnnw',E:'wnnnwwnnn',F:'nnwnwwnnn',G:'nnnnnwwnw',H:'wnnnnwwnn',I:'nnwnnwwnn',J:'nnnnwwwnn',
}
const makePdf = async ({ day, text, items, setStatus }) => {
  try {
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF()
    pdf.setFontSize(18)
    pdf.text(day === 74 ? 'Invoice · #1042' : day === 82 ? 'Document export' : 'Project report', 15, 20)
    pdf.setFontSize(10)
    pdf.text(`Prepared ${new Date().toLocaleDateString()}`, 15, 28)
    if (day === 82) {
      const lines = pdf.splitTextToSize(text || 'Your exported document will appear here.', 180)
      let y = 42
      for (const line of lines) { if (y > 275) { pdf.addPage(); y = 20 } pdf.text(line, 15, y); y += 6 }
    } else {
      const rows = day === 74 ? ['Design and development', 'Project review'] : items.map(item => item.label)
      pdf.text('Description', 15, 45); pdf.text('Qty', 125, 45); pdf.text('Amount', 160, 45)
      let y = 55
      for (const [index, row] of rows.entries()) { if (y > 275) { pdf.addPage(); y = 20 }; pdf.text(String(row).slice(0, 52), 15, y); pdf.text(String(index + 1), 128, y); pdf.text(`$${((index + 1) * 24).toFixed(2)}`, 160, y); y += 10 }
      pdf.text(`Total · $${rows.reduce((sum, _, index) => sum + (index + 1) * 24, 0)}.00`, 130, y + 12)
    }
    pdf.save(`day-${day}-export.pdf`)
    setStatus('PDF generated locally in your browser.')
  } catch (error) { setStatus(`Could not export PDF: ${error.message}`) }
}
const makeImagePdf = async ({ files, setStatus }) => {
  try {
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF()
    for (const [index, file] of files.entries()) {
      if (index > 0) pdf.addPage()
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error(`Could not read ${file.name}`))
        reader.readAsDataURL(file)
      })
      const image = await new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error(`${file.name} is not a readable image`))
        image.src = data
      })
      const scale = Math.min(190 / image.naturalWidth, 277 / image.naturalHeight)
      const width = image.naturalWidth * scale
      const height = image.naturalHeight * scale
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d')
      if (!context) throw new Error(`Could not prepare ${file.name} for PDF export`)
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0)
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', (210 - width) / 2, (297 - height) / 2, width, height)
    }
    pdf.save('image-collection.pdf')
    setStatus('Image PDF generated locally.')
  } catch (error) { setStatus(`Could not generate the image PDF: ${error.message}`) }
}
const mergePdfs = async ({ files, download, setStatus }) => {
  try {
    const { PDFDocument } = await import('pdf-lib')
    const merged = await PDFDocument.create()
    for (const item of files) {
      const source = await PDFDocument.load(await item.file.arrayBuffer())
      const pages = await merged.copyPages(source, source.getPageIndices())
      pages.forEach(page => merged.addPage(page))
    }
    const bytes = await merged.save()
    download('merged-documents.pdf', bytes, 'application/pdf')
    setStatus(`Merged ${files.length} PDF files locally.`)
  } catch (error) { setStatus(`Could not merge these PDFs: ${error.message}`) }
}
const saveOfflineRecord = ({ text, setStatus }) => {
  if (!('indexedDB' in window)) { setStatus('IndexedDB is not available in this browser.'); return }
  const request = indexedDB.open('daybook-offline-lab', 1)
  request.onupgradeneeded = () => request.result.createObjectStore('notes', { keyPath: 'id' })
  request.onerror = () => setStatus(`Could not open offline storage: ${request.error?.message || 'unknown error'}`)
  request.onsuccess = () => {
    const db = request.result
    const transaction = db.transaction('notes', 'readwrite')
    transaction.objectStore('notes').put({ id: 'draft', text, savedAt: new Date().toISOString() })
    transaction.oncomplete = () => { setStatus('Saved in IndexedDB on this device.'); db.close() }
    transaction.onerror = () => { setStatus(`Could not save: ${transaction.error?.message || 'storage error'}`); db.close() }
  }
}
const loadOfflineRecord = ({ setText, setStatus }) => {
  if (!('indexedDB' in window)) { setStatus('IndexedDB is not available in this browser.'); return }
  const request = indexedDB.open('daybook-offline-lab', 1)
  request.onupgradeneeded = () => request.result.createObjectStore('notes', { keyPath: 'id' })
  request.onerror = () => setStatus(`Could not open offline storage: ${request.error?.message || 'unknown error'}`)
  request.onsuccess = () => {
    const db = request.result
    const transaction = db.transaction('notes', 'readonly')
    const record = transaction.objectStore('notes').get('draft')
    record.onsuccess = () => { if (record.result) { setText(record.result.text); setStatus(`Loaded from IndexedDB · ${new Date(record.result.savedAt).toLocaleString()}`) } else setStatus('No saved offline draft yet.') }
    record.onerror = () => setStatus(`Could not load: ${record.error?.message || 'storage error'}`)
    transaction.oncomplete = () => db.close()
  }
}

export default function FeatureLab({ day }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [status, setStatus] = useState('')
  const [items, setItems] = useState([])
  const [value, setValue] = useState('')
  const [second, setSecond] = useState('')
  const [selected, setSelected] = useState(0)
  const [role, setRole] = useState('Member')
  const [rating, setRating] = useState(0)
  const [city, setCity] = useState('')
  const [cityName, setCityName] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [country, setCountry] = useState('')
  const [stateName, setStateName] = useState('')
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [keys, setKeys] = useState([])
  const [recording, setRecording] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')
  const [clock, setClock] = useState(new Date())
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(null)
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [contact, setContact] = useState('')
  const [stream, setStream] = useState(null)
  const [files, setFiles] = useState([])
  const mediaRef = useRef(null)
  const recorderRef = useRef(null)
  const recorderStreamRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    if (![26].includes(day)) return
    const id = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [day])
  useEffect(() => {
    if (stream && mediaRef.current) mediaRef.current.srcObject = stream
  }, [stream])
  useEffect(() => () => {
    stream?.getTracks().forEach(track => track.stop())
    recorderStreamRef.current?.getTracks().forEach(track => track.stop())
    if (mediaUrl) URL.revokeObjectURL(mediaUrl)
  }, [stream, mediaUrl])
  useEffect(() => {
    if (day !== 62) return
    const onKey = event => {
      if (event.key.length > 1 && !['Enter','Escape','Tab','Backspace','ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(event.key)) return
      setKeys(current => [event.key === ' ' ? 'Space' : event.key, ...current].slice(0, 14))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [day])
  useEffect(() => {
    if (day !== 66) return
    const id = window.setTimeout(() => setDebouncedSearch(text), 250)
    return () => window.clearTimeout(id)
  }, [day, text])

  const add = (label = text) => {
    if (!label.trim()) { setStatus('Add a value before saving.'); return }
    setItems(current => [{ label: label.trim(), id: `${Date.now()}-${Math.random()}` }, ...current])
    setText('')
    setStatus('Saved locally in this session.')
  }
  const download = (name, content, type = 'text/plain') => {
    const anchor = document.createElement('a')
    const blobUrl = URL.createObjectURL(new Blob([content], { type }))
    anchor.href = blobUrl
    anchor.download = name
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  }
  const parseUrl = () => {
    try {
      const parsed = new URL(text)
      setResult(JSON.stringify({ protocol: parsed.protocol, hostname: parsed.hostname, port: parsed.port || '(default)', pathname: parsed.pathname, searchParams: Object.fromEntries(parsed.searchParams), hash: parsed.hash || '(none)' }, null, 2))
    } catch { setResult('Enter a complete URL, including http:// or https://.') }
  }
  const calculate = () => {
    const expression = text.replace(/−/g, '-').replace(/\s/g, '')
    const tokens = expression.match(/(?:\d+\.?\d*|\.\d+)|[+\-×÷]/g) || []
    if (!tokens.length || tokens.join('') !== expression || tokens.length % 2 === 0) {
      setResult('Enter a valid expression.')
      return
    }
    const values = [Number(tokens[0])]
    const operators = []
    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i]
      const operand = Number(tokens[i + 1])
      if (!Number.isFinite(operand)) { setResult('Enter a valid expression.'); return }
      if (operator === '×' || operator === '÷') {
        const previous = values.pop()
        values.push(operator === '×' ? previous * operand : previous / operand)
      } else { operators.push(operator); values.push(operand) }
    }
    const total = values.reduce((sum, value, index) => index === 0 ? value : operators[index - 1] === '+' ? sum + value : sum - value, 0)
    if (!Number.isFinite(total)) { setResult('Cannot divide by zero.'); return }
    setResult(String(Number(total.toPrecision(10))))
  }
  const request = async () => {
    let parsed
    try { parsed = new URL(url); if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported.') }
    catch (error) { setResponse(error.message || 'Enter a valid HTTP URL.'); return }
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    setLoading(true); setResponse('')
    try {
      const res = await fetch(parsed, { method, signal: controller.signal, headers: method === 'GET' ? undefined : { 'Content-Type': 'application/json' }, body: method === 'GET' ? undefined : '{"demo":true}' })
      const body = await res.text()
      let formatted = body
      try { formatted = JSON.stringify(JSON.parse(body), null, 2) } catch { /* Preserve non-JSON response text. */ }
      setResponse(`${res.status} ${res.statusText}\n${formatted.slice(0, 12000)}`)
    } catch (error) {
      setResponse(error.name === 'AbortError' ? 'Request timed out after 10 seconds.' : `${error.message}. The server may block browser CORS requests; try a public API or configure your own backend proxy.`)
    } finally { window.clearTimeout(timeout); setLoading(false) }
  }
  const useCamera = async screen => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access requires a supported browser and a secure connection.')
      const next = screen ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }) : await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      setStream(next)
      setStatus(screen ? 'Screen sharing started.' : 'Camera ready.')
    } catch (error) { setStatus(error.message || 'Permission denied or media device unavailable.') }
  }
  const stopStream = () => { stream?.getTracks().forEach(track => track.stop()); setStream(null); setStatus('Capture stopped.') }
  const recordVoice = async () => {
    if (recording) { recorderRef.current?.stop(); setRecording(false); return }
    try {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error('Audio recording is not supported in this browser.')
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(audioStream); chunksRef.current = []
      recorderStreamRef.current = audioStream
      recorder.ondataavailable = event => { if (event.data.size) chunksRef.current.push(event.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        const savedUrl = URL.createObjectURL(blob); setMediaUrl(savedUrl); audioStream.getTracks().forEach(track => track.stop()); recorderStreamRef.current = null
        setRecording(false)
      }
      recorderRef.current = recorder; recorder.start(); setRecording(true); setStatus('Recording locally. Select stop when finished.')
    } catch (error) { setStatus(error.message || 'Microphone permission denied.') }
  }
  const show = (label, content) => <div className="feature-lab" key={day}><div className="feature-head"><span>HANDS-ON WORKBENCH</span><strong>DAY {String(day).padStart(2, '0')}</strong></div><h2>{label}</h2>{content}<p className="feature-status" role="status" aria-live="polite">{status}</p></div>
  const line = (children) => <div className="feature-row">{children}</div>

  if (day === 17) {
    const languages = ['Spanish', 'French', 'Urdu']
    const phrasebook = { hello: ['hola', 'bonjour', 'السلام علیکم'], water: ['agua', 'eau', 'پانی'], thank: ['gracias', 'merci', 'شکریہ'], good: ['bueno', 'bon', 'اچھا'], welcome: ['bienvenido', 'bienvenue', 'خوش آمدید'] }
    return show('Translate a phrase', <>{line(<><textarea aria-label="Text to translate" value={text} onChange={e => setText(e.target.value)} placeholder="Write a short phrase…"/><select value={selected} onChange={e => setSelected(Number(e.target.value))}>{languages.map((x,i)=><option key={x} value={i}>{x}</option>)}</select></>)}<button className="primary" onClick={() => { const token = text.trim().toLowerCase().split(/\s+/)[0]; setResult(phrasebook[token]?.[selected] || `Demo translation preview for ${languages[selected]}: ${text}`); setStatus('Sample dictionary mode — connect a translation provider for complete, private translation.') }}>Translate locally</button>{result&&<output className="feature-output">{result}</output>}<p className="feature-note">No AI service or translation API is connected. This sample illustrates the flow without sending your text to a third party.</p></>)
  }
  if (day === 18) return show('Your private media player', <><label className="feature-upload">Choose a local video<input type="file" accept="video/*" onChange={e => { const f=e.target.files?.[0]; if(f) setMediaUrl(URL.createObjectURL(f)) }}/></label>{mediaUrl?<video className="feature-video" controls src={mediaUrl}/>:<div className="feature-empty">Choose a video file to preview it on this device.</div>}</>)
  if (day === 19) return show('Develop your photo', <><label className="feature-upload">Choose an image<input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f){if(mediaUrl)URL.revokeObjectURL(mediaUrl);setMediaUrl(URL.createObjectURL(f))}}}/></label>{mediaUrl&&<><img className="feature-photo" src={mediaUrl} alt="Selected photo preview" style={{filter:`brightness(${Number(value||100)}%) saturate(${Number(second||100)}%)`}}/><div className="feature-row"><label>Light <input type="range" min="50" max="150" value={value||100} onChange={e=>setValue(e.target.value)}/></label><label>Color <input type="range" min="0" max="200" value={second||100} onChange={e=>setSecond(e.target.value)}/></label></div><button className="soft" onClick={()=>{setValue('100');setSecond('100')}}>Reset adjustments</button></>}</>)
  if (day === 20) return show('Unlock your demo contacts', <>{!unlocked?<><p className="feature-note">Demo PIN: 2468. A client-side lock is a learning demo, not real encryption.</p>{line(<><input aria-label="Demo PIN" inputMode="numeric" type="password" value={pin} onChange={e=>setPin(e.target.value)} placeholder="Enter demo PIN"/><button className="primary" onClick={()=>pin==='2468'?(setUnlocked(true),setStatus('Demo contacts unlocked.')):setStatus('That PIN does not match the sample.')}>Unlock</button></>)}</>:<><p className="feature-note">Local sample contacts — not encrypted. Do not use real private information.</p>{line(<><input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Name and phone"/><button className="primary" onClick={()=>add(contact)}>Save contact</button></>)}{items.map(x=><div className="feature-item" key={x.id}>{x.label}<button className="remove" onClick={()=>setItems(v=>v.filter(y=>y.id!==x.id))}>×</button></div>)}</>}</>)
  if ([21,74].includes(day)) return show(day===74?'Invoice preview':'Printable report', <><div className="print-preview"><h3>{day===74?'INVOICE · #1042':'PROJECT REPORT'}</h3><p>Prepared {new Date().toLocaleDateString()}</p><table><thead><tr><th>Description</th><th>Quantity</th><th>Amount</th></tr></thead><tbody>{(items.length?items: [{id:'a',label:'Design and development',done:false},{id:'b',label:'Project review',done:false}]).map((x,i)=><tr key={x.id}><td>{x.label}</td><td>{i+1}</td><td>${((i+1)*24).toFixed(2)}</td></tr>)}</tbody></table><p><b>Total due: ${items.length?items.length*24:72}.00</b></p></div><button className="primary" onClick={() => makePdf({ day, text, items, setStatus })}>Download PDF</button><p className="feature-note">The PDF is generated on this device; no server or payment provider is involved.</p></>)
  if (day === 82) return show('Create a text PDF', <><textarea aria-label="PDF content" value={text} onChange={e=>setText(e.target.value)} placeholder="Write or paste the text you want in your PDF…"/><button className="primary" onClick={() => makePdf({ day, text, items, setStatus })}>Export text as PDF</button><p className="feature-note">Long documents automatically continue on additional pages.</p></>)
  if (day === 79) return show('Create a PDF from images', <><p className="feature-note">Choose images in the order you want. Each image is fitted to its own PDF page locally.</p><label className="feature-upload">Choose images<input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files||[]))}/></label>{files.map((file,i)=><div className="feature-item" key={`${file.name}-${i}`}>{i+1}. {file.name} · {(file.size/1048576).toFixed(2)} MB<button className="remove" onClick={()=>setFiles(f=>f.filter((_,index)=>index!==i))}>×</button></div>)}<button className="primary" disabled={!files.length} onClick={() => makeImagePdf({ files, setStatus })}>Export image PDF</button></>)
  if (day === 22) return show('Daily roll call', <><p className="feature-note">Sample roster for local attendance practice · {new Date().toLocaleDateString()}</p>{['Aisha Khan','Bilal Ahmed','Mina Patel','Ravi Shah','Noor Ali'].map(name=><label className="feature-check" key={name}><input type="checkbox" checked={items.some(x=>x.label===name)} onChange={e=>e.target.checked?add(name):setItems(v=>v.filter(x=>x.label!==name))}/>{name}<span>{items.some(x=>x.label===name)?'Present':'Not marked'}</span></label>)}<strong className="feature-output">{items.filter(x=>['Aisha Khan','Bilal Ahmed','Mina Patel','Ravi Shah','Noor Ali'].includes(x.label)).length} of 5 present</strong></>)
  if (day === 23) return show('Plan a balanced plate', <><p className="feature-note">A planning aid, not medical advice. Nutrition values are illustrative only.</p>{line(<><input aria-label="Meal" value={text} onChange={e=>setText(e.target.value)} placeholder="Meal or ingredient"/><input aria-label="Calories" type="number" value={value} onChange={e=>setValue(e.target.value)} placeholder="Approx kcal"/><button className="primary" onClick={()=>{if(!text.trim()||Number(value)<=0){setStatus('Add a meal and a positive calorie estimate.');return}add(`${text.trim()} · ${Number(value)} kcal`)}}>Add to plan</button></>)}{items.map(x=><div className="feature-item" key={x.id}>{x.label}</div>)}<strong className="feature-output">Illustrative total: {items.reduce((n,x)=>n+(Number(x.label.match(/(\d+)\s*kcal/i)?.[1])||0),0)} kcal</strong></>)
  if (day === 24) return show('Find an emoji', <><input aria-label="Search emojis" value={text} onChange={e=>setText(e.target.value)} placeholder="Search by emoji name or category…"/><div className="emoji-grid">{emojis.filter((_,i)=>!text||['smile joy party laugh think happy love sleep fire sparkles celebration heart thumbs up rocket plant rainbow coffee idea books art music moon star lemon flower brain tools developer check compass'][i]?.includes(text.toLowerCase())).map((emoji,i)=><button title="Copy emoji" aria-label={`Copy ${emoji}`} key={`${emoji}-${i}`} onClick={()=>{if(!navigator.clipboard?.writeText){setStatus(`Select and copy: ${emoji}`);return}void navigator.clipboard.writeText(emoji).then(()=>setStatus('Emoji copied.')).catch(()=>setStatus(`Select and copy: ${emoji}`))}}>{emoji}</button>)}</div></>)
  if ([25,30,67].includes(day)) return show(day===25?'Build a listening queue':'Your local audio shelf', <><label className="feature-upload">Add audio files<input type="file" accept="audio/*" multiple onChange={e=>setItems(v=>[...v,...Array.from(e.target.files||[]).map(f=>({id:`${Date.now()}-${f.name}`,label:f.name,done:false,url:URL.createObjectURL(f)}))])}/></label>{items.map(x=><div className="feature-item" key={x.id}><span>{x.label}</span>{x.url&&<audio controls preload="metadata" src={x.url}/>}</div>)}{!items.length&&<p className="feature-empty">Your queue is empty. Audio stays in this page; it is not uploaded.</p>}</>)
  if (day === 26) return show('World clock', <div className="clock-grid">{[['Your time',Intl.DateTimeFormat().resolvedOptions().timeZone],['New York','America/New_York'],['London','Europe/London'],['Tokyo','Asia/Tokyo']].map(([name,zone])=><div key={zone}><small>{name} · {zone}</small><strong>{new Intl.DateTimeFormat(undefined,{timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(clock)}</strong><span>{new Intl.DateTimeFormat(undefined,{timeZone:zone,dateStyle:'medium'}).format(clock)}</span></div>)}</div>)
  if (day === 29) return show('International phone field', <><div className="feature-row"><label>Country code<select value={country} onChange={e=>setCountry(e.target.value)}><option value="">Choose country</option><option value="+1">United States · +1</option><option value="+44">United Kingdom · +44</option><option value="+92">Pakistan · +92</option><option value="+91">India · +91</option><option value="+971">UAE · +971</option></select></label><label>Phone number<input type="tel" value={text} onChange={e=>setText(e.target.value.replace(/[^\d ()+-]/g,''))} placeholder="555 010 2040"/></label></div><output className="feature-output">{country&&text?`${country} ${text}`:'Choose a country code and enter a number.'}</output><p className="feature-note">We do not send or verify this phone number.</p></>)
  if ([32,45,48,49,50,83,86].includes(day)) return show('Role-aware sign-in demo', <><p className="feature-note">Local simulation only. No password is stored or sent and this is not real authentication.</p>{line(<><select value={role} onChange={e=>setRole(e.target.value)}><option>Member</option><option>Administrator</option></select><input type="email" placeholder="name@example.com"/><button className="primary" onClick={()=>setStatus(`Previewing ${role} access — demo only.`)}>Preview access</button></>)}</>)
  if ([34].includes(day)) return show('Code 39 barcode preview', <><input maxLength="10" aria-label="Barcode content" value={text} onChange={e=>setText(e.target.value.toUpperCase().replace(/[^0-9A-J .]/g,''))} placeholder="Enter digits or letters A–J"/>{text&&<div className="barcode"><svg viewBox="0 0 520 120" role="img" aria-label={`Barcode for ${text}`}>{text.split('').flatMap((char,ci)=>{const pattern=code39[char]||code39['0'];let x=8+ci*42;return [...pattern].map((width,i)=>{const w=width==='w'?5:2;const rect=<rect key={`${ci}-${i}`} x={x} y="8" width={w} height="80" fill={i%2===0?'#111':'transparent'}/>;x+=w+1;return rect})})}</svg><strong>{text}</strong></div>}<p className="feature-note">Simplified Code 39 sample, limited to encoded digits and A–J. Do not rely on this demo for production inventory or compliance.</p></>)
  if (day === 35 || day === 36) return show('Component workbench', <div className="component-showcase"><button className="primary" onClick={()=>setStatus('Primary action component activated.')}>Primary action</button><button className="soft" onClick={()=>setStatus('Secondary action component activated.')}>Secondary</button><span className="pill">READY</span><label>Example input<input value={text} onChange={e=>setText(e.target.value)} placeholder="Edit this reusable field"/></label><div className="feature-card"><strong>Composable card</strong><p>Small accessible building blocks can be reused throughout a React product.</p><button className="soft" onClick={()=>add(text||'Reusable component example')}>Save a sample</button></div></div>)
  if (day === 37) return show('Extract a page preview', <><p className="feature-note">Browsers block many cross-origin page reads. Paste HTML you own or are permitted to process; scripts are never executed.</p><textarea aria-label="HTML source" value={text} onChange={e=>setText(e.target.value)} placeholder={'<h1>Page title</h1><p>Visible content…</p>'}/><button className="primary" onClick={()=>{const doc=new DOMParser().parseFromString(text,'text/html');setResult([...doc.querySelectorAll('h1,h2,h3,p,a')].map(n=>n.textContent.trim()).filter(Boolean).join('\n')||'No readable headings, paragraphs, or links found.')}}>Parse safe text</button><pre className="feature-output">{result}</pre></>)
  if (day === 38) return show('Dynamic form builder', <><div className="feature-row"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Field label"/><select value={second} onChange={e=>setSecond(e.target.value)}><option value="">Text</option><option>Email</option><option>Number</option></select><button className="primary" onClick={()=>add(`${text.trim()||'New field'} · ${second||'Text'}`)}>Add field</button></div>{items.map(x=><div className="feature-item" key={x.id}>{x.label}<button className="remove" onClick={()=>setItems(v=>v.filter(y=>x.id!==y.id))}>×</button></div>)}</>)
  if ([39,40,41,52].includes(day)) return show('Inspect an HTTP request', <><p className="feature-note">Requests run directly in this browser. Public test URLs may respond; CORS restrictions are enforced by the browser.</p>{line(<><select value={method} onChange={e=>setMethod(e.target.value)}><option>GET</option><option>POST</option></select><input type="url" value={url} onChange={e=>setUrl(e.target.value)} aria-label="Request URL"/><button disabled={loading} className="primary" onClick={request}>{loading?'Requesting…':'Send request'}</button></>) }<pre className="feature-output">{response||'Response status and body will appear here.'}</pre></>)
  if (day === 42) return show('Reducer playground', <><p className="feature-note">Dispatch actions and inspect the state transition like a miniature Redux store.</p><div className="counter">{selected}<div className="feature-row"><button className="soft" onClick={()=>setSelected(n=>n-1)}>decrement</button><button className="primary" onClick={()=>setSelected(n=>n+1)}>increment</button><button className="soft" onClick={()=>setSelected(0)}>reset</button></div></div><output className="feature-output">State: {'{ count: ' + selected + ' }'}</output></>)
  if (day === 56) return show('Payment intent sandbox', <><p className="feature-note">Safe local Stripe pattern preview. No payment provider is connected, no real card is requested, and no charge can be made.</p><div className="feature-card"><strong>Demo order · $24.00</strong><p>In production: create an intent server-side, confirm it with Stripe.js, and verify signed webhooks on your server.</p><button className="primary" onClick={()=>setStatus('Demo checkout complete. No payment was collected.')}>Simulate successful checkout</button></div></>)
  if (day === 61 || day === 63) return show(day===61?'Stick a thought somewhere visible':'Plain text editing desk', <><textarea aria-label="Note text" value={text} onChange={e=>setText(e.target.value)} placeholder="Write something worth remembering…"/>{line(<button className="primary" onClick={()=>add(text)}>Save note</button>)}<div className="feature-notes">{items.map(x=><article key={x.id}><p>{x.label}</p><button className="remove" onClick={()=>setItems(v=>v.filter(y=>y.id!==x.id))}>×</button></article>)}</div></>)
  if (day === 62) return show('Keyboard signal map', <><p className="feature-note">Press a key anywhere on this page. Keys typed into form fields are intentionally ignored.</p><div className="key-map">{['Escape','Tab','CapsLock','Shift','Control','Alt','Space','Enter','ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].map(key=><span className={keys.includes(key)?'is-key':''} key={key}>{key}</span>)}</div><h3>Recently pressed</h3><div className="feature-row">{keys.map((key,i)=><kbd key={`${key}-${i}`}>{key}</kbd>)}</div></>)
  if (day === 64 || day === 59 || day === 60) return show('Order journey timeline', <><p className="feature-note">Sample order #1042 · updates are demonstrations and do not notify a customer.</p>{['Order placed','Payment confirmed','Packed for dispatch','Handed to courier','Out for delivery','Delivered'].map((step,i)=><div className={`timeline ${selected>=i?'complete':''}`} key={step}><button aria-label={`Set order to ${step}`} onClick={()=>setSelected(i)}>{selected>i?'✓':i+1}</button><div><strong>{step}</strong><small>{selected>i?'Completed':selected===i?'Current status':'Upcoming'}</small></div></div>)}</>)
  if (day === 65) return show('Offline notebook storage', <><p className="feature-note">Saved in your browser using IndexedDB; no network request is made.</p><textarea aria-label="Offline note" value={text} onChange={e=>setText(e.target.value)} placeholder="Write an offline note…"/><div className="feature-row"><button className="primary" onClick={() => saveOfflineRecord({ text, setStatus })}>Save offline</button><button className="soft" onClick={() => loadOfflineRecord({ setText, setStatus })}>Load saved draft</button></div></>)
  if (day === 66 || day === 87) {
    const needle = day === 66 ? debouncedSearch : text
    return show(day===66?'Debounced local search':'Highlight a phrase', <><input aria-label="Search term" value={text} onChange={e=>setText(e.target.value)} placeholder="Type to filter these sample records…"/><div className="feature-results">{['Chromatic gradient studies','React state management notes','IndexedDB offline library','Building accessible interfaces','Reusable component patterns'].filter(x=>!needle||x.toLowerCase().includes(needle.toLowerCase())).map(x=><div key={x}>{day===87&&needle&&x.toLowerCase().includes(needle.toLowerCase())?<>{x.slice(0,x.toLowerCase().indexOf(needle.toLowerCase()))}<mark>{x.slice(x.toLowerCase().indexOf(needle.toLowerCase()),x.toLowerCase().indexOf(needle.toLowerCase())+needle.length)}</mark>{x.slice(x.toLowerCase().indexOf(needle.toLowerCase())+needle.length)}</>:x}</div>)}</div></>)
  }
  if (day === 68) return show('Masonry image shelf', <><div className="feature-masonry">{['gradient','sunrise','water','garden','architecture','still life'].map((name,i)=><div key={name} style={{background:['#9788c7','#cc956a','#609293','#87a478','#777987','#ad778e'][i],height:100+(i*31)%100}}><span>{name}</span></div>)}</div><p className="feature-note">A responsive CSS column layout keeps the images flowing as the viewport changes.</p></>)
  if (day === 69) return show('Keyboard-ready slideshow', <><p className="feature-note">Use the arrow keys or buttons to move through the sample slides.</p><div className="slideshow"><button aria-label="Previous slide" onClick={()=>setSelected(n=>(n+4)%5)}>←</button><div style={{background:['#8373ad','#cd9464','#4d8990','#719269','#a86f80'][selected]}}><small>FRAME {selected+1} / 5</small><strong>{['Color study','Desert light','Tidal glass','Quiet garden','Rose afterglow'][selected]}</strong></div><button aria-label="Next slide" onClick={()=>setSelected(n=>(n+1)%5)}>→</button></div></>)
  if (day === 70) return show('Alarm countdown', <><div className="feature-row"><input type="number" min="1" max="240" value={value} onChange={e=>setValue(e.target.value)} placeholder="Minutes"/><button className="primary" onClick={()=>{const n=Number(value);if(!n||n>240){setStatus('Choose 1–240 minutes.');return}setStatus(`Reminder set for ${n} minutes in this tab.`);setTimeout(()=>{if('Notification'in window&&Notification.permission==='granted')new Notification('Reminder',{body:'Your timer is up.'});setStatus('Timer finished.')},n*60000)}}>Set reminder</button></div><p className="feature-note">The page must remain open. Browser notifications require separate permission.</p><button className="soft" onClick={async()=>{if(!('Notification'in window)){setStatus('Notifications are not supported.');return}const permission=await Notification.requestPermission();setStatus(permission==='granted'?'Notifications enabled for this page.':`Notification permission: ${permission}.`)}}>Enable notifications</button></>)
  if (day === 71) return show('URL parts explorer', <><input type="url" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&parseUrl()} placeholder="https://example.com/path?topic=react#intro"/><button className="primary" onClick={parseUrl}>Parse URL</button><pre className="feature-output">{result||'Protocol, host, path, query, and fragment appear here.'}</pre></>)
  if (day === 72) return show('Four-function calculator', <><div className="calc-display" aria-live="polite">{result||text||'0'}</div><div className="calc-grid">{['7','8','9','÷','4','5','6','×','1','2','3','−','C','0','.','+','='].map(key=><button className={key==='='?'primary':'soft'} key={key} onClick={()=>{if(key==='C'){setText('');setResult('');return}if(key==='='){calculate();return}setResult('');setText(s=>s+key)}}>{key}</button>)}</div>{result&&<output className="feature-output">{result}</output>}</>)
  if (day === 73) return show('Walk through the workspace', <><p className="feature-note">A keyboard-accessible tour of the core product areas.</p><div className="tour-card"><small>STEP {selected+1} / 3</small><h3>{['Explore your workspace','Personalize your workflow','Save your progress'][selected]}</h3><p>{['Create and edit items in the primary panel.','Use the controls to adapt the experience to your needs.','Your demo data stays in this browser.'][selected]}</p><div className="feature-row"><button className="soft" disabled={selected===0} onClick={()=>setSelected(s=>s-1)}>Back</button><button className="primary" onClick={()=>selected===2?setSelected(0):setSelected(s=>s+1)}>{selected===2?'Restart tour':'Next'}</button></div></div></>)
  if (day === 75) return show('Local weather preview', <><p className="feature-note">This is a sample forecast. Add a weather provider and secure API configuration to use live conditions.</p><div className="feature-row"><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Enter a city"/><button className="primary" onClick={()=>setCityName(city.trim())}>Check sample</button></div>{cityName&&<div className="weather"><span>✳</span><strong>22°</strong><b>{cityName}</b><small>Partly cloudy · illustrative sample</small></div>}</>)
  if (day === 76) return show('Frontend fundamentals quiz', <><div className="quiz-meta">QUESTION {questionIndex+1} / {quiz.length} · SCORE {score}</div><h3>{quiz[questionIndex].question}</h3><div className="quiz-answers">{quiz[questionIndex].choices.map((choice,i)=><button className={answered===i?(i===quiz[questionIndex].answer?'correct':'incorrect'):''} key={choice} disabled={answered!==null} onClick={()=>{setAnswered(i);if(i===quiz[questionIndex].answer)setScore(s=>s+1)}}>{choice}</button>)}</div><button className="primary" disabled={answered===null} onClick={()=>{if(questionIndex===quiz.length-1){setStatus(`Quiz complete — ${score} / ${quiz.length} correct.`);setQuestionIndex(0);setScore(0)}else setQuestionIndex(i=>i+1);setAnswered(null)}}>{questionIndex===quiz.length-1?'Finish quiz':'Next question'}</button></>)
  if (day === 77) return show('Leave a considered review', <><p className="feature-note">Ratings are stored only in this current session.</p><div className="stars" role="group" aria-label="Choose a star rating">{[1,2,3,4,5].map(n=><button key={n} aria-label={`${n} stars`} aria-pressed={rating===n} onClick={()=>setRating(n)}>{n<=rating?'★':'☆'}</button>)}</div><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="What should another visitor know?"/><button className="primary" onClick={()=>{if(!rating){setStatus('Select a star rating first.');return}add(`${rating}/5 stars · ${text.trim()||'No written comment'}`)}}>Submit sample review</button>{items.map(x=><div className="feature-item" key={x.id}>{x.label}</div>)}</>)
  if (day === 78 || day === 80 || day === 85 || day === 93) return show(day===78?'Convert an image in your browser':day===93?'Compress an image locally':day===85?'Resize an image locally':'Passport portrait workspace', <><p className="feature-note">Files are processed in your browser and are not uploaded. Choose an image to enable export.</p><label className="feature-upload">Choose image<input type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f){if(mediaUrl)URL.revokeObjectURL(mediaUrl);setMediaUrl(URL.createObjectURL(f))}}}/></label>{mediaUrl&&<><img className="feature-photo" src={mediaUrl} alt="Selected local image preview"/><div className="feature-row"><label>Width<input type="number" min="32" max="2400" value={value||800} onChange={e=>setValue(e.target.value)}/></label><select value={second||'image/jpeg'} onChange={e=>setSecond(e.target.value)}><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></select></div><button className="primary" onClick={()=>{const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');const width=Math.min(2400,Math.max(32,Number(value)||800));canvas.width=width;canvas.height=Math.round(width*img.height/img.width);const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);canvas.toBlob(blob=>blob&&download(`day-${day}-image.${second==='image/png'?'png':second==='image/webp'?'webp':'jpg'}`,blob,second||'image/jpeg'),second||'image/jpeg',.84)};img.src=mediaUrl}}>Process and download</button></>}</>)
  if (day === 81) return show('Schedule a calendar event', <><div className="feature-row"><input value={text} onChange={e=>setText(e.target.value)} placeholder="Meeting title"/><input type="datetime-local" value={value} onChange={e=>setValue(e.target.value)}/></div><button className="primary" onClick={()=>{if(!text.trim()||!value){setStatus('Add a title and date first.');return}const start=new Date(value),end=new Date(start.getTime()+3600000),format=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');download('meeting.ics',`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Daybook//Meeting//EN\nBEGIN:VEVENT\nUID:${crypto.randomUUID?.()||Date.now()}@daybook.local\nDTSTAMP:${format(new Date())}\nDTSTART:${format(start)}\nDTEND:${format(end)}\nSUMMARY:${text.replace(/[,;]/g,' ')}\nEND:VEVENT\nEND:VCALENDAR\n`,'text/calendar');setStatus('Calendar invite downloaded. Import it into your calendar to continue.')}}>Download calendar invite</button><p className="feature-note">This downloads an .ics invite. Google Calendar API credentials are not configured.</p></>)
  if (day === 84) return show('Merge PDF documents', <><p className="feature-note">Select and reorder documents. PDFs are processed only in your browser.</p><label className="feature-upload">Choose PDF files<input type="file" accept="application/pdf" multiple onChange={e=>setFiles(Array.from(e.target.files||[]).map((file,i)=>({id:`${i}-${file.name}`,label:file.name,file})))}/></label>{files.map((file,i)=><div className="feature-item" key={file.id}><strong>{i+1}. {file.label}</strong><span><button className="soft" disabled={i===0} onClick={()=>setFiles(current=>{const next=[...current];[next[i-1],next[i]]=[next[i],next[i-1]];return next})}>Move up</button> <button className="remove" aria-label={`Remove ${file.label}`} onClick={()=>setFiles(current=>current.filter(item=>item.id!==file.id))}>×</button></span></div>)}<button className="primary" disabled={!files.length} onClick={() => mergePdfs({ files, download, setStatus })}>Merge and download PDF</button></>)
  if (day === 89) return show('Password health check', <><label>Password to inspect<input type="password" autoComplete="new-password" value={text} onChange={e=>setText(e.target.value)} placeholder="Your password is inspected locally"/></label><div className="strength"><i style={{width:`${Math.min(100,(text.length>=12?35:Math.min(30,text.length*3))+(/[A-Z]/.test(text)?15:0)+(/[a-z]/.test(text)?15:0)+(/[0-9]/.test(text)?15:0)+(/[^A-Za-z0-9]/.test(text)?20:0))}%`}}/></div><output className="feature-output">{!text?'Enter a password to check it':text.length<8?'Needs improvement':text.length>=12&&/[A-Z]/.test(text)&&/[0-9]/.test(text)&&/[^A-Za-z0-9]/.test(text)?'Strong sample — length and character variety look good':'Fair — use a longer, unique passphrase.'}</output><p className="feature-note">Never send or reuse your real password in a demo app.</p></>)
  if (day === 91) return show('Capture a video still', <><label className="feature-upload">Choose video<input type="file" accept="video/*" onChange={e=>{const f=e.target.files?.[0];if(f){if(mediaUrl)URL.revokeObjectURL(mediaUrl);setMediaUrl(URL.createObjectURL(f))}}}/></label>{mediaUrl&&<><video ref={mediaRef} className="feature-video" controls src={mediaUrl} onLoadedData={e=>{const video=e.currentTarget;video.currentTime=0}}/><button className="primary" onClick={()=>{const video=mediaRef.current;if(!video)return;const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);canvas.toBlob(blob=>blob&&download('video-frame.png',blob,'image/png'))}}>Save current frame</button></>}</>)
  if (day === 92) return show('Screen recording', <><p className="feature-note">Sharing is user-initiated and browser permission-gated. Captured video remains on this device.</p><div className="feature-row"><button className="primary" onClick={()=>useCamera(true)}>Choose screen to share</button><button className="soft" disabled={!stream} onClick={stopStream}>Stop sharing</button></div>{stream&&<video ref={mediaRef} autoPlay muted className="feature-video"/>}{status}</>)
  if (day === 94) return show('Intersection observer lab', <><p className="feature-note">Scroll this sample inside the frame. Observer visibility updates do not depend on scroll polling.</p><div className="observer-scroll">{Array.from({length:8},(_,i)=><ObserverTile key={i} index={i+1}/>)}</div></>)
  if (day === 95) return show('Camera privacy preview', <><p className="feature-note">Your browser asks before camera use. Video stays in this tab; stopping shuts off every camera track.</p><div className="feature-row"><button className="primary" onClick={()=>useCamera(false)}>Enable camera</button><button className="soft" disabled={!stream} onClick={stopStream}>Stop camera</button></div><video ref={mediaRef} autoPlay playsInline muted className="feature-video"/><span>{status}</span></>)
  if (day === 97) return show('Package files into a ZIP', <><p className="feature-note">Files are read locally. The ZIP is assembled in your browser.</p><label className="feature-upload">Choose files<input type="file" multiple onChange={e=>setFiles(Array.from(e.target.files||[]).map((f,i)=>({id:`${i}-${f.name}`,label:f.name,done:false,file:f})))}/></label>{files.map(x=><div className="feature-item" key={x.id}>{x.label} · {(x.file.size/1024).toFixed(1)} KB</div>)}<button className="primary" disabled={!files.length} onClick={async()=>{try{const {default:JSZip}=await import('jszip');const zip=new JSZip();files.forEach(x=>zip.file(x.label,x.file));const blob=await zip.generateAsync({type:'blob'});download('project-files.zip',blob,'application/zip');setStatus('ZIP created locally.')}catch(error){setStatus(`Could not create ZIP: ${error.message}`)}}}>Create ZIP</button></>)
  if (day === 98) { const regions={Pakistan:{Sindh:['Karachi','Hyderabad','Sukkur'],Punjab:['Lahore','Multan','Rawalpindi']},India:{Maharashtra:['Mumbai','Pune','Nagpur'],Delhi:['New Delhi']},Canada:{Ontario:['Toronto','Ottawa'],Quebec:['Montreal','Quebec City']}}; const states=regions[country]||{}; return show('Country, region, city', <><div className="feature-row"><label>Country<select value={country} onChange={e=>{setCountry(e.target.value);setStateName('');setCity('')}}><option value="">Select…</option>{Object.keys(regions).map(x=><option key={x}>{x}</option>)}</select></label><label>State / province<select value={stateName} disabled={!country} onChange={e=>{setStateName(e.target.value);setCity('')}}><option value="">Select…</option>{Object.keys(states).map(x=><option key={x}>{x}</option>)}</select></label><label>City<select value={city} disabled={!stateName} onChange={e=>setCity(e.target.value)}><option value="">Select…</option>{(states[stateName]||[]).map(x=><option key={x}>{x}</option>)}</select></label></div><output className="feature-output">{[city,stateName,country].filter(Boolean).join(' · ')||'Select each field in order.'}</output><p className="feature-note">Small built-in sample list. Use a maintained location dataset for production.</p></>) }
  if (day === 100) return show('Voice memo studio', <><p className="feature-note">Audio stays in your browser. The browser will ask for microphone permission; your browser must support MediaRecorder.</p><button className={recording?'soft':'primary'} onClick={recordVoice}>{recording?'Stop recording':'Start voice memo'}</button>{recording&&<span className="recording">● RECORDING</span>}{mediaUrl&&<div className="feature-item"><audio controls src={mediaUrl}/><a className="soft" href={mediaUrl} download="voice-memo.webm">Download memo</a></div>}</>)
  return null
}

function ObserverTile({ index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { root: node.parentElement, threshold: .6 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`observer-tile ${visible?'visible':''}`}>Card {index} <small>{visible?'IN VIEW':'OUT OF VIEW'}</small></div>
}
