import PageHeader from '../components/PageHeader'
import ServicesSection from '../components/ServicesSection'
import SizeGuideSection from '../components/SizeGuideSection'
import OrderProcessSection from '../components/OrderProcessSection'

export default function ServicesPage() {
  return (
    <div className="services-page">
      <PageHeader
        title="Layanan Jahit Kustom & Production House Garment"
        subtitle="Dapatkan Hasil Jahitan Presisi Rapi Berstandar Tinggi dengan Penawaran Harga Terbaik & Garansi 100% Retur Gratis!"
        breadcrumb="Layanan"
      />

      <ServicesSection />

      <OrderProcessSection />

      <SizeGuideSection />
    </div>
  )
}
