import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Harbour' },
  { to: '/calculator', label: 'Resource Calculator' },
  { to: '/items', label: 'Items' },
  { to: '/admin', label: 'Admin' }
]

export const Layout: React.FC<{
  children: React.ReactNode
  banner?: string
  title?: string
  header?: string
}> = ({ children, banner, title, header }) => {
  const location = useLocation()

  return (
    <div className="pirate-shell">
      <div
        className="parchment-card rope-border"
        style={{ maxWidth