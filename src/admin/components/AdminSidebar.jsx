import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Shirt,
  Users,
  Scissors,
  Newspaper,
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
  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true
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
      label: 'Berita & Artikel',
      path: '/admin/berita',
      icon: Newspaper
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
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `admin-nav-link ${isActive ? 'active' : ''}`
                    }
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="admin-nav-icon" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
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
