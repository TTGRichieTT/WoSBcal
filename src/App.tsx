import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from './Layout'
import Harbour from './Harbour'
import ItemsPage from './ItemsPage'
import ResourceCalculator from './ResourceCalculator'
import AdminPage from './AdminPage'
import AdminLogin from './AdminLogin'

interface Settings {
  banner: string
  title: string
  header: string
}

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  // Load site chrome (banner/title/header)
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
  }, [])

  return (
    <>
      <Layout
        banner={settings?.banner}
        title={settings?.title}
        header={settings?.header}
      >
        <Routes>
          <Route path="/" element={<Harbour />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/calculator" element={<ResourceCalculator />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>

      {/* Cog button to open password prompt */}
      <button
        className="cog-button"
        onClick={() => setShowLogin(true)}
      >
        <span>⚙️</span>
      </button>

      {/* Admin login overlay */}
      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default App