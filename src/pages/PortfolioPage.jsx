import PageHeader from '../components/PageHeader'
import ProductCatalogSection from '../components/ProductCatalogSection'

export default function PortfolioPage() {
  return (
    <div className="portfolio-page">
      <PageHeader
        title="Katalog Busana & Seragam"
        subtitle="Dokumentasi busana hasil jahit konveksi Azhar Collection beserta asal sekolah dan instansi pemesan."
        breadcrumb="Katalog"
      />

      <ProductCatalogSection />
    </div>
  )
}

