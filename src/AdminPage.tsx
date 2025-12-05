import React, { useEffect, useState } from 'react'

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
  thumbnail?: string
}

interface PageMeta {
  slug: string
  title: string
  description: string
}

const AdminPage: React.FC = () => {
  const [isAuthed, setIsAuthed] = useState(false)
  const [resources, setResources] = useState<Resource[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [pages, setPages] = useState<PageMeta[]>([])
  const [settings, setSettings] = useState({ banner: '', title: '', header: '' })

  const [newResource, setNewResource] = useState({
    id: '',
    name: '',
    description: '',
    showInCalculator: true,
    usableInRecipes: true
  })

  const [selectedItemId, setSelectedItemId] = useState('')
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const [newPage, setNewPage] = useState({
    slug: '',
    title: '',
    description: ''
  })

  const [uploadMode, setUploadMode] = useState<'r2' | 'local'>('r2')
  const [uploading, setUploading] = useState(false)

  // Load all admin data
  useEffect(() => {
    setIsAuthed(localStorage.getItem('wosb_admin') === 'true')

    fetch('/api/resources').then(r => r.json()).then(setResources)
    fetch('/api/items')
      .then(r => r.json())
      .then((data: Item[]) => {
        setItems(data)
        if (data.length) setSelectedItemId(data[0].id)
      })

    fetch('/api/pages').then(r => r.json()).then(setPages)
    fetch('/api/settings').then(r => r.json()).then(setSettings)
  }, [])

  useEffect(() => {
    const it = items.find(i => i.id === selectedItemId) || null
    setEditingItem(it)
  }, [selectedItemId, items])

  //
  // SAVE SETTINGS
  //
  const saveSettings = () => {
    fetch('/api/save-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).then(() => alert('Settings saved.'))
  }

  //
  // RESOURCES
  //
  const saveResources = (data: Resource[]) => {
    setResources(data)
    fetch('/api/save-resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  const addResource = () => {
    if (!newResource.id || !newResource.name) return
    saveResources([...resources, newResource as Resource])
    setNewResource({
      id: '',
      name: '',
      description: '',
      showInCalculator: true,
      usableInRecipes: true
    })
  }

  const toggleResourceFlag = (
    id: string,
    key: 'showInCalculator' | 'usableInRecipes'
  ) => {
    const next = resources.map(r =>
      r.id === id ? { ...r, [key]: !r[key] } : r
    )
    saveResources(next)
  }

  //
  // ITEMS
  //
  const updateItemResourceAmount = (resId: string, value: number) => {
    if (!editingItem) return
    const next: Item = {
      ...editingItem,
      resources: { ...editingItem.resources, [resId]: value }
    }
    setEditingItem(next)
  }

  const toggleItemResource = (resId: string) => {
    if (!editingItem) return
    const has =
      editingItem.resources[resId] != null &&
      editingItem.resources[resId] > 0
    const nextRes = { ...editingItem.resources }
    if (has) delete nextRes[resId]
    else nextRes[resId] = 1
    setEditingItem({ ...editingItem, resources: nextRes })
  }

  const saveItem = () => {
    if (!editingItem) return
    const others = items.filter(i => i.id !== editingItem.id)
    const next = [...others, editingItem]
    setItems(next)
    fetch('/api/save-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next)
    }).then(() => alert('Item saved.'))
  }

  //
  // PAGES
  //
  const addPage = () => {
    if (!newPage.slug || !newPage.title) return
    const next = [...pages, newPage]
    setPages(next)
    fetch('/api/save-pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next)
    }).then(() => alert('Page added.'))
    setNewPage({ slug: '', title: '', description: '' })
  }

  //
  // UPLOAD THUMBNAIL
  //
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return

    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch(`/api/upload?mode=${uploadMode}`, {
        method: 'POST',
        body: form
      })

      const data = await res.json()

      if (data.ok && data.url) {
        setEditingItem({ ...editingItem, thumbnail: data.url })
      } else {
        alert('Upload failed.')
      }
    } catch (err) {
      console.error(err)
      alert('Upload error.')
    } finally {
      setUploading(false)
    }
  }

  if (!isAuthed) {
    return (
      <div>
        <h2>Admin</h2>
        <p>Access denied. Use the ⚙️ cog button to log in.</p>
      </div>
    )
  }

  return (
    <div>
      <h2>🧭 Dockyard Console</h2>

      {/* SETTINGS */}
      <section style={{ marginTop: 16 }}>
        <h3>Site Chrome</h3>
        <div style={{ display: 'grid', gap: 6, maxWidth: 420 }}>
          <input
            placeholder="Banner"
            value={settings.banner}
            onChange={e => setSettings({ ...settings, banner: e.target.value })}
          />
          <input
            placeholder="Title"
            value={settings.title}
            onChange={e => setSettings({ ...settings, title: e.target.value })}
          />
          <input
            placeholder="Header"
            value={settings.header}
            onChange={e => setSettings({ ...settings, header: e.target.value })}
          />
        </div>
        <button
          className="button-primary"
          style={{ marginTop: 8 }}
          onClick={saveSettings}
        >
          Save Chrome
        </button>
      </section>

      {/* RESOURCES */}
      <section style={{ marginTop: 22 }}>
        <h3>Resources</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            opacity: 0.7
          }}
        >
          <div>Name</div>
          <div>Show</div>
          <div>Crafting</div>
        </div>

        {resources.map(r => (
          <div
            key={r.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1fr',
              gap: 6,
              padding: '4px 0',
              alignItems: 'center'
            }}
          >
            <div>{r.name}</div>

            <label style={{ fontSize: 12 }}>
              <input
                type="checkbox"
                checked={r.showInCalculator}
                onChange={() => toggleResourceFlag(r.id, 'showInCalculator')}
              />
              Show
            </label>

            <label style={{ fontSize: 12 }}>
              <input
                type="checkbox"
                checked={r.usableInRecipes}
                onChange={() =>
                  toggleResourceFlag(r.id, 'usableInRecipes')
                }
              />
              Crafting
            </label>
          </div>
        ))}

        <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <input
            placeholder="ID (e.g. steel)"
            value={newResource.id}
            onChange={e => setNewResource({ ...newResource, id: e.target.value })}
          />
          <input
            placeholder="Name"
            value={newResource.name}
            onChange={e => setNewResource({ ...newResource, name: e.target.value })}
          />
          <input
            placeholder="Description"
            value={newResource.description}
            onChange={e =>
              setNewResource({ ...newResource, description: e.target.value })
            }
          />
          <button className="button-primary" onClick={addResource}>
            Add Resource
          </button>
        </div>
      </section>

      {/* ITEMS */}
      <section style={{ marginTop: 22 }}>
        <h3>Items & Recipes</h3>

        {items.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: 13 }}>Item:</span>
            <select
              value={selectedItemId}
              onChange={e => setSelectedItemId(e.target.value)}
              style={{
                padding: 6,
                borderRadius: 8,
                border: '1px solid rgba(0,0,0,0.25)'
              }}
            >
              {items.map(i => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {editingItem && (
          <div
            style={{
              marginTop: 12,
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)',
              gap: 16
            }}
          >
            {/* LEFT SIDE */}
            <div>
              <div style={{ display: 'grid', gap: 6 }}>
                <input
                  value={editingItem.name}
                  onChange={e =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  placeholder="Item name"
                />
                <input
                  value={editingItem.category}
                  onChange={e =>
                    setEditingItem({
                      ...editingItem,
                      category: e.target.value
                    })
                  }
                  placeholder="Category"
                />
                <textarea
                  value={editingItem.description}
                  onChange={e =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value
                    })
                  }
                  placeholder="Description"
                  rows={3}
                />
                <label style={{ fontSize: 13 }}>
                  Build time (minutes)
                  <input
                    type="number"
                    value={editingItem.buildTimeMinutes}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        buildTimeMinutes: Number(e.target.value)
                      })
                    }
                  />
                </label>

                <label style={{ fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={editingItem.showInCalculator}
                    onChange={e =>
                      setEditingItem({
                        ...editingItem,
                        showInCalculator: e.target.checked
                      })
                    }
                  />
                  Show in calculator
                </label>

                {/* THUMBNAIL */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    Thumbnail image
                  </div>

                  {editingItem.thumbnail && (
                    <img
                      src={editingItem.thumbnail}
                      alt="thumb"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 120,
                        borderRadius: 8,
                        marginBottom: 6
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    <select
                      value={uploadMode}
                      onChange={e =>
                        setUploadMode(e.target.value as 'r2' | 'local')
                      }
                    >
                      <option value="r2">Cloudflare R2 (Permanent)</option>
                      <option value="local">Local Upload (Server)</option>
                    </select>

                    <input type="file" onChange={handleUpload} />

                    {uploading && (
                      <span style={{ fontSize: 12 }}>Uploading…</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <div style={{ fontSize: 13, marginBottom: 4 }}>
                Resources used
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  marginBottom: 8
                }}
              >
                {resources
                  .filter(r => r.usableInRecipes)
                  .map(r => {
                    const active =
                      editingItem.resources[r.id] != null &&
                      editingItem.resources[r.id] > 0

                    return (
                      <button
                        key={r.id}
                        type="button"
                        className={active ? 'nav-pill active' : 'nav-pill'}
                        onClick={() => toggleItemResource(r.id)}
                      >
                        {r.name}
                      </button>
                    )
                  })}
              </div>

              <div style={{ display: 'grid', gap: 4 }}>
                {Object.entries(editingItem.resources).map(
                  ([resId, amount]) => {
                    const res = resources.find(r => r.id === resId)
                    if (!res) return null

                    return (
                      <div
                        key={resId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <div style={{ width: 90 }}>{res.name}</div>
                        <input
                          type="number"
                          value={amount}
                          onChange={e =>
                            updateItemResourceAmount(
                              resId,
                              Number(e.target.value)
                            )
                          }
                          style={{ width: 90 }}
                        />
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        )}

        <button
          className="button-primary"
          style={{ marginTop: 10 }}
          onClick={saveItem}
        >
          Save Item
        </button>
      </section>

      {/* PAGES */}
      <section style={{ marginTop: 22 }}>
        <h3>Pages</h3>

        {pages.map(p => (
          <div key={p.slug} style={{ fontSize: 13 }}>
            {p.slug} – {p.title}
          </div>
        ))}

        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <input
            placeholder="slug"
            value={newPage.slug}
            onChange={e =>
              setNewPage({ ...newPage, slug: e.target.value })
            }
          />
          <input
            placeholder="Title"
            value={newPage.title}
            onChange={e =>
              setNewPage({ ...newPage, title: e.target.value })
            }
          />
          <input
            placeholder="Description"
            value={newPage.description}
            onChange={e =>
              setNewPage({ ...newPage, description: e.target.value })
            }
          />

          <button className="button-primary" onClick={addPage}>
            Add Page
          </button>
        </div>
      </section>
    </div>
  )
}

export default AdminPage