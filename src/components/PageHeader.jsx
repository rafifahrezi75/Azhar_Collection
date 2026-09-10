import { Link } from 'react-router-dom'

export default function PageHeader({ title, subtitle, breadcrumb }) {
  return (
    <section className="subpage-header-banner">
      <div className="subpage-header-overlay" />
      <div className="container subpage-header-content">
        <h1 className="subpage-title">{title}</h1>
        {subtitle && <p className="subpage-subtitle">{subtitle}</p>}
        <div className="subpage-breadcrumb">
          <Link to="/" className="breadcrumb-link">Beranda</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{breadcrumb || title}</span>
        </div>
      </div>
    </section>
  )
}
