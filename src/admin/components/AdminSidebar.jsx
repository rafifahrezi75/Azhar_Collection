import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Shirt,
  Users,
  Scissors,
  Images,
  UserCheck,
  MessageSquare,
  Star,
  Settings,
  ExternalLink,
  X
} from 'lucide-react'

export default function AdminSidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile
}) {
  const location = useLocation()
  const currentPath = location.pathname

  const isItemActive = (item) => {
    if (item.path === '/admin') {
      return (
        currentPath === '/admin' ||
        currentPath === '/admin/' ||
        currentPath === '/admin/dashboard'
      )
    }
    if (item.path === '/admin/galeri') {
      return (
        currentPath.startsWith('/admin/galeri') ||
        currentPath.startsWith('/admin/berita')
      )
    }
    return currentPath.startsWith(item.path)
  }

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard
    },
    {
      label: 'Katalog Produk',
      path: '/admin/katalog',
      icon: Shirt
    },
    {
      label: 'Mitra & Klien',
      path: '/admin/klien',
      icon: Users
    },
    {
      label: 'Layanan Konveksi',
      path: '/admin/layanan',
      icon: Scissors
    },
    {
      label: 'Galeri Foto',
      path: '/admin/galeri',
      icon: Images
    },
    {
      label: 'Tim Marketing',
      path: '/admin/marketing',
      icon: UserCheck
    },
    {
      label: 'Pesan Masuk',
      path: '/admin/pesan',
      icon: MessageSquare
    },
    {
      label: 'Testimoni',
      path: '/admin/testimoni',
      icon: Star
    },
    {
      label: 'Pengaturan',
      path: '/admin/pengaturan',
      icon: Settings
    }
  ]

  return (
    <aside
      className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''} ${
        isMobileOpen ? 'mobile-open' : ''
      }`}
    >
      <div className="admin-sidebar-header">
        <Link to="/admin" className="admin-brand" onClick={onCloseMobile}>
          <div className="admin-brand-logo">A</div>
          {!isCollapsed && (
            <div className="admin-brand-text">
              <span className="admin-brand-name">Azhar Collection</span>
              <span className="admin-brand-tag">Admin Panel</span>
            </div>
          )}
        </Link>

        {isMobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="admin-icon-btn"
            aria-label="Tutup Menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="admin-sidebar-content">
        <div>
          {!isCollapsed && (
            <div className="admin-menu-group-title">Menu Utama</div>
          )}
          <ul className="admin-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isItemActive(item)
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`admin-nav-link ${active ? 'active' : ''}`}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="admin-nav-icon" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="admin-sidebar-footer">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-nav-link"
          title="Buka Website Publik"
          onClick={onCloseMobile}
        >
          <ExternalLink className="admin-nav-icon" />
          {!isCollapsed && <span>Buka Website</span>}
        </Link>
      </div>
    </aside>
  )
}
