import React, { useState } from 'react'
import { ADMIN_PASSWORD } from './admin.config'

interface Props {
  onClose: () => void
}

const AdminLogin: React.FC<Props> = ({ onClose }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('wosb_admin', 'true')
      window.location.href = '/admin'
    } else {
      setError('Wrong password.')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
    >
      <div
        style={{
          background: '#fdf6e3',
          padding: 24,
          borderRadius: 16,
          width: 320,
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
        }}
      >
        <h2>Quartermaster Login</h2>

        <input
          type="password"
          placeholder="Passphrase"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            borderRadius: 8,
            border: '1px solid rgba(0,0,0,0.25)'
          }}
        />

        {error && (
          <p style={{ color: '#b03a2e', fontSize: 12 }}>{error}</p>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            marginTop: 16
          }}
        >
          <button className="button-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" onClick={handleLogin}>
            Enter
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin