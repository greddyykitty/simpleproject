import { useEffect, useState } from 'react'
import './App.css'

// You'll need to define VITE_API_KEY in a .env file at project root:
// VITE_API_KEY=your_api_key_here
const API_KEY = import.meta.env.VITE_API_KEY
const ALL_COUNTRIES_URL = `https://api.countrylayer.com/v2/all?access_key=${API_KEY}`

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  // filters/search term and region
  const [sortField, setSortField] = useState(null)
  const [sortDir, setSortDir] = useState(1) // 1 asc, -1 desc

  // fetch all countries on mount
  useEffect(() => {
    fetch(ALL_COUNTRIES_URL)
      .then((r) => r.json())
      .then((data) => setCountries(data))
      .catch(console.error)
  }, [])


  const filtered = countries.filter((c) => {
    const term = filter.toLowerCase()
    if (term) {
      const currencyStr = (c.currencies || [])
        .map((cur) => cur.code + ' ' + (cur.name || ''))
        .join(' ')
      return (
        c.name.toLowerCase().includes(term) ||
        (c.capital || '').toLowerCase().includes(term) ||
        (c.region || '').toLowerCase().includes(term) ||
        currencyStr.toLowerCase().includes(term)
      )
    }
    return true
  }).filter((c) => {
    return !regionFilter || c.region === regionFilter
  })

  // sort the filtered list if requested
  if (sortField) {
    filtered.sort((a, b) => {
      const va = (a[sortField] || '')
      const vb = (b[sortField] || '')
      if (va < vb) return -1 * sortDir
      if (va > vb) return 1 * sortDir
      return 0
    })
  }

  const regions = Array.from(new Set(countries.map((c) => c.region).filter(Boolean)))

  return (
    <div className="App">
      <h1>Country Explorer</h1>

      <section className="filters">
        <input
          placeholder="Search (name, capital, region, currency)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        >
          <option value="">All regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </section>

      <table>
        <thead>
          <tr>
            {['name','capital','region'].map((f) => (
              <th
                key={f}
                onClick={() => {
                  if (sortField === f) setSortDir(sortDir * -1)
                  else {
                    setSortField(f)
                    setSortDir(1)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {sortField === f ? (sortDir === 1 ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
            <th>Currencies</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c.alpha3Code}>
              <td>{c.name}</td>
              <td>{c.capital}</td>
              <td>{c.region}</td>
              <td>{(c.currencies || []).map((cur) => cur.code).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default App
