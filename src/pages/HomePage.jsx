import HeroSlider from '../components/HeroSlider'
import InfoBoxes from '../components/InfoBoxes'
import AboutSection from '../components/AboutSection'
import ProductCatalogSection from '../components/ProductCatalogSection'
import WhyChooseUs from '../components/WhyChooseUs'
import TestimonialSection from '../components/TestimonialSection'
import OrderProcessSection from '../components/OrderProcessSection'
import GallerySection from '../components/GallerySection'
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
      <OrderProcessSection />
      <GallerySection />
      <ContactMapSection showForm={false} />
      <CtaBanner />
    </>
  )
}
