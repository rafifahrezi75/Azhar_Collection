import HeroSlider from '../components/HeroSlider'
import InfoBoxes from '../components/InfoBoxes'
import AboutSection from '../components/AboutSection'
import ProductCatalogSection from '../components/ProductCatalogSection'
import WhyChooseUs from '../components/WhyChooseUs'
import TestimonialSection from '../components/TestimonialSection'
import ContactMapSection from '../components/ContactMapSection'
import CtaBanner from '../components/CtaBanner'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <InfoBoxes />
      <AboutSection />
      <ProductCatalogSection limit={4} showHeader={true} showViewAll={true} />
      <WhyChooseUs />
      <TestimonialSection />
      <ContactMapSection showForm={false} />
      <CtaBanner />
    </>
  )
}
