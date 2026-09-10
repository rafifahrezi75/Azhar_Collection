import PageHeader from '../components/PageHeader'
import ProductCatalogSection from '../components/ProductCatalogSection'

export default function PortfolioPage() {
  return (
    <div className="portfolio-page">
      <PageHeader
        title="Katalog Baju Yang Pernah Dikerjakan"
        subtitle="Daftar Lengkap Busana & Seragam Hasil Produksi Azhar Collection Beserta Asal Sekolah & Instansi Pemesan"
        breadcrumb="Katalog"
      />

      <ProductCatalogSection />
    </div>
  )
}

