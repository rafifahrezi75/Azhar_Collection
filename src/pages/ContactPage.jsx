import PageHeader from '../components/PageHeader'
import ContactMapSection from '../components/ContactMapSection'

export default function ContactPage() {
  return (
    <div className="contact-page">
      <PageHeader
        title="Kontak & Workshop Kami"
        subtitle="Hubungi Tim Marketing Azhar Collection atau Kunjungi Workshop Kami di Buduran, Sidoarjo"
        breadcrumb="Kontak"
      />

      <ContactMapSection />
    </div>
  )
}
