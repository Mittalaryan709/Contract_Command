import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar.jsx'
import Topbar from '../components/layout/Topbar.jsx'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => setSidebarOpen(prev => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="d-flex min-vh-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="main-content flex-grow-1 d-flex flex-column">
        <Topbar onToggleSidebar={toggleSidebar} />
        <main className="page-content flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
