import { useMemo, useState } from 'react'
import './feature.css'

const charts = {
  Women: [
    { size: 'XS', chest: [76, 82], waist: [58, 64], hip: [84, 90] },
    { size: 'S', chest: [83, 89], waist: [65, 71], hip: [91, 97] },
    { size: 'M', chest: [90, 96], waist: [72, 78], hip: [98, 104] },
    { size: 'L', chest: [97, 104], waist: [79, 86], hip: [105, 112] },
    { size: 'XL', chest: [105, 113], waist: [87, 96], hip: [113, 122] },
  ],
  Men: [
    { size: 'S', chest: [86, 93], waist: [72, 79], hip: [88, 95] },
    { size: 'M', chest: [94, 101], waist: [80, 87], hip: [96, 103] },
    { size: 'L', chest: [102, 109], waist: [88, 96], hip: [104, 111] },
    { size: 'XL', chest: [110, 119], waist: [97, 107], hip: [112, 121] },
    { size: 'XXL', chest: [120, 130], waist: [108, 120], hip: [122, 132] },
  ],
  Unisex: [
    { size: 'XS', chest: [78, 85], waist: [64, 71], hip: [80, 88] },
    { size: 'S', chest: [86, 93], waist: [72, 79], hip: [89, 96] },
    { size: 'M', chest: [94, 101], waist: [80, 87], hip: [97, 104] },
    { size: 'L', chest: [102, 109], waist: [88, 96], hip: [105, 113] },
    { size: 'XL', chest: [110, 120], waist: [97, 108], hip: [114, 124] },
  ],
}

export default function FeatureApp() {
  const [chart, setChart] = useState('Women')
  const [fit, setFit] = useState('Regular')
  const [unit, setUnit] = useState('cm')
  const [measurements, setMeasurements] = useState({ chest: '', waist: '', hip: '' })
  const [showChart, setShowChart] = useState(false)
  const inches = unit === 'in'
  const values = Object.fromEntries(Object.entries(measurements).map(([key, value]) => [key, Number(value) * (inches ? 2.54 : 1)]))
  const filled = Object.values(measurements).filter(Boolean).length
  const recommendation = useMemo(() => {
    if (!filled) return null
    const preferredPosition = fit === 'Close' ? 0.85 : fit === 'Relaxed' ? 0.15 : 0.5
    const score = (row) => Object.entries(values).reduce((total, [key, value]) => {
      if (!value) return total
      const [min, max] = row[key]
      const position = (value - min) / (max - min)
      return total + (position - preferredPosition) ** 2
    }, 0)
    return [...charts[chart]].map((row) => ({ row, score: score(row) })).sort((a, b) => a.score - b.score)[0].row
  }, [chart, filled, fit, values])

  function setValue(key, value) { setMeasurements((current) => ({ ...current, [key]: value })) }

  return (
    <main className="shell">
      <header><a href="#fit-guide"><b>F</b> FIT <em>NOTES</em></a><span>DAY 12 / PERSONAL SIZE GUIDE</span></header>
      <section className="hero" id="fit-guide"><div><small>GET CLOSER TO THE RIGHT FIT</small><h1>Find your starting point.</h1><p>Compare body measurements with a reference chart. Use the brand’s own guide for the final decision—sizing always varies.</p></div><b className="number">12</b></section>
      <section className="fit-grid">
        <article className="fit-form"><small>YOUR MEASUREMENTS</small><div className="fit-options"><label>Chart<select onChange={(event) => setChart(event.target.value)} value={chart}><option>Women</option><option>Men</option><option>Unisex</option></select></label><label>Unit<select onChange={(event) => setUnit(event.target.value)} value={unit}><option value="cm">Centimeters</option><option value="in">Inches</option></select></label></div>
          {['chest', 'waist', 'hip'].map((item) => <label className="measurement-field" key={item}>{item[0].toUpperCase() + item.slice(1)}<span><input inputMode="decimal" max={inches ? '100' : '250'} min={inches ? '16' : '40'} onChange={(event) => setValue(item, event.target.value)} placeholder={item === 'chest' ? 'Around the fullest part' : item === 'waist' ? 'Around the natural waist' : 'Around the fullest part'} step="0.5" type="number" value={measurements[item]} /><small>{unit}</small></span></label>)}
          <label className="fit-ease">Preferred ease<select onChange={(event) => setFit(event.target.value)} value={fit}><option>Close</option><option>Regular</option><option>Relaxed</option></select></label>
          <p className="helper">Measure over light clothing. This estimate compares your filled-in measurements against typical garment charts.</p>
        </article>
        <article className="fit-result">{recommendation ? <><small>YOUR REFERENCE SIZE</small><strong className="fit-size">{recommendation.size}</strong><h2>{fit} fit · {chart} chart</h2><p>Closest match across {filled} measurement{filled === 1 ? '' : 's'}. If you are between sizes, check the garment’s measurements and consider how you prefer it to fit.</p><button className="soft" onClick={() => setShowChart(!showChart)} type="button">{showChart ? 'Hide' : 'View'} reference chart</button></> : <div className="finder-empty"><h2>A more confident choice.</h2><p>Enter at least one measurement to get a starting size.</p></div>}
          {showChart && <div className="size-chart"><table><caption>{chart} reference measurements · cm</caption><thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Hip</th></tr></thead><tbody>{charts[chart].map((row) => <tr key={row.size}><th>{row.size}</th>{['chest', 'waist', 'hip'].map((key) => <td key={key}>{row[key][0]}–{row[key][1]}</td>)}</tr>)}</tbody></table></div>}
        </article>
      </section>
    </main>
  )
}
