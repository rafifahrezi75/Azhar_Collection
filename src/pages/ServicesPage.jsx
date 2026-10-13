import PageHeader from '../components/PageHeader'
import ServicesSection from '../components/ServicesSection'
import SizeGuideSection from '../components/SizeGuideSection'
import OrderProcessSection from '../components/OrderProcessSection'

export default function ServicesPage() {
  return (
    <div className="services-page">
      <PageHeader
        title="Layanan Jahit Kustom & Konveksi Pakaian"
        subtitle="Mulai dari seragam sekolah, kemeja kerja PDH/PDL, sablon DTF, hingga bordir komputer dengan spesifikasi bahan dan ukuran yang bisa disesuaikan."
        breadcrumb="Layanan"
      />

      <ServicesSection />

      <OrderProcessSection />

      <SizeGuideSection />
    </div>
  )
}
