import React, { useEffect, useMemo, useState } from 'react'

interface Resource {
  id: string
  name: string
  description: string
  showInCalculator: boolean
  usableInRecipes: boolean
}

interface Item {
  id: string
  name: string
  category: string
  description: string
  buildTimeMinutes: number
  showInCalculator: boolean
  resources: Record<string, number>
}

const ResourceCalculator: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [selectedItemId, setSelectedItemId] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetch('/api/resources')
      .then(r => r.json())
      .then(setResources)

    fetch('/api/items')
      .then(r => r.json())
      .then((data: Item[]) => {
        setItems(data)
        if (data.length) setSelectedItemId(data[0].id)
      })
  }, [])

  const selectedItem = items.find(i => i.id === selectedItemId)
  const visibleResources = resources.filter(r => r.showInCalculator)

  const totals = useMemo(() => {
    if (!selectedItem) return {}
    const out: Record<string, number> = {}
    for (const [resId, amt] of Object.entries(selectedItem.resources)) {
      out[resId] = (out[resId] ?? 0) + amt * quantity
    }
    return out
  }, [selectedItem, quantity])

  const totalMinutes = selectedItem
    ? selectedItem.buildTimeMinutes * quantity
    : 0

  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  return (
    <div>
      <h2>⚙️ Shipwright Calculator</h2>
      <p style={{ fontSize: 13, opacity: 0.8 }}>
        Pick a design and we’ll tally the lumber, iron and time needed.
      </p>

      {/* SELECT ITEM + QUANTITY */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <label style={{ fontSize: 13 }}>Item</label>
          <br />
          <select
            value={selectedItemId}
            onChange={e => setSelectedItemId(e.target.value)}
            style={{
              padding: 6,
              minWidth: 200,
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.25)'
            }}
          >
            {items.filter(i => i.showInCalculator).map(i => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 13 }}>Quantity</label>
          <br />
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            style={{
              width: 90,
              padding: 6,
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.25)'
            }}
          />
        </div>
      </div>

      {/* RESOURCE GRID */}
      {selectedItem && (
        <div style={{ marginTop: 18 }}>
          <h3>Resources Required</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 10
            }}
          >
            {visibleResources.map(r => {
              const amount = (totals as any)[r.id] ?? 0
              if (!amount) return null

              return (
                <div
                  key={r.id}
                  style={{
                    padding: 10,
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.12)'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 18 }}>
                    {amount.toLocaleString()}
                  </div>
                  <div
                    style={{ fontSize: 11, opacity: 0.7 }}
                  >
                    {r.description}
                  </div>
                </div>
              )
            })}
          </div>

          {/* TIME CALCULATION */}
          <div
            style={{
              marginTop: 16,
              padding: 10,
              borderRadius: 12,
              background: 'rgba(0,0,0,0.04)'
            }}
          >
            <strong>⏱ Total build time:</strong>{' '}
            {hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResourceCalculator