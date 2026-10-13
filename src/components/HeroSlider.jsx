import { useState, useEffect } from 'react'
import { heroSlides } from '../data/siteData'

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="hero-slider-section">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
          aria-hidden={index !== activeSlide}
        >
          <img
            src={slide.image}
            alt={`${slide.title} - Konveksi Pakaian Azhar Collection Sidoarjo`}
            className="hero-slide-bg"
            onError={(e) => {
              e.currentTarget.src = '/images/hero/hero-1.png'
            }}
          />
        </div>
      ))}
      <div className="hero-overlay" />
    </section>
  )
}
