import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Item {
  id: string
  name: string
  category: string
  description: string
  buildTimeMinutes: number
}

const Harbour: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    fetch('/api/items')
      .then(r => r.json())
      .then(setItems)
  }, [])

  return (
    <div>
      <h2>Harbour Overview</h2>
      <p style={{ fontSize: 13, opacity: 0.8 }}>
        A quick look at designs available in the dockyard.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 12,
          marginTop: 10
        }}
      >
        {items.map(item => (
          <div
            key={item.id}
            style={{
              padding: 12,
              borderRadius: 14,
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.12)'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6
              }}
            >
              <strong>{item.name}</strong>
              <span style={{ fontSize: 11, opacity: 0.7 }}>{item.category}</span>
            </span>
            </div>
            <p style={{ fontSize: 13, marginTop: 0 }}>{item.description}</p>

            <div style={{ fontSize: 12, opacity: 0.75 }}>
              ⏱ {item.buildTimeMinutes} min build
            </div>

            <Link to="/calculator" style={{ fontSize: 12 }}>
              Open in calculator →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Harbour