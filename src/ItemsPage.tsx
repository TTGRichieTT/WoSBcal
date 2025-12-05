import React, { useEffect, useState } from 'react'

interface Item {
  id: string
  name: string
  category: string
  description: string
  buildTimeMinutes: number
}

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    fetch('/api/items')
      .then(r => r.json())
      .then(setItems)
  }, [])

  const groups = items.reduce((acc: Record<string, Item[]>, it) => {
    (acc[it.category] = acc[it.category] || []).push(it)
    return acc
  }, {} as Record<string, Item[]>)

  return (
    <div>
      <h2>Design Catalogue</h2>
      <p style={{ fontSize: 13, opacity: 0.8 }}>
        Everything the shipwrights know how to build.
      </p>

      {Object.entries(groups).map(([cat, group]) => (
        <section key={cat} style={{ marginTop: 14 }}>
          <h3>{cat}</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 12
            }}
          >
            {group.map(item => (
              <div
                key={item.id}
                style={{
                  padding: 10,
                  borderRadius: 12,
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid rgba(0,0,0,0.12)'
                }}
              >
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  ⏱ {item.buildTimeMinutes} min
                </div>
                <p style={{ fontSize: 13 }}>{item.description}</p>
              </div