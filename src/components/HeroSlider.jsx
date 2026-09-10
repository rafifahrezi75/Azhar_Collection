import { useState, useEffect } from 'react'
import { heroSlides } from '../data/siteData'

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="hero-slider-section">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
        >
          <img
            src={slide.image}
            alt={slide.title || 'Banner Azhar Collection'}
            className="hero-slide-bg"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80'
            }}
          />
          <div className="hero-overlay" />
        </div>
      ))}
    </section>
  )
}
