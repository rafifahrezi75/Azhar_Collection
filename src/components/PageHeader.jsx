import { Link } from 'react-router-dom'

export default function PageHeader({ title, subtitle, breadcrumb, bgImage }) {
  const style = bgImage
    ? { backgroundImage: `linear-gradient(135deg, rgba(30, 10, 36, 0.88) 0%, rgba(77, 12, 85, 0.84) 100%), url('${bgImage}')` }
    : undefined

  return (
    <section className="subpage-header-banner" style={style}>
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
